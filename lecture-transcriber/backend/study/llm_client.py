import json
import os
import time
from typing import Any

from openai import APIConnectionError, APITimeoutError, OpenAI

LLM_TIMEOUT_SECONDS = float(os.getenv("LLM_TIMEOUT_SECONDS", "120"))
LLM_MAX_RETRIES = int(os.getenv("LLM_MAX_RETRIES", "2"))
LLM_MODEL = os.getenv("OPENAI_LLM_MODEL", "gpt-4o-mini")


def get_llm_client() -> OpenAI:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("Missing OPENAI_API_KEY for LLM generation.")
    base_url = os.getenv("OPENAI_BASE_URL")
    if base_url:
        return OpenAI(api_key=api_key, base_url=base_url, timeout=LLM_TIMEOUT_SECONDS)
    return OpenAI(api_key=api_key, timeout=LLM_TIMEOUT_SECONDS)


def _extract_json(content: str) -> dict[str, Any]:
    cleaned = content.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        cleaned = cleaned.replace("json", "", 1).strip()
    return json.loads(cleaned)


def generate_json(system_prompt: str, user_prompt: str) -> dict[str, Any]:
    client = get_llm_client()

    for attempt in range(LLM_MAX_RETRIES + 1):
        try:
            completion = client.chat.completions.create(
                model=LLM_MODEL,
                temperature=0.2,
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
            )
            message = completion.choices[0].message.content or "{}"
            return _extract_json(message)
        except (APIConnectionError, APITimeoutError):
            if attempt >= LLM_MAX_RETRIES:
                raise
            time.sleep(1.5 * (attempt + 1))
        except json.JSONDecodeError as exc:
            raise RuntimeError(f"LLM returned invalid JSON: {exc}") from exc

    raise RuntimeError("LLM request failed after retries.")
