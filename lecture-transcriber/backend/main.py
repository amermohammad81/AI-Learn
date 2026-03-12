import os
import re
import shutil
import subprocess
import tempfile
import threading
import time
import uuid
from pathlib import Path
from typing import Literal

from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from openai import APIConnectionError, APITimeoutError, OpenAI
from study.schemas import StudyPackRequest, StudyPackResponse
from study.study_pack import generate_study_pack
from transcript_cleaner import clean_mixed_transcript


load_dotenv()

app = FastAPI(title="LectureTranscriber API", version="0.1.0")

# Allow Next.js local dev server.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path(__file__).parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

MAX_FILE_SIZE_BYTES = 150 * 1024 * 1024
ALLOWED_EXTENSIONS = {".mp3", ".m4a", ".wav", ".ogg"}
STT_TIMEOUT_SECONDS = float(os.getenv("STT_TIMEOUT_SECONDS", "900"))
STT_MAX_RETRIES = int(os.getenv("STT_MAX_RETRIES", "2"))
STT_CHUNKING_ENABLED = os.getenv("STT_CHUNKING_ENABLED", "true").strip().lower() == "true"
STT_CHUNK_SECONDS = int(os.getenv("STT_CHUNK_SECONDS", "600"))
FFMPEG_BINARY = os.getenv("FFMPEG_BINARY", "ffmpeg")
STT_LONG_AUDIO_THRESHOLD_BYTES = int(os.getenv("STT_LONG_AUDIO_THRESHOLD_BYTES", str(25 * 1024 * 1024)))
PROCESS_DEFAULT_SUMMARY_BULLETS = int(os.getenv("PROCESS_DEFAULT_SUMMARY_BULLETS", "12"))
PROCESS_DEFAULT_FLASHCARDS = int(os.getenv("PROCESS_DEFAULT_FLASHCARDS", "20"))
PROCESS_DEFAULT_QUIZZES = int(os.getenv("PROCESS_DEFAULT_QUIZZES", "10"))

Provider = Literal["groq", "openai"]
JOBS_LOCK = threading.Lock()
PROCESS_JOBS: dict[str, dict] = {}


def get_provider() -> Provider:
    provider = os.getenv("STT_PROVIDER", "groq").strip().lower()
    if provider not in {"groq", "openai"}:
        raise RuntimeError("STT_PROVIDER must be either 'groq' or 'openai'.")
    return provider  # type: ignore[return-value]


def get_client_and_model() -> tuple[OpenAI, str, Provider]:
    provider = get_provider()

    if provider == "groq":
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise RuntimeError("Missing GROQ_API_KEY for STT_PROVIDER=groq")
        base_url = os.getenv("GROQ_BASE_URL", "https://api.groq.com/openai/v1")
        model = os.getenv("GROQ_WHISPER_MODEL", "whisper-large-v3-turbo")
        return OpenAI(api_key=api_key, base_url=base_url, timeout=STT_TIMEOUT_SECONDS), model, provider

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("Missing OPENAI_API_KEY for STT_PROVIDER=openai")
    model = os.getenv("OPENAI_WHISPER_MODEL", "whisper-1")
    return OpenAI(api_key=api_key, timeout=STT_TIMEOUT_SECONDS), model, provider


def estimate_token_count(text: str) -> int:
    # Lightweight estimate that works reasonably for Arabic and English text.
    units = re.findall(r"\w+|[^\w\s]", text, flags=re.UNICODE)
    return len(units)


def ffmpeg_is_available() -> bool:
    return shutil.which(FFMPEG_BINARY) is not None


def split_audio_into_chunks(input_path: Path, output_dir: Path) -> list[Path]:
    suffix = input_path.suffix.lower()
    output_pattern = output_dir / f"chunk_%03d{suffix}"
    cmd = [
        FFMPEG_BINARY,
        "-hide_banner",
        "-loglevel",
        "error",
        "-y",
        "-i",
        str(input_path),
        "-f",
        "segment",
        "-segment_time",
        str(STT_CHUNK_SECONDS),
        "-c",
        "copy",
        str(output_pattern),
    ]
    subprocess.run(cmd, check=True)
    chunks = sorted(output_dir.glob(f"chunk_*{suffix}"))
    return chunks


def transcribe_with_retries(client: OpenAI, model: str, audio_path: Path):
    response = None
    for attempt in range(STT_MAX_RETRIES + 1):
        try:
            with audio_path.open("rb") as audio_file:
                response = client.audio.transcriptions.create(
                    model=model,
                    file=audio_file,
                    response_format="verbose_json",
                )
            break
        except (APIConnectionError, APITimeoutError):
            if attempt >= STT_MAX_RETRIES:
                raise
            time.sleep(1.5 * (attempt + 1))
    if response is None:
        raise RuntimeError("Transcription did not return a response.")
    return response


def set_job_state(job_id: str, **updates) -> None:
    with JOBS_LOCK:
        job = PROCESS_JOBS.get(job_id)
        if not job:
            return
        job.update(updates)
        job["updated_at"] = time.time()


def transcribe_saved_audio(saved_path: Path, file_size_bytes: int, progress_cb=None) -> dict:
    if STT_CHUNKING_ENABLED and not ffmpeg_is_available() and file_size_bytes >= STT_LONG_AUDIO_THRESHOLD_BYTES:
        raise RuntimeError(
            "Long audio detected but ffmpeg is not installed, so chunking cannot run. "
            "Install ffmpeg and retry. Example (Windows): winget install --id Gyan.FFmpeg -e"
        )

    client, model, provider = get_client_and_model()
    raw_parts: list[str] = []
    durations: list[float] = []
    languages: list[str] = []
    chunk_count = 1
    used_chunking = False

    if STT_CHUNKING_ENABLED and ffmpeg_is_available():
        with tempfile.TemporaryDirectory(prefix="chunks_", dir=str(UPLOAD_DIR)) as temp_dir:
            try:
                chunk_paths = split_audio_into_chunks(saved_path, Path(temp_dir))
            except Exception:
                chunk_paths = []

            if chunk_paths:
                chunk_count = len(chunk_paths)
                used_chunking = chunk_count > 1
                for idx, chunk_path in enumerate(chunk_paths, start=1):
                    if progress_cb:
                        pct = 8 + int((idx - 1) / max(chunk_count, 1) * 62)
                        progress_cb(pct, f"Transcribing part {idx}/{chunk_count}")
                    response = transcribe_with_retries(client, model, chunk_path)
                    raw_parts.append(getattr(response, "text", "") or "")
                    durations.append(float(getattr(response, "duration", 0) or 0))
                    lang = (getattr(response, "language", "unknown") or "unknown").strip().lower()
                    if lang and lang != "unknown":
                        languages.append(lang)
            else:
                if progress_cb:
                    progress_cb(20, "Transcribing audio")
                response = transcribe_with_retries(client, model, saved_path)
                raw_parts.append(getattr(response, "text", "") or "")
                durations.append(float(getattr(response, "duration", 0) or 0))
                lang = (getattr(response, "language", "unknown") or "unknown").strip().lower()
                if lang and lang != "unknown":
                    languages.append(lang)
    else:
        if progress_cb:
            progress_cb(20, "Transcribing audio")
        response = transcribe_with_retries(client, model, saved_path)
        raw_parts.append(getattr(response, "text", "") or "")
        durations.append(float(getattr(response, "duration", 0) or 0))
        lang = (getattr(response, "language", "unknown") or "unknown").strip().lower()
        if lang and lang != "unknown":
            languages.append(lang)

    duration_seconds = int(sum(durations)) if durations else 0
    language = languages[0] if languages else "unknown"
    raw_transcript = "\n".join(part.strip() for part in raw_parts if part.strip())
    transcript, cleaning_used_llm = clean_mixed_transcript(raw_transcript, language)
    token_count = estimate_token_count(transcript)

    if progress_cb:
        progress_cb(74, "Preparing transcript")

    return {
        "transcript": transcript,
        "raw_transcript": raw_transcript,
        "token_count": token_count,
        "duration_seconds": duration_seconds,
        "language": language,
        "provider": provider,
        "cleaning_used_llm": cleaning_used_llm,
        "chunking_used": used_chunking,
        "chunk_count": chunk_count,
    }


def process_job_worker(job_id: str, saved_path: Path, file_size_bytes: int) -> None:
    started = time.time()
    try:
        set_job_state(job_id, status="running", stage="transcribing", message="Converting audio to text", progress=8)

        def progress_cb(progress: int, message: str) -> None:
            set_job_state(job_id, status="running", stage="transcribing", message=message, progress=progress)

        transcription = transcribe_saved_audio(saved_path, file_size_bytes, progress_cb=progress_cb)

        set_job_state(job_id, status="running", stage="generating", message="Creating summary and practice material", progress=82)
        requested_language = transcription["language"] if transcription["language"] in {"ar", "en"} else "auto"
        payload = StudyPackRequest(
            transcript=transcription["transcript"],
            language=requested_language,  # type: ignore[arg-type]
            summary_bullets=PROCESS_DEFAULT_SUMMARY_BULLETS,
            flashcard_count=PROCESS_DEFAULT_FLASHCARDS,
            quiz_count=PROCESS_DEFAULT_QUIZZES,
        )
        study_pack = generate_study_pack(payload).model_dump()

        set_job_state(
            job_id,
            status="completed",
            stage="done",
            message="Done",
            progress=100,
            result={
                "duration_seconds": transcription["duration_seconds"],
                "language": transcription["language"],
                "study_pack": study_pack,
            },
            processing_seconds=round(time.time() - started, 2),
        )
    except Exception as exc:
        set_job_state(
            job_id,
            status="failed",
            stage="failed",
            message="Processing failed",
            error=str(exc),
            processing_seconds=round(time.time() - started, 2),
        )
    finally:
        try:
            if saved_path.exists():
                saved_path.unlink()
        except Exception:
            pass


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/transcribe")
async def transcribe_audio(file: UploadFile = File(...)) -> JSONResponse:
    start = time.time()

    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported format. Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}",
        )

    unique_name = f"{uuid.uuid4()}{suffix}"
    saved_path = UPLOAD_DIR / unique_name

    bytes_written = 0
    try:
        with saved_path.open("wb") as buffer:
            while True:
                chunk = await file.read(1024 * 1024)
                if not chunk:
                    break
                bytes_written += len(chunk)
                if bytes_written > MAX_FILE_SIZE_BYTES:
                    raise HTTPException(status_code=413, detail="File too large. Max size is 150MB.")
                buffer.write(chunk)

        transcription = transcribe_saved_audio(saved_path, bytes_written)

        processing_seconds = round(time.time() - start, 2)

        return JSONResponse(
            content={
                **transcription,
                "processing_seconds": processing_seconds,
            }
        )

    except HTTPException:
        raise
    except APIConnectionError as exc:
        raise HTTPException(
            status_code=504,
            detail=(
                "Transcription failed due to network/provider connection drop. "
                "For long audio, enable chunking with ffmpeg and retry."
            ),
        ) from exc
    except APITimeoutError as exc:
        raise HTTPException(
            status_code=504,
            detail="Transcription request timed out at provider. Try smaller chunks and retry.",
        ) from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Transcription failed: {exc}") from exc
    finally:
        try:
            if saved_path.exists():
                saved_path.unlink()
        except Exception:
            # Avoid masking the original error if cleanup fails.
            pass
        await file.close()


@app.post("/api/process/start")
async def start_process(file: UploadFile = File(...)) -> JSONResponse:
    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported format. Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}",
        )

    job_id = str(uuid.uuid4())
    saved_path = UPLOAD_DIR / f"{job_id}{suffix}"
    bytes_written = 0
    try:
        with saved_path.open("wb") as buffer:
            while True:
                chunk = await file.read(1024 * 1024)
                if not chunk:
                    break
                bytes_written += len(chunk)
                if bytes_written > MAX_FILE_SIZE_BYTES:
                    raise HTTPException(status_code=413, detail="File too large. Max size is 150MB.")
                buffer.write(chunk)

        if STT_CHUNKING_ENABLED and not ffmpeg_is_available() and bytes_written >= STT_LONG_AUDIO_THRESHOLD_BYTES:
            raise HTTPException(
                status_code=503,
                detail=(
                    "Long audio detected but ffmpeg is not installed, so chunking cannot run. "
                    "Install ffmpeg and retry. Example (Windows): winget install --id Gyan.FFmpeg -e"
                ),
            )

        now = time.time()
        with JOBS_LOCK:
            PROCESS_JOBS[job_id] = {
                "job_id": job_id,
                "status": "queued",
                "stage": "queued",
                "message": "Queued",
                "progress": 2,
                "created_at": now,
                "updated_at": now,
                "result": None,
                "error": None,
            }

        worker = threading.Thread(
            target=process_job_worker,
            args=(job_id, saved_path, bytes_written),
            daemon=True,
        )
        worker.start()
        return JSONResponse(content={"job_id": job_id})
    except HTTPException:
        try:
            if saved_path.exists():
                saved_path.unlink()
        except Exception:
            pass
        raise
    except Exception as exc:
        try:
            if saved_path.exists():
                saved_path.unlink()
        except Exception:
            pass
        raise HTTPException(status_code=500, detail=f"Failed to start processing: {exc}") from exc
    finally:
        await file.close()


@app.get("/api/process/status/{job_id}")
def get_process_status(job_id: str) -> JSONResponse:
    with JOBS_LOCK:
        job = PROCESS_JOBS.get(job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Job not found.")
        return JSONResponse(content=job)


@app.post("/api/study-pack", response_model=StudyPackResponse)
async def create_study_pack(payload: StudyPackRequest) -> StudyPackResponse:
    try:
        return generate_study_pack(payload)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Study pack generation failed: {exc}") from exc
