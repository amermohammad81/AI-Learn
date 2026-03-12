from study.llm_client import generate_json


def generate_summary(transcript: str, language: str, bullets: int) -> str:
    system_prompt = (
        "You are an expert academic study assistant. "
        "Create deep, structured, and pedagogically useful lecture notes for university students. "
        "Prioritize correctness, conceptual links, and practical understanding."
    )
    user_prompt = f"""
Target language: {language}
Return JSON only using this shape:
{{
  "summary": "Long markdown summary"
}}
Write a deep summary in markdown with this exact structure:
1) ## Core Concepts
- Exactly {bullets} bullets. Each bullet must be 1-2 sentences.
2) ## Detailed Explanation
- 3 to 5 paragraphs that connect concepts and explain why they matter.
3) ## Examples and Applications
- At least 4 concrete examples or use-cases.
4) ## Common Mistakes
- At least 4 pitfalls or misconceptions and how to avoid them.
5) ## Quick Review
- 8 short review bullets for fast revision.

Length requirement: at least 600 words.

Transcript:
{transcript}
"""
    data = generate_json(system_prompt=system_prompt, user_prompt=user_prompt)
    summary = data.get("summary")
    if not isinstance(summary, str) or not summary.strip():
        raise RuntimeError("Summary generation failed.")
    # Best-effort mode: keep shorter summaries instead of failing a paid request.
    return summary.strip()
