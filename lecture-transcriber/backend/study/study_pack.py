from study.flashcards import generate_flashcards
from study.llm_client import LLM_MODEL
from study.quizzes import generate_quizzes
from study.schemas import StudyPackRequest, StudyPackResponse
from study.summarize import generate_summary


def generate_study_pack(payload: StudyPackRequest) -> StudyPackResponse:
    # Best-effort generation: avoid failing the full response when one section degrades.
    try:
        summary = generate_summary(
            transcript=payload.transcript,
            language=payload.language,
            bullets=payload.summary_bullets,
        )
    except Exception:
        summary = payload.transcript[:2000] if payload.transcript else "Summary unavailable."

    try:
        flashcards = generate_flashcards(
            transcript=payload.transcript,
            language=payload.language,
            count=payload.flashcard_count,
        )
    except Exception:
        flashcards = []

    try:
        quizzes = generate_quizzes(
            transcript=payload.transcript,
            language=payload.language,
            count=payload.quiz_count,
        )
    except Exception:
        quizzes = []

    return StudyPackResponse(
        summary=summary,
        flashcards=flashcards,
        quizzes=quizzes,
        model=LLM_MODEL,
    )
