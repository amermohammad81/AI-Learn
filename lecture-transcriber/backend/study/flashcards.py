from study.llm_client import generate_json
from study.schemas import Flashcard


def generate_flashcards(transcript: str, language: str, count: int) -> list[Flashcard]:
    system_prompt = (
        "You are an expert tutor. "
        "Generate high-quality flashcards for serious exam preparation. "
        "Questions should cover definitions, mechanisms, comparisons, and applications."
    )
    user_prompt = f"""
Target language: {language}
Return JSON only using this shape:
{{
  "flashcards": [
    {{"question": "string", "answer": "string"}}
  ]
}}
Generate up to {count} flashcards (as many high-quality cards as possible).
Rules:
- Keep each question clear and specific.
- Keep each answer concise but complete (1-3 sentences).
- Ensure broad coverage of the transcript, not repetition.
- Include a mix of foundational and higher-order reasoning cards.

Transcript:
{transcript}
"""
    data = generate_json(system_prompt=system_prompt, user_prompt=user_prompt)
    raw_cards = data.get("flashcards")
    if not isinstance(raw_cards, list):
        raw_cards = []

    cards: list[Flashcard] = []
    for item in raw_cards[:count]:
        if isinstance(item, dict):
            question = item.get("question")
            answer = item.get("answer")
            if isinstance(question, str) and isinstance(answer, str) and question.strip() and answer.strip():
                cards.append(Flashcard(question=question.strip(), answer=answer.strip()))

    # Best-effort mode: never fail if fewer cards are returned.
    # Returning partial cards is better than throwing and wasting a paid request.
    if not cards:
        snippet = transcript[:400].strip()
        cards = [
            Flashcard(
                question="What is the main topic of this lecture?",
                answer=snippet if snippet else "No clear content available.",
            )
        ]
    return cards
