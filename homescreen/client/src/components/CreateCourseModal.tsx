// CreateCourseModal.tsx
// Design: Midnight Scholar - Glass modal for creating new courses

import { useState } from 'react';
import { X, BookOpen, User, Calendar, Palette, Check } from 'lucide-react';
import { COURSE_COLORS } from '@/lib/data';
import { cn } from '@/lib/utils';

interface CreateCourseModalProps {
  onClose: () => void;
  onCreate: (course: {
    name: string;
    professor: string;
    semester: string;
    color: string;
    colorName: string;
  }) => void;
}

const SEMESTERS = [
  'Spring 2025',
  'Fall 2025',
  'Spring 2026',
  'Fall 2026',
  'Summer 2025',
];

export function CreateCourseModal({ onClose, onCreate }: CreateCourseModalProps) {
  const [name, setName] = useState('');
  const [professor, setProfessor] = useState('');
  const [semester, setSemester] = useState('Spring 2025');
  const [selectedColor, setSelectedColor] = useState(COURSE_COLORS[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Course name is required';
    if (!professor.trim()) newErrors.professor = 'Professor name is required';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onCreate({
      name: name.trim(),
      professor: professor.trim(),
      semester,
      color: selectedColor.value,
      colorName: selectedColor.name,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[oklch(0.16_0.02_264)] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
        {/* Gradient top accent */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <BookOpen className="w-4.5 h-4.5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Create New Course
              </h2>
              <p className="text-xs text-white/40">Set up your AI-powered course</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {/* Course Name */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-white/60 mb-1.5">
              <BookOpen className="w-3 h-3" />
              Course Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              placeholder="e.g., Machine Learning Fundamentals"
              className={cn(
                'w-full px-3.5 py-2.5 rounded-xl bg-white/5 border text-sm text-white placeholder-white/20 outline-none transition-all',
                errors.name
                  ? 'border-rose-500/50 focus:border-rose-500/70'
                  : 'border-white/10 focus:border-indigo-500/50 focus:bg-white/8'
              )}
            />
            {errors.name && (
              <p className="mt-1 text-[11px] text-rose-400">{errors.name}</p>
            )}
          </div>

          {/* Professor Name */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-white/60 mb-1.5">
              <User className="w-3 h-3" />
              Professor Name
            </label>
            <input
              type="text"
              value={professor}
              onChange={(e) => {
                setProfessor(e.target.value);
                if (errors.professor) setErrors({ ...errors, professor: '' });
              }}
              placeholder="e.g., Dr. Sarah Chen"
              className={cn(
                'w-full px-3.5 py-2.5 rounded-xl bg-white/5 border text-sm text-white placeholder-white/20 outline-none transition-all',
                errors.professor
                  ? 'border-rose-500/50 focus:border-rose-500/70'
                  : 'border-white/10 focus:border-indigo-500/50 focus:bg-white/8'
              )}
            />
            {errors.professor && (
              <p className="mt-1 text-[11px] text-rose-400">{errors.professor}</p>
            )}
          </div>

          {/* Semester */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-white/60 mb-1.5">
              <Calendar className="w-3 h-3" />
              Semester
            </label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-indigo-500/50 transition-all appearance-none"
              style={{ colorScheme: 'dark' }}
            >
              {SEMESTERS.map((s) => (
                <option key={s} value={s} className="bg-[#1a1a2e]">{s}</option>
              ))}
            </select>
          </div>

          {/* Color Theme */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-white/60 mb-2">
              <Palette className="w-3 h-3" />
              Color Theme
            </label>
            <div className="flex gap-2 flex-wrap">
              {COURSE_COLORS.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    'relative w-8 h-8 rounded-lg transition-all duration-200',
                    selectedColor.name === color.name && 'ring-2 ring-white/60 ring-offset-2 ring-offset-[oklch(0.16_0.02_264)]'
                  )}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                >
                  {selectedColor.name === color.name && (
                    <Check className="absolute inset-0 m-auto w-3.5 h-3.5 text-white" />
                  )}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-[11px] text-white/30">
              Selected: <span className="text-white/50">{selectedColor.name}</span>
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-white/50 hover:text-white/70 hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-sm font-semibold text-white hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/25"
            >
              Create Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
