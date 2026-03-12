export type Flashcard = {
  question: string;
  answer: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
};

export type StudyPack = {
  summary: string;
  flashcards: Flashcard[];
  quizzes: QuizQuestion[];
  model: string;
  language?: "en" | "ar";
};

export type LectureHistoryItem = {
  id: string;
  title: string;
  created_at: string;
  language: "en" | "ar";
  duration_seconds: number;
};

const HISTORY_COOKIE_KEY = "lecture_history_v1";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24; // 1 day
const LEGACY_STORAGE_KEY = "lecture_transcriber_study_pack_v1";

function packKey(id: string): string {
  return `lecture_pack_${id}`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const parts = document.cookie.split("; ").map((chunk) => chunk.split("="));
  const entry = parts.find(([k]) => k === name);
  if (!entry) return null;
  return decodeURIComponent(entry[1] ?? "");
}

function setCookie(name: string, value: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${COOKIE_MAX_AGE_SECONDS}; Path=/; SameSite=Lax`;
}

export function loadLectureHistory(): LectureHistoryItem[] {
  const raw = getCookie(HISTORY_COOKIE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as LectureHistoryItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, 2);
  } catch {
    return [];
  }
}

export function saveLectureWithHistory(item: LectureHistoryItem, pack: StudyPack): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(packKey(item.id), JSON.stringify(pack));
  window.localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(pack));

  const history = loadLectureHistory().filter((x) => x.id !== item.id);
  const updated = [item, ...history].slice(0, 2);
  setCookie(HISTORY_COOKIE_KEY, JSON.stringify(updated));
}

export function loadStudyPackByLectureId(id: string): StudyPack | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(packKey(id));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StudyPack;
  } catch {
    return null;
  }
}

export function loadLatestStudyPack(): { id: string | null; pack: StudyPack | null } {
  if (typeof window === "undefined") return { id: null, pack: null };
  const history = loadLectureHistory();
  if (history.length > 0) {
    const latest = history[0];
    return { id: latest.id, pack: loadStudyPackByLectureId(latest.id) };
  }

  // Fallback for old data created before history support.
  const raw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
  if (!raw) return { id: null, pack: null };
  try {
    return { id: null, pack: JSON.parse(raw) as StudyPack };
  } catch {
    return { id: null, pack: null };
  }
}
