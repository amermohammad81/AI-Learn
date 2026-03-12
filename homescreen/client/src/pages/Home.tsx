// Home.tsx - Main Dashboard Entry Point
// Design: Midnight Scholar - Dark Academia Glassmorphism
// Layout: Fixed sidebar (240px) + main content area with sticky top bar

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { HomeView } from '@/pages/HomeView';
import { CoursesView } from '@/pages/CoursesView';
import { LibraryView } from '@/pages/LibraryView';
import { SettingsView } from '@/pages/SettingsView';
import { CourseDetailView } from '@/pages/CourseDetailView';
import { Course, INITIAL_COURSES } from '@/lib/data';

type View = 'home' | 'courses' | 'library' | 'settings';

const VIEW_TITLES: Record<View, { title: string; subtitle: string }> = {
  home: { title: 'Dashboard', subtitle: 'Welcome back, Alex' },
  courses: { title: 'My Courses', subtitle: 'Manage your AI-powered courses' },
  library: { title: 'Global Library', subtitle: 'Community study materials' },
  settings: { title: 'Settings', subtitle: 'Manage your preferences' },
};

export default function Home() {
  const [activeView, setActiveView] = useState<View>('home');
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const handleOpenCourse = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleCourseUpdate = (updatedCourse: Course) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c))
    );
    setSelectedCourse(updatedCourse);
  };

  const handleBackFromCourse = () => {
    setSelectedCourse(null);
  };

  const currentViewMeta = selectedCourse
    ? { title: selectedCourse.name, subtitle: selectedCourse.professor }
    : VIEW_TITLES[activeView];

  return (
    <div className="min-h-screen bg-[oklch(0.12_0.02_264)] flex">
      {/* Sidebar */}
      <Sidebar activeView={activeView} onNavigate={(view) => {
        setActiveView(view as View);
        setSelectedCourse(null);
      }} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:pl-60">
        {/* Top Bar */}
        <TopBar
          title={currentViewMeta.title}
          subtitle={currentViewMeta.subtitle}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {selectedCourse ? (
            <CourseDetailView
              course={selectedCourse}
              onBack={handleBackFromCourse}
              onCourseUpdate={handleCourseUpdate}
            />
          ) : (
            <>
              {activeView === 'home' && (
                <HomeView
                  courses={courses}
                  onNavigateToCourses={() => setActiveView('courses')}
                  onOpenCourse={handleOpenCourse}
                />
              )}
              {activeView === 'courses' && (
                <CoursesView
                  courses={courses}
                  onCoursesChange={setCourses}
                  onOpenCourse={handleOpenCourse}
                />
              )}
              {activeView === 'library' && <LibraryView />}
              {activeView === 'settings' && <SettingsView />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
