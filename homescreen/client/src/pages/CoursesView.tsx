// CoursesView.tsx
// Design: Midnight Scholar - Course grid with create button and course cards

import { useState } from 'react';
import { Plus, BookOpen, Search, Grid3X3, List } from 'lucide-react';
import { Course } from '@/lib/data';
import { CourseCard } from '@/components/CourseCard';
import { CreateCourseModal } from '@/components/CreateCourseModal';
import { nanoid } from 'nanoid';

interface CoursesViewProps {
  courses: Course[];
  onCoursesChange: (courses: Course[]) => void;
  onOpenCourse: (course: Course) => void;
}

export function CoursesView({ courses, onCoursesChange, onOpenCourse }: CoursesViewProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredCourses = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.professor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateCourse = (data: {
    name: string;
    professor: string;
    semester: string;
    color: string;
    colorName: string;
  }) => {
    const newCourse: Course = {
      id: nanoid(),
      name: data.name,
      professor: data.professor,
      semester: data.semester,
      color: data.color,
      colorName: data.colorName,
      lecturesCount: 0,
      quizzesPending: 0,
      flashcardsCount: 0,
      lastActivity: 'Just now',
      lectures: [],
    };
    onCoursesChange([newCourse, ...courses]);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-extrabold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            My Courses
          </h1>
          <p className="text-xs text-white/40 mt-0.5">
            {courses.length} courses · {courses.reduce((s, c) => s + c.lecturesCount, 0)} lectures recorded
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-sm font-semibold text-white hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/25 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create New Course
        </button>
      </div>

      {/* Filters Row */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/8 focus-within:border-indigo-500/40 transition-colors">
          <Search className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search courses or professors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs text-white/70 placeholder-white/25 outline-none"
          />
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/8">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-indigo-500/30 text-indigo-400' : 'text-white/30 hover:text-white/60'}`}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-indigo-500/30 text-indigo-400' : 'text-white/30 hover:text-white/60'}`}
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-7 h-7 text-white/20" />
          </div>
          <p className="text-sm font-medium text-white/40">
            {searchQuery ? 'No courses match your search' : 'No courses yet'}
          </p>
          <p className="text-xs text-white/25 mt-1">
            {searchQuery ? 'Try a different search term' : 'Create your first course to get started'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-sm text-indigo-400 hover:bg-indigo-500/30 transition-colors"
            >
              Create Course
            </button>
          )}
        </div>
      ) : (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'space-y-3'
        }>
          {filteredCourses.map((course, index) => (
            <CourseCard
              key={course.id}
              course={course}
              onClick={() => onOpenCourse(course)}
              style={{ animationDelay: `${index * 80}ms` }}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateCourseModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateCourse}
        />
      )}
    </div>
  );
}
