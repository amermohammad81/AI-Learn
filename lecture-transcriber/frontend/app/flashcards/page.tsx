"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { downloadFlashcardsPdf } from "@/lib/pdf";
import { loadLatestStudyPack, loadStudyPackByLectureId, type StudyPack } from "@/lib/study-pack";

export default function FlashcardsPage() {
  const params = useSearchParams();
  const [pack, setPack] = useState<StudyPack | null>(null);
  const [lectureId, setLectureId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [dragStartX, setDragStartX] = useState<number | null>(null);

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

  if (!pack || pack.flashcards.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Card className="border bg-card/85 shadow-xl shadow-black/25">
          <CardContent className="space-y-3 p-6">
            <h1 className="text-xl font-semibold">No flashcards yet</h1>
            <p className="text-sm text-muted-foreground">Generate a study pack first from the home page.</p>
            <Link href="/">
              <Button>Back Home</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  const card = pack.flashcards[index];
  const total = pack.flashcards.length;

  const nextCard = () => {
    setShowAnswer(false);
    setIndex((prev) => Math.min(prev + 1, total - 1));
  };
  const prevCard = () => {
    setShowAnswer(false);
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  const onPointerDown = (x: number) => setDragStartX(x);
  const onPointerUp = (x: number) => {
    if (dragStartX === null) return;
    const delta = x - dragStartX;
    if (Math.abs(delta) > 60) {
      if (delta < 0) nextCard();
      else prevCard();
    }
    setDragStartX(null);
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Flashcards</h1>
        <p className="text-sm text-muted-foreground">
          Card {index + 1} / {total}
        </p>
      </div>

      <Card className="border bg-card/85 shadow-xl shadow-black/25">
        <CardContent className="p-6">
          <div
            className="flex min-h-[300px] cursor-grab select-none items-center justify-center rounded-2xl border bg-muted/20 p-6 text-center active:cursor-grabbing"
            onMouseDown={(e) => onPointerDown(e.clientX)}
            onMouseUp={(e) => onPointerUp(e.clientX)}
            onTouchStart={(e) => onPointerDown(e.touches[0].clientX)}
            onTouchEnd={(e) => onPointerUp(e.changedTouches[0].clientX)}
          >
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{showAnswer ? "Answer" : "Question"}</p>
              <p className="text-xl font-semibold leading-8">{showAnswer ? card.answer : card.question}</p>
              <p className="text-xs text-muted-foreground">Swipe left/right to move between cards</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button variant="outline" onClick={prevCard} disabled={index === 0}>
              Previous
            </Button>
            <Button variant="outline" onClick={() => setShowAnswer((v) => !v)}>
              {showAnswer ? "Show Question" : "Reveal Answer"}
            </Button>
            <Button onClick={nextCard} disabled={index === total - 1}>
              Next
            </Button>
            <Button variant="outline" onClick={() => downloadFlashcardsPdf(pack)}>
              Download PDF
            </Button>
            <Link href={lectureId ? `/lecture/${lectureId}` : "/"} className="ml-auto">
              <Button variant="outline">Back Home</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
