// CourseCard.tsx
// Design: Midnight Scholar - Glass card with color-coded border, course stats

import { BookOpen, Clock, ChevronRight, Sparkles } from 'lucide-react';
import { Course } from '@/lib/data';

interface CourseCardProps {
  course: Course;
  onClick: () => void;
  style?: React.CSSProperties;
}

export function CourseCard({ course, onClick, style }: CourseCardProps) {
  return (
    <div
      onClick={onClick}
      style={style}
      className="group relative overflow-hidden rounded-2xl bg-[oklch(0.16_0.02_264)] border border-white/8 hover:border-white/15 transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-0.5 card-enter"
    >
      {/* Color accent top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ backgroundColor: course.color }}
      />

      {/* Color glow */}
      <div
        className="absolute top-0 left-0 right-0 h-24 opacity-10 transition-opacity group-hover:opacity-20"
        style={{
          background: `radial-gradient(ellipse at top, ${course.color}60, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${course.color}25`, border: `1px solid ${course.color}40` }}
          >
            <BookOpen className="w-5 h-5" style={{ color: course.color }} />
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-white/30 bg-white/5 px-2 py-1 rounded-full">
            <Clock className="w-2.5 h-2.5" />
            {course.lastActivity}
          </div>
        </div>

        {/* Course Info */}
        <div className="mb-4">
          <h3 className="text-sm font-bold text-white leading-snug mb-1 group-hover:text-white transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {course.name}
          </h3>
          <p className="text-xs text-white/40">
            {course.professor} · {course.semester}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 rounded-lg bg-white/4 border border-white/5">
            <p className="text-base font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {course.lecturesCount}
            </p>
            <p className="text-[9px] text-white/35 mt-0.5">Lectures</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-amber-500/8 border border-amber-500/15">
            <p className="text-base font-bold text-amber-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {course.quizzesPending}
            </p>
            <p className="text-[9px] text-amber-400/60 mt-0.5">Quizzes</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-emerald-500/8 border border-emerald-500/15">
            <p className="text-base font-bold text-emerald-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {course.flashcardsCount}
            </p>
            <p className="text-[9px] text-emerald-400/60 mt-0.5">Cards</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span className="text-[11px] text-indigo-400/70">AI Ready</span>
          </div>
          <button className="flex items-center gap-1 text-[11px] font-medium text-white/40 group-hover:text-white/70 transition-colors">
            Open
            <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
