// LectureTimeline.tsx
// Design: Midnight Scholar - Vertical timeline of lectures with AI action buttons

import { useState } from 'react';
import {
  FileText,
  Layers,
  HelpCircle,
  Presentation,
  Clock,
  CheckCircle2,
  Loader2,
  Edit3,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { Lecture } from '@/lib/data';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface LectureTimelineProps {
  lectures: Lecture[];
  courseColor: string;
  onUpdateTitle: (lectureId: string, newTitle: string) => void;
}

function ProcessingBar({ progress }: { progress: number }) {
  return (
    <div className="mt-3 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 processing-pulse">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span className="text-xs font-medium text-indigo-300">Processing Magic...</span>
        </div>
        <span className="text-xs font-bold text-indigo-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {progress}%
        </span>
      </div>
      <div className="h-1.5 bg-indigo-500/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-1.5 text-[10px] text-indigo-400/60">
        Generating summary, flashcards, and quiz questions...
      </p>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  available,
  color = 'indigo',
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  available: boolean;
  color?: string;
}) {
  const colorMap: Record<string, string> = {
    indigo: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/25 hover:bg-indigo-500/25',
    violet: 'text-violet-400 bg-violet-500/15 border-violet-500/25 hover:bg-violet-500/25',
    amber: 'text-amber-400 bg-amber-500/15 border-amber-500/25 hover:bg-amber-500/25',
    emerald: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/25 hover:bg-emerald-500/25',
  };

  return (
    <button
      onClick={() => {
        if (available) {
          toast.success(`Opening ${label}...`, { duration: 2000 });
        } else {
          toast.info('This feature will be available after AI processing completes.', { duration: 3000 });
        }
      }}
      className={cn(
        'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition-all duration-150',
        available
          ? colorMap[color]
          : 'text-white/20 bg-white/3 border-white/8 cursor-not-allowed opacity-50'
      )}
      title={label}
    >
      <Icon className="w-3 h-3" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

export function LectureTimeline({ lectures, courseColor, onUpdateTitle }: LectureTimelineProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEdit = (lecture: Lecture) => {
    setEditingId(lecture.id);
    setEditValue(lecture.title);
  };

  const confirmEdit = (lectureId: string) => {
    if (editValue.trim()) {
      onUpdateTitle(lectureId, editValue.trim());
    }
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  if (lectures.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center mx-auto mb-4">
          <FileText className="w-7 h-7 text-white/20" />
        </div>
        <p className="text-sm font-medium text-white/40">No lectures yet</p>
        <p className="text-xs text-white/25 mt-1">Upload or record your first lecture above</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {lectures.map((lecture, index) => (
        <div
          key={lecture.id}
          className="group relative rounded-2xl bg-[oklch(0.16_0.02_264)] border border-white/8 hover:border-white/12 transition-all duration-200 overflow-hidden"
          style={{ animationDelay: `${index * 60}ms` }}
        >
          {/* Left color indicator */}
          <div
            className="absolute left-0 top-0 bottom-0 w-0.5"
            style={{ backgroundColor: courseColor }}
          />

          <div className="pl-4 pr-4 py-4">
            {/* Top row */}
            <div className="flex items-start gap-3">
              {/* Status icon */}
              <div className="flex-shrink-0 mt-0.5">
                {lecture.status === 'processed' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
                {lecture.status === 'processing' && (
                  <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                )}
                {lecture.status === 'pending' && (
                  <Clock className="w-4 h-4 text-white/30" />
                )}
              </div>

              {/* Title & Meta */}
              <div className="flex-1 min-w-0">
                {editingId === lecture.id ? (
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') confirmEdit(lecture.id);
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      autoFocus
                      className="flex-1 bg-white/8 border border-indigo-500/40 rounded-lg px-2.5 py-1 text-sm text-white outline-none focus:border-indigo-500/70"
                    />
                    <button
                      onClick={() => confirmEdit(lecture.id)}
                      className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-1 rounded-lg bg-white/8 text-white/40 hover:bg-white/12 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-white truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {lecture.title}
                    </h4>
                    <button
                      onClick={() => startEdit(lecture)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-white/30 hover:text-white/60 hover:bg-white/8 transition-all"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-3 text-[11px] text-white/35">
                  <span>{lecture.date}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {lecture.duration}
                  </span>
                  {lecture.status === 'processing' && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span className="text-indigo-400">Processing...</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Processing bar */}
            {lecture.status === 'processing' && lecture.progress !== undefined && (
              <ProcessingBar progress={lecture.progress} />
            )}

            {/* Action buttons */}
            {lecture.status !== 'processing' && (
              <div className="flex flex-wrap gap-2 mt-3 pl-7">
                <ActionButton
                  icon={FileText}
                  label="Summary"
                  available={lecture.hasSummary}
                  color="indigo"
                />
                <ActionButton
                  icon={Layers}
                  label="Flashcards"
                  available={lecture.hasFlashcards}
                  color="violet"
                />
                <ActionButton
                  icon={HelpCircle}
                  label="Quiz"
                  available={lecture.hasQuiz}
                  color="amber"
                />
                <ActionButton
                  icon={Presentation}
                  label="View PPT"
                  available={lecture.hasPPT}
                  color="emerald"
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
