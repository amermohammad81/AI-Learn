import os
import re
import time

from openai import APIConnectionError, APITimeoutError, OpenAI


def basic_cleanup(text: str) -> str:
    # Remove control chars and collapse whitespace.
    cleaned = re.sub(r"[\x00-\x1f\x7f]", " ", text)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned


def clean_mixed_transcript(raw_text: str, whisper_language: str) -> tuple[str, bool]:
    """
    Returns (cleaned_text, used_llm).
    Falls back safely to basic cleanup when LLM cleanup is unavailable.
    """
    cleaned_fallback = basic_cleanup(raw_text)

    enabled = os.getenv("TRANSCRIPT_CLEANING_ENABLED", "true").strip().lower() == "true"
    api_key = os.getenv("OPENAI_API_KEY")
    if not enabled or not api_key:
        return cleaned_fallback, False

    model = os.getenv("OPENAI_LLM_MODEL", "gpt-4o-mini")
    timeout = float(os.getenv("LLM_TIMEOUT_SECONDS", "120"))
    retries = int(os.getenv("LLM_MAX_RETRIES", "2"))

    client = OpenAI(api_key=api_key, timeout=timeout)
    system_prompt = (
        "You are an expert transcript editor for code-switched Arabic/English lectures. "
        "Clean noisy ASR output while preserving meaning and technical terms."
    )
    user_prompt = f"""
Whisper detected language: {whisper_language}

Task:
1) Keep Arabic and English terms as spoken (code-switching is allowed).
2) Remove obvious ASR hallucinations, broken tokens, random symbols, and repeated nonsense.
3) Fix punctuation and sentence boundaries for readability.
4) Do not summarize, do not add new facts.
5) Keep mathematical/technical terms and equations as best as possible.

Return only the cleaned transcript text.

Raw transcript:
{raw_text}
"""

    for attempt in range(retries + 1):
        try:
            resp = client.chat.completions.create(
                model=model,
                temperature=0.0,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
            )
            out = (resp.choices[0].message.content or "").strip()
            if not out:
                return cleaned_fallback, False
            return out, True
        except (APIConnectionError, APITimeoutError):
            if attempt >= retries:
                return cleaned_fallback, False
            time.sleep(1.2 * (attempt + 1))
        except Exception:
            return cleaned_fallback, False

    return cleaned_fallback, False
