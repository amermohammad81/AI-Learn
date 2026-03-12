"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { downloadQuizPdf } from "@/lib/pdf";
import { loadLatestStudyPack, loadStudyPackByLectureId, type StudyPack } from "@/lib/study-pack";

export default function QuizPage() {
  const params = useSearchParams();
  const [pack, setPack] = useState<StudyPack | null>(null);
  const [lectureId, setLectureId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const id = params.get("id");
    if (id) {
      setLectureId(id);
      setPack(loadStudyPackByLectureId(id));
    } else {
      const latest = loadLatestStudyPack();
      setLectureId(latest.id);
      setPack(latest.pack);
    }
    setReady(true);
  }, [params]);

  if (!ready) return null;

  if (!pack || pack.quizzes.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Card className="border bg-card/85 shadow-xl shadow-black/25">
          <CardContent className="space-y-3 p-6">
            <h1 className="text-xl font-semibold">No quiz yet</h1>
            <p className="text-sm text-muted-foreground">Generate a study pack first from the home page.</p>
            <Link href="/">
              <Button>Back Home</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  const total = pack.quizzes.length;
  const question = pack.quizzes[current];

  const submitAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === question.correct_index) setScore((s) => s + 1);
  };

  const next = () => {
    if (current + 1 >= total) {
      setFinished(true);
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
  };

  if (!started) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Card className="border bg-card/85 shadow-xl shadow-black/25">
          <CardContent className="space-y-4 p-6">
            <h1 className="text-2xl font-bold">Quiz</h1>
            <p className="text-sm text-muted-foreground">{total} questions generated from your lecture.</p>
            <div className="flex gap-2">
              <Button onClick={() => setStarted(true)}>Start Quiz</Button>
              <Button variant="outline" onClick={() => downloadQuizPdf(pack)}>
                Download PDF
              </Button>
              <Link href={lectureId ? `/lecture/${lectureId}` : "/"}>
                <Button variant="outline">Back Home</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (finished) {
    const percent = Math.round((score / total) * 100);
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Card className="border bg-card/85 shadow-xl shadow-black/25">
          <CardContent className="space-y-4 p-6">
            <h1 className="text-2xl font-bold">Quiz Result</h1>
            <p className="text-lg font-semibold">
              Score: {score}/{total} ({percent}%)
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setStarted(false);
                  setCurrent(0);
                  setScore(0);
                  setSelected(null);
                  setFinished(false);
                }}
              >
                Try Again
              </Button>
              <Button variant="outline" onClick={() => downloadQuizPdf(pack)}>
                Download PDF
              </Button>
              <Link href={lectureId ? `/lecture/${lectureId}` : "/"}>
                <Button variant="outline">Back Home</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Card className="border bg-card/85 shadow-xl shadow-black/25">
        <CardContent className="space-y-5 p-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Question {current + 1} / {total}
            </span>
            <span>Score: {score}</span>
          </div>

          <h2 className="text-xl font-semibold leading-8">{question.question}</h2>

          <div className="space-y-2">
            {question.options.map((option, idx) => {
              const isCorrect = idx === question.correct_index;
              const isSelected = selected === idx;
              const classes =
                selected === null
                  ? "border hover:bg-muted/40"
                  : isCorrect
                    ? "border-green-500/40 bg-green-500/15"
                    : isSelected
                      ? "border-red-500/40 bg-red-500/15"
                      : "border";
              return (
                <button
                  key={`${option}-${idx}`}
                  onClick={() => submitAnswer(idx)}
                  disabled={selected !== null}
                  className={`w-full rounded-lg px-4 py-3 text-left text-sm ${classes}`}
                >
                  {idx + 1}. {option}
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <div className="space-y-3 rounded-lg border bg-muted/20 p-4">
              <p className="text-sm">
                Correct answer: <strong>{question.options[question.correct_index]}</strong>
              </p>
              <p className="text-sm text-muted-foreground">{question.explanation}</p>
              <Button onClick={next}>{current + 1 === total ? "Finish Quiz" : "Next Question"}</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
