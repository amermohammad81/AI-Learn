"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { downloadFlashcardsPdf, downloadQuizPdf, downloadSummaryPdf } from "@/lib/pdf";
import { loadStudyPackByLectureId, type StudyPack } from "@/lib/study-pack";

export default function LecturePage() {
  const params = useParams<{ id: string }>();
  const lectureId = params.id;
  const [pack, setPack] = useState<StudyPack | null>(null);

  useEffect(() => {
    if (!lectureId) return;
    setPack(loadStudyPackByLectureId(lectureId));
  }, [lectureId]);

  if (!pack) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Card className="border bg-card/85 shadow-xl shadow-black/25">
          <CardContent className="space-y-3 p-6">
            <h1 className="text-xl font-semibold">Lecture not found</h1>
            <p className="text-sm text-muted-foreground">This lecture may have expired (1-day cookie retention).</p>
            <Link href="/">
              <Button>Back Home</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <Card className="border bg-card/85 shadow-xl shadow-black/25">
        <CardContent className="space-y-4 p-6">
          <h1 className="text-2xl font-bold">Lecture Details</h1>
          <p className="text-sm text-muted-foreground">{lectureId}</p>
          <pre className="whitespace-pre-wrap rounded-lg bg-muted/40 p-4 text-sm">{pack.summary}</pre>
          <div className="flex flex-wrap gap-2">
            <Link href={`/flashcards?id=${lectureId}`}>
              <Button variant="outline">Open Flashcards</Button>
            </Link>
            <Link href={`/quiz?id=${lectureId}`}>
              <Button>Start Quiz</Button>
            </Link>
            <Button variant="outline" onClick={() => downloadSummaryPdf(pack)}>
              Download Summary PDF
            </Button>
            <Button variant="outline" onClick={() => downloadFlashcardsPdf(pack)}>
              Download Flashcards PDF
            </Button>
            <Button variant="outline" onClick={() => downloadQuizPdf(pack)}>
              Download Quiz PDF
            </Button>
            <Link href="/" className="ml-auto">
              <Button variant="outline">Back Home</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
