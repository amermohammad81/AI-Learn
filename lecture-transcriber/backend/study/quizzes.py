from study.llm_client import generate_json
from study.schemas import QuizQuestion


def generate_quizzes(transcript: str, language: str, count: int) -> list[QuizQuestion]:
    system_prompt = (
        "You are an expert teacher and exam writer. "
        "Generate high-quality multiple-choice questions with one correct answer. "
        "Questions should test understanding, not only memorization."
    )
    user_prompt = f"""
Target language: {language}
Return JSON only using this shape:
{{
  "quizzes": [
    {{
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "correct_index": 0,
      "explanation": "string"
    }}
  ]
}}
Generate exactly {count} quiz questions.
Each question must have exactly 4 options.
correct_index must be 0..3.
Rules:
- Avoid trivial wording and ambiguous options.
- Include conceptual and applied questions.
- Keep distractors plausible.
- Provide concise explanation for why the correct option is correct.

Transcript:
{transcript}
"""
    data = generate_json(system_prompt=system_prompt, user_prompt=user_prompt)
    raw_quizzes = data.get("quizzes")
    if not isinstance(raw_quizzes, list):
        raise RuntimeError("Quiz generation failed.")

    quizzes: list[QuizQuestion] = []
    for item in raw_quizzes[:count]:
        if not isinstance(item, dict):
            continue
        question = item.get("question")
        options = item.get("options")
        correct_index = item.get("correct_index")
        explanation = item.get("explanation")
        if not (
            isinstance(question, str)
            and isinstance(options, list)
            and len(options) == 4
            and all(isinstance(opt, str) and opt.strip() for opt in options)
            and isinstance(correct_index, int)
            and 0 <= correct_index <= 3
            and isinstance(explanation, str)
            and explanation.strip()
        ):
            continue
        quizzes.append(
            QuizQuestion(
                question=question.strip(),
                options=[opt.strip() for opt in options],
                correct_index=correct_index,
                explanation=explanation.strip(),
            )
        )

    if not quizzes:
        raise RuntimeError("Quiz generation returned no valid questions.")
    return quizzes
