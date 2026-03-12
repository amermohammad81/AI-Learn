"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarDays, Clock3, Sparkles } from "lucide-react";

import UploadArea from "@/components/UploadArea";
import { Card, CardContent } from "@/components/ui/card";
import { type LectureHistoryItem, loadLectureHistory } from "@/lib/study-pack";

export default function HomePage() {
  const [history, setHistory] = useState<LectureHistoryItem[]>([]);

  useEffect(() => {
    setHistory(loadLectureHistory());
  }, []);

  return (
    <main className="min-h-screen pb-10">
      <header className="border-b border-border/70 bg-card/70 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
          <div className="text-2xl font-black tracking-tight">LectureAI</div>
          <nav className="flex items-center gap-7 text-sm text-muted-foreground">
            <span className="text-foreground">New Lecture</span>
            <span>My Lectures</span>
            <span>Pricing</span>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-8 px-4 pt-6 md:px-8">
        <p className="text-3xl font-bold tracking-tight md:text-4xl">Get instant summaries, quizzes, and flashcards.</p>
        <UploadArea language="en" />

        <section className="space-y-3 pt-2">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <Sparkles className="h-5 w-5 text-primary" />
              Previous Lectures
            </h2>
            <p className="text-sm text-muted-foreground">Your recent processing history</p>
          </div>

          {history.length === 0 ? (
            <Card className="border bg-card/80 shadow-sm">
              <CardContent className="p-5 text-sm text-muted-foreground">No saved lectures yet.</CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {history.map((lecture) => (
                <Card key={lecture.id} className="border bg-card shadow-sm">
                  <CardContent className="flex items-center justify-between gap-4 p-5">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{lecture.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="h-4 w-4" />
                          {new Date(lecture.created_at).toLocaleDateString()}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock3 className="h-4 w-4" />
                          {lecture.duration_seconds}s
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/quiz?id=${lecture.id}`}
                        className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-600"
                      >
                        Quiz
                      </Link>
                      <Link
                        href={`/flashcards?id=${lecture.id}`}
                        className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-600"
                      >
                        Cards
                      </Link>
                      <Link
                        href={`/lecture/${lecture.id}`}
                        className="rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-600"
                      >
                        Summary
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
