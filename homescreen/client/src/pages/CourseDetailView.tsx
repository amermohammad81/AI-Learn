// CourseDetailView.tsx
// Design: Midnight Scholar - Internal course view with upload zone and lecture timeline

import { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  User,
  Calendar,
  Mic,
  HelpCircle,
  Sparkles,
  BarChart2,
  Layers,
} from 'lucide-react';
import { Course, Lecture } from '@/lib/data';
import { UploadZone } from '@/components/UploadZone';
import { LectureTimeline } from '@/components/LectureTimeline';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';

interface CourseDetailViewProps {
  course: Course;
  onBack: () => void;
  onCourseUpdate: (updatedCourse: Course) => void;
}

export function CourseDetailView({ course, onBack, onCourseUpdate }: CourseDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'lectures' | 'stats'>('lectures');

  const handleUpload = (fileName: string) => {
    // Create a new lecture in "processing" state
    const newLecture: Lecture = {
      id: nanoid(),
      title: fileName || `Lecture ${course.lectures.length + 1}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      duration: '—',
      status: 'processing',
      progress: 15,
      hasSummary: false,
      hasFlashcards: false,
      hasQuiz: false,
      hasPPT: false,
    };

    const updatedCourse = {
      ...course,
      lectures: [newLecture, ...course.lectures],
      lecturesCount: course.lecturesCount + 1,
      lastActivity: 'Just now',
    };
    onCourseUpdate(updatedCourse);

    // Simulate progress
    let progress = 15;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 12) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        // Mark as processed
        const processedCourse = {
          ...updatedCourse,
          lectures: updatedCourse.lectures.map((l) =>
            l.id === newLecture.id
              ? {
                  ...l,
                  status: 'processed' as const,
                  progress: undefined,
                  duration: `${Math.floor(Math.random() * 40) + 30}m`,
                  hasSummary: true,
                  hasFlashcards: true,
                  hasQuiz: true,
                  hasPPT: Math.random() > 0.4,
                }
              : l
          ),
        };
        onCourseUpdate(processedCourse);
        toast.success('AI processing complete! Summary, flashcards, and quiz are ready.', {
          duration: 4000,
        });
      } else {
        const progressCourse = {
          ...updatedCourse,
          lectures: updatedCourse.lectures.map((l) =>
            l.id === newLecture.id ? { ...l, progress } : l
          ),
        };
        onCourseUpdate(progressCourse);
      }
    }, 800);
  };

  const handleUpdateTitle = (lectureId: string, newTitle: string) => {
    const updatedCourse = {
      ...course,
      lectures: course.lectures.map((l) =>
        l.id === lectureId ? { ...l, title: newTitle } : l
      ),
    };
    onCourseUpdate(updatedCourse);
    toast.success('Title updated', { duration: 1500 });
  };

  const processedCount = course.lectures.filter((l) => l.status === 'processed').length;
  const processingCount = course.lectures.filter((l) => l.status === 'processing').length;

  return (
    <div className="min-h-screen">
      {/* Course Header */}
      <div
        className="relative overflow-hidden px-6 pt-6 pb-8"
        style={{
          background: `linear-gradient(135deg, ${course.color}18 0%, oklch(0.14 0.02 264) 60%)`,
          borderBottom: '1px solid oklch(1 0 0 / 6%)',
        }}
      >
        {/* Glow */}
        <div
          className="absolute top-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: course.color }}
        />

        {/* Back button */}
        <button
          onClick={onBack}
          className="relative flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </button>

        {/* Course Info */}
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
            style={{
              backgroundColor: `${course.color}25`,
              border: `1px solid ${course.color}50`,
              boxShadow: `0 0 20px ${course.color}30`,
            }}
          >
            <BookOpen className="w-7 h-7" style={{ color: course.color }} />
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-extrabold text-white mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {course.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-white/40">
              <span className="flex items-center gap-1.5">
                <User className="w-3 h-3" />
                {course.professor}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                {course.semester}
              </span>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex gap-3">
            {[
              { label: 'Lectures', value: course.lecturesCount, color: 'text-white' },
              { label: 'Quizzes', value: course.quizzesPending, color: 'text-amber-400' },
              { label: 'Cards', value: course.flashcardsCount, color: 'text-emerald-400' },
            ].map((stat) => (
              <div key={stat.label} className="text-center px-3 py-2 rounded-xl bg-white/5 border border-white/8">
                <p className={`text-lg font-bold ${stat.color}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {stat.value}
                </p>
                <p className="text-[10px] text-white/35">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-4xl mx-auto">
        {/* Upload Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Mic className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Upload or Record Lecture
            </h2>
            <div className="flex items-center gap-1.5 ml-auto text-[11px] text-indigo-400/70 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" />
              AI-powered processing
            </div>
          </div>
          <UploadZone onUpload={handleUpload} courseColor={course.color} />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-5 p-1 bg-white/4 border border-white/8 rounded-xl w-fit">
          {[
            { id: 'lectures', label: 'Lecture Timeline', icon: Layers },
            { id: 'stats', label: 'AI Stats', icon: BarChart2 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'lectures' | 'stats')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-500/25 text-indigo-300 shadow-sm'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Lecture Timeline */}
        {activeTab === 'lectures' && (
          <div>
            {processingCount > 0 && (
              <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse flex-shrink-0" />
                <p className="text-xs text-indigo-300/80">
                  <span className="font-semibold">{processingCount} lecture{processingCount > 1 ? 's' : ''}</span> being processed by AI...
                </p>
              </div>
            )}
            <LectureTimeline
              lectures={course.lectures}
              courseColor={course.color}
              onUpdateTitle={handleUpdateTitle}
            />
          </div>
        )}

        {/* AI Stats Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Processed', value: processedCount, total: course.lectures.length, color: 'emerald' },
                { label: 'Summaries', value: course.lectures.filter(l => l.hasSummary).length, total: processedCount, color: 'indigo' },
                { label: 'Flashcards Sets', value: course.lectures.filter(l => l.hasFlashcards).length, total: processedCount, color: 'violet' },
                { label: 'Quizzes', value: course.lectures.filter(l => l.hasQuiz).length, total: processedCount, color: 'amber' },
              ].map((stat) => {
                const pct = stat.total > 0 ? Math.round((stat.value / stat.total) * 100) : 0;
                const colorMap: Record<string, string> = {
                  emerald: 'bg-emerald-500 text-emerald-400',
                  indigo: 'bg-indigo-500 text-indigo-400',
                  violet: 'bg-violet-500 text-violet-400',
                  amber: 'bg-amber-500 text-amber-400',
                };
                const [bgColor, textColor] = colorMap[stat.color].split(' ');
                return (
                  <div key={stat.label} className="rounded-2xl p-4 bg-[oklch(0.16_0.02_264)] border border-white/8">
                    <p className={`text-2xl font-bold ${textColor} mb-0.5`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {stat.value}
                    </p>
                    <p className="text-[11px] text-white/40 mb-2">{stat.label}</p>
                    <div className="h-1 bg-white/8 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${bgColor} rounded-full transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-white/25 mt-1">{pct}% of lectures</p>
                  </div>
                );
              })}
            </div>

            <div className="rounded-2xl p-5 bg-[oklch(0.16_0.02_264)] border border-white/8">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  AI Processing Overview
                </h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Total Audio Processed', value: `${course.lectures.reduce((s, l) => s + (l.status === 'processed' ? 1 : 0), 0)} lectures` },
                  { label: 'Avg. Processing Time', value: '~3 minutes' },
                  { label: 'AI Credits Used', value: `${processedCount * 12} credits` },
                  { label: 'Accuracy Score', value: '94.2%' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <span className="text-xs text-white/40">{item.label}</span>
                    <span className="text-xs font-semibold text-white/70" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
