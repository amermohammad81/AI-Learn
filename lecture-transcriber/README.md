# LectureTranscriber (محاضرتي) - MVP v0.1

A minimal, production-ready local MVP to transcribe lecture audio files into text.

## Stack

- Backend: FastAPI + Uvicorn (Python 3.12)
- STT: Groq Whisper (default) or OpenAI Whisper (configurable via `.env`)
- Frontend: Next.js 15 (App Router) + TypeScript + Tailwind CSS + shadcn-style UI primitives

## Project Structure

```text
text/lecture-transcriber
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env.example
│   └── uploads/
├── frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── UploadArea.tsx
│   │   └── ui/
│   ├── lib/
│   └── package.json
├── README.md
└── docker-compose.yml
```

## Backend Setup

```bash
cd text/lecture-transcriber/backend
python -m venv .venv
# Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# macOS/Linux:
# source .venv/bin/activate

pip install -r requirements.txt
Copy-Item .env.example .env
```

Set your API key in `.env`:

- Default (recommended): `STT_PROVIDER=groq` and set `GROQ_API_KEY`
- Alternative: `STT_PROVIDER=openai` and set `OPENAI_API_KEY`

Run backend:

```bash
uvicorn main:app --reload --port 8000
```

Health check:

```bash
curl http://localhost:8000/health
```

## Frontend Setup

```bash
cd text/lecture-transcriber/frontend
Copy-Item .env.example .env.local
npm install
npm run dev
```

Open: `http://localhost:3000`

## Features in v0.1

- Upload audio (`mp3`, `m4a`, `wav`, `ogg`) up to 150MB
- Transcribe with Whisper through Groq/OpenAI API
- Show transcript with Arabic RTL-friendly UI
- Copy transcript to clipboard
- Download transcript as `.txt`
- Placeholder next-step button for future LLM pipeline

## API Contract

`POST /api/transcribe` with multipart form field `file`

Response:

```json
{
  "transcript": "full text here...",
  "duration_seconds": 123,
  "language": "ar",
  "provider": "groq",
  "processing_seconds": 8.41
}
```

## Optional Docker Compose

```bash
docker compose up --build
```

This starts:
- Backend on `http://localhost:8000`
- Frontend on `http://localhost:3000`
