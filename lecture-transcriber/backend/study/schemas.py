from typing import Literal

from pydantic import BaseModel, Field


class StudyPackRequest(BaseModel):
    transcript: str = Field(min_length=20, description="Transcript text generated from audio.")
    language: Literal["auto", "en", "ar"] = "auto"
    summary_bullets: int = Field(default=12, ge=6, le=20)
    flashcard_count: int = Field(default=20, ge=20, le=40)
    quiz_count: int = Field(default=10, ge=5, le=20)


class Flashcard(BaseModel):
    question: str
    answer: str


class QuizQuestion(BaseModel):
    question: str
    options: list[str] = Field(min_length=4, max_length=4)
    correct_index: int = Field(ge=0, le=3)
    explanation: str


class StudyPackResponse(BaseModel):
    summary: str
    flashcards: list[Flashcard]
    quizzes: list[QuizQuestion]
    model: str
