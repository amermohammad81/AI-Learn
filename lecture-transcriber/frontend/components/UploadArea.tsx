"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import type { Accept } from "react-dropzone";
import { FolderOpen, LoaderCircle, Mic, UploadCloud, Youtube } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { downloadFlashcardsPdf, downloadQuizPdf, downloadSummaryPdf } from "@/lib/pdf";
import { type StudyPack, saveLectureWithHistory } from "@/lib/study-pack";

type UploadAreaProps = {
  language?: "en" | "ar";
};

type ProcessResult = {
  duration_seconds: number;
  language: string;
  study_pack: StudyPack;
};

type ProcessStatus = {
  job_id: string;
  status: "queued" | "running" | "completed" | "failed";
  stage: "queued" | "transcribing" | "generating" | "done" | "failed";
  message: string;
  progress: number;
  result: ProcessResult | null;
  error: string | null;
};

const MAX_SIZE = 150 * 1024 * 1024;
const ALLOWED_MIME: Accept = {
  "audio/mpeg": [".mp3"],
  "audio/mp4": [".m4a"],
  "audio/wav": [".wav"],
  "audio/ogg": [".ogg"],
};
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

type Stage = "idle" | "uploading" | "transcribing" | "generating" | "done";

export default function UploadArea({ language = "en" }: UploadAreaProps) {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("idle");
  const [statusMessage, setStatusMessage] = useState("Preparing...");
  const [error, setError] = useState<string | null>(null);
  const [uiProgress, setUiProgress] = useState(0);
  const [studyPack, setStudyPack] = useState<StudyPack | null>(null);
  const [lectureId, setLectureId] = useState<string | null>(null);
  const pulseTimer = useRef<number | null>(null);

  const showModal = stage === "uploading" || stage === "transcribing" || stage === "generating";

  const stageText = useMemo(() => {
    if (stage === "uploading") return "Uploading your file";
    if (stage === "transcribing") return "Converting audio to text";
    if (stage === "generating") return "Creating your study pack";
    return "";
  }, [stage]);

  useEffect(() => {
    if (!showModal) {
      if (pulseTimer.current !== null) {
        window.clearInterval(pulseTimer.current);
        pulseTimer.current = null;
      }
      return;
    }
    if (pulseTimer.current !== null) window.clearInterval(pulseTimer.current);
    pulseTimer.current = window.setInterval(() => {
      setUiProgress((p) => Math.min(96, p + 1));
    }, 450);
    return () => {
      if (pulseTimer.current !== null) {
        window.clearInterval(pulseTimer.current);
        pulseTimer.current = null;
      }
    };
  }, [showModal]);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const pollProcess = async (jobId: string): Promise<ProcessStatus> => {
    for (let i = 0; i < 1200; i += 1) {
      const response = await fetch(`${API_BASE}/api/process/status/${jobId}`);
      const data = (await response.json()) as ProcessStatus | { detail?: string };
      if (!response.ok) {
        throw new Error((data as { detail?: string }).detail || "Failed to fetch process status.");
      }

      const status = data as ProcessStatus;
      setStatusMessage(status.message || "Working...");
      setUiProgress((prev) => Math.max(prev, Math.min(100, status.progress || 0)));

      if (status.stage === "transcribing") setStage("transcribing");
      if (status.stage === "generating") setStage("generating");
      if (status.status === "failed") throw new Error(status.error || "Processing failed.");
      if (status.status === "completed") return status;

      await sleep(1200);
    }
    throw new Error("Processing took too long. Please retry.");
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setError(null);
    setStudyPack(null);
    setLectureId(null);
    setUiProgress(6);
    setStatusMessage("Uploading your file...");
    setStage("uploading");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const startResponseText = await new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${API_BASE}/api/process/start`);
        xhr.upload.onprogress = (event) => {
          if (!event.lengthComputable) return;
          const progress = Math.round((event.loaded / event.total) * 34);
          setUiProgress((p) => Math.max(p, progress));
        };
        xhr.onreadystatechange = () => {
          if (xhr.readyState !== 4) return;
          if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.responseText);
          else {
            let msg = "Failed to start processing.";
            try {
              const parsed = JSON.parse(xhr.responseText) as { detail?: string };
              if (parsed.detail) msg = parsed.detail;
            } catch {
              if (xhr.responseText) msg = xhr.responseText;
            }
            reject(new Error(msg));
          }
        };
        xhr.onerror = () => reject(new Error("Network error during upload."));
        xhr.send(formData);
      });

      const parsed = JSON.parse(startResponseText) as { job_id: string };
      if (!parsed.job_id) throw new Error("Missing job id.");

      setStage("transcribing");
      setUiProgress((p) => Math.max(p, 36));
      setStatusMessage("Converting audio to text...");

      const finalStatus = await pollProcess(parsed.job_id);
      if (!finalStatus.result?.study_pack) throw new Error("No study pack returned.");

      const pack = { ...finalStatus.result.study_pack, language };
      const id = `lec-${Date.now()}`;
      const title = (pack.summary || "New lecture").replace(/\s+/g, " ").split(" ").slice(0, 8).join(" ");

      saveLectureWithHistory(
        {
          id,
          title,
          created_at: new Date().toISOString(),
          language,
          duration_seconds: finalStatus.result.duration_seconds,
        },
        pack,
      );

      setStudyPack(pack);
      setLectureId(id);
      setUiProgress(100);
      setStatusMessage("Done");
      setStage("done");
    } catch (err) {
      setStage("idle");
      setUiProgress(0);
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple: false,
    maxSize: MAX_SIZE,
    accept: ALLOWED_MIME,
    noClick: true,
    onDropRejected: (rejections) => setError(rejections[0]?.errors[0]?.message ?? "Invalid file."),
  });

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <Card className="border bg-card/80 shadow-sm">
        <CardContent className="space-y-5 p-6">
          <div className="mx-auto flex max-w-xl items-center justify-between rounded-2xl bg-muted/70 p-2">
            <button
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
              onClick={() => window.alert("Coming soon")}
            >
              <Mic className="h-4 w-4" />
              Record
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl bg-card px-6 py-3 text-sm font-semibold shadow-md">
              <FolderOpen className="h-4 w-4 text-amber-500" />
              Upload File
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
              onClick={() => window.alert("Coming soon")}
            >
              <Youtube className="h-4 w-4" />
              YouTube
            </button>
          </div>

          <div
            {...getRootProps()}
            className={`rounded-3xl border border-dashed p-14 text-center transition-all duration-300 ${
              isDragActive ? "scale-[1.01] border-primary bg-primary/10" : "border-border bg-card hover:border-primary/60"
            }`}
          >
            <input {...getInputProps()} />
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600">
              <UploadCloud className="h-8 w-8 text-white animate-soft-bob" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">Drop your lecture here</h2>
            <p className="mt-2 text-sm text-muted-foreground">Supports MP3, MP4, WAV, M4A, OGG - up to 150MB</p>
            <Button className="mt-6" onClick={open}>
              Browse Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && <div className="rounded-xl border border-red-300 bg-red-500/10 p-4 text-sm text-red-700">{error}</div>}

      {studyPack && (
        <Card className="border bg-card/95 shadow-sm animate-fade-in-up">
          <CardContent className="space-y-4 p-6">
            <h3 className="text-xl font-semibold">Summary</h3>
            <pre className="whitespace-pre-wrap rounded-lg border bg-muted/20 p-4 text-sm leading-7">{studyPack.summary}</pre>
            <div className="flex flex-wrap gap-2">
              {lectureId ? <Button onClick={() => router.push(`/lecture/${lectureId}`)}>Open Lecture</Button> : null}
              {lectureId ? (
                <Button variant="outline" onClick={() => router.push(`/flashcards?id=${lectureId}`)}>
                  Open Flashcards
                </Button>
              ) : null}
              {lectureId ? <Button onClick={() => router.push(`/quiz?id=${lectureId}`)}>Start Quiz</Button> : null}
              <Button variant="outline" onClick={() => downloadSummaryPdf(studyPack)}>
                Summary PDF
              </Button>
              <Button variant="outline" onClick={() => downloadFlashcardsPdf(studyPack)}>
                Flashcards PDF
              </Button>
              <Button variant="outline" onClick={() => downloadQuizPdf(studyPack)}>
                Quiz PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
          <div className="w-[92vw] max-w-md rounded-3xl border border-white/60 bg-white p-6 shadow-2xl shadow-slate-500/25 animate-fade-in-up">
            <div className="mb-4 flex items-center gap-3">
              <LoaderCircle className="h-5 w-5 animate-spin text-primary" />
              <div>
                <p className="text-sm font-semibold text-slate-900">{stageText}</p>
                <p className="text-xs text-slate-500">{statusMessage}</p>
              </div>
            </div>
            <Progress value={uiProgress} />
            <p className="mt-3 text-xs text-slate-500">This can take longer for large files. You can keep this page open.</p>
          </div>
        </div>
      )}
    </div>
  );
}
