// HomeView.tsx
// Design: Midnight Scholar - Dashboard home with stats, recent activity, quick actions

import {
  BookOpen,
  Sparkles,
  Zap,
  Brain,
  ArrowRight,
  Target,
  Award,
} from 'lucide-react';
import { toast } from 'sonner';
import { Course } from '@/lib/data';

interface HomeViewProps {
  courses: Course[];
  onNavigateToCourses: () => void;
  onOpenCourse: (course: Course) => void;
}

export function HomeView({ courses, onNavigateToCourses, onOpenCourse }: HomeViewProps) {
  const totalLectures = courses.reduce((sum, c) => sum + c.lecturesCount, 0);
  const totalQuizzes = courses.reduce((sum, c) => sum + c.quizzesPending, 0);
  const totalFlashcards = courses.reduce((sum, c) => sum + c.flashcardsCount, 0);

  const recentCourses = courses.slice(0, 3);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Hero Welcome */}
      <div className="relative overflow-hidden rounded-3xl mb-8 p-8"
        style={{
          background: 'linear-gradient(135deg, oklch(0.20 0.06 264) 0%, oklch(0.18 0.05 290) 100%)',
          border: '1px solid oklch(1 0 0 / 8%)',
        }}>
        {/* Background image */}
        <div
          className="absolute inset-0 opacity-10 bg-cover bg-center rounded-3xl"
          style={{
            backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663427534184/DZZ9ztwjDUmBqj43m2mmja/hero-bg-GKqgiFRhPswhKbv3DLdu47.webp)`,
          }}
        />
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400/80 font-medium">AI Systems Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Good morning, Alex 👋
            </h1>
            <p className="text-sm text-white/50 max-w-sm">
              You have <span className="text-amber-400 font-semibold">{totalQuizzes} quizzes pending</span> and{' '}
              <span className="text-indigo-400 font-semibold">{courses.length} active courses</span>. Ready to study?
            </p>
          </div>

          <div className="flex-shrink-0">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663427534184/DZZ9ztwjDUmBqj43m2mmja/ai-brain-9UJDdrq73UVLJTPvnLCzoG.webp"
              alt="AI Brain"
              className="w-24 h-24 object-contain opacity-80"
            />
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Courses', value: courses.length, icon: BookOpen, color: 'indigo', suffix: '' },
          { label: 'Total Lectures', value: totalLectures, icon: Brain, color: 'violet', suffix: '' },
          { label: 'Quizzes Pending', value: totalQuizzes, icon: Target, color: 'amber', suffix: '' },
          { label: 'Flashcards', value: totalFlashcards, icon: Zap, color: 'emerald', suffix: '' },
        ].map((stat) => {
          const Icon = stat.icon;
          const colorMap: Record<string, string> = {
            indigo: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/20',
            violet: 'text-violet-400 bg-violet-500/15 border-violet-500/20',
            amber: 'text-amber-400 bg-amber-500/15 border-amber-500/20',
            emerald: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/20',
          };
          return (
            <div
              key={stat.label}
              className="rounded-2xl p-4 bg-[oklch(0.16_0.02_264)] border border-white/8"
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 border ${colorMap[stat.color]}`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold text-white mb-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {stat.value}
              </p>
              <p className="text-[11px] text-white/40">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Courses */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Recent Courses
          </h2>
          <button
            onClick={onNavigateToCourses}
            className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {recentCourses.map((course) => (
            <button
              key={course.id}
              onClick={() => onOpenCourse(course)}
              className="text-left rounded-2xl p-4 bg-[oklch(0.16_0.02_264)] border border-white/8 hover:border-white/15 transition-all duration-200 hover:-translate-y-0.5 group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${course.color}25`, border: `1px solid ${course.color}40` }}
                >
                  <BookOpen className="w-4 h-4" style={{ color: course.color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {course.name}
                  </p>
                  <p className="text-[10px] text-white/35 truncate">{course.professor}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/30">{course.lecturesCount} lectures</span>
                <ArrowRight className="w-3 h-3 text-white/20 group-hover:text-white/50 transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-bold text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              icon: Sparkles,
              title: 'Generate Flashcards',
              desc: 'From any processed lecture',
              color: 'from-indigo-500/20 to-violet-500/20',
              border: 'border-indigo-500/20',
              iconColor: 'text-indigo-400',
            },
            {
              icon: Target,
              title: 'Take a Quiz',
              desc: `${totalQuizzes} quizzes ready`,
              color: 'from-amber-500/15 to-orange-500/15',
              border: 'border-amber-500/20',
              iconColor: 'text-amber-400',
            },
            {
              icon: Award,
              title: 'Study Streak',
              desc: '7 days in a row!',
              color: 'from-emerald-500/15 to-teal-500/15',
              border: 'border-emerald-500/20',
              iconColor: 'text-emerald-400',
            },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.title}
              onClick={() => toast.info('Feature coming soon!', { duration: 2000 })}
                className={`text-left rounded-2xl p-4 bg-gradient-to-br ${action.color} border ${action.border} hover:opacity-80 transition-opacity`}
              >
                <Icon className={`w-5 h-5 ${action.iconColor} mb-2`} />
                <p className="text-sm font-semibold text-white mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {action.title}
                </p>
                <p className="text-[11px] text-white/40">{action.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
