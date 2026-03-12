// SettingsView.tsx
// Design: Midnight Scholar - Settings page with user preferences

import { User, Bell, Zap } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function SettingsView() {
  const [notifications, setNotifications] = useState({
    processing: true,
    quizReminders: true,
    weeklyReport: false,
    newFeatures: true,
  });

  const [aiSettings, setAiSettings] = useState({
    autoProcess: true,
    generateFlashcards: true,
    generateQuiz: true,
    language: 'English',
  });

  const handleSave = () => {
    toast.success('Settings saved successfully!', { duration: 2000 });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Settings
        </h1>
        <p className="text-xs text-white/40 mt-0.5">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <div className="rounded-2xl p-5 bg-[oklch(0.16_0.02_264)] border border-white/8 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Profile
          </h2>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xl font-bold">
            A
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Alex Johnson</p>
            <p className="text-xs text-white/40">alex@university.edu</p>
            <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              <Zap className="w-2.5 h-2.5" />
              Free Plan
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-white/40 mb-1 block">Full Name</label>
            <input
              type="text"
              defaultValue="Alex Johnson"
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-[11px] text-white/40 mb-1 block">University</label>
            <input
              type="text"
              defaultValue="MIT"
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* AI Settings */}
      <div className="rounded-2xl p-5 bg-[oklch(0.16_0.02_264)] border border-white/8 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            AI Processing
          </h2>
        </div>
        <div className="space-y-3">
          {[
            { key: 'autoProcess', label: 'Auto-process uploads', desc: 'Automatically start AI processing when a file is uploaded' },
            { key: 'generateFlashcards', label: 'Generate Flashcards', desc: 'Create flashcard sets from processed lectures' },
            { key: 'generateQuiz', label: 'Generate Quizzes', desc: 'Create quiz questions from lecture content' },
          ].map((setting) => (
            <div key={setting.key} className="flex items-start justify-between gap-4 py-2 border-b border-white/5 last:border-0">
              <div>
                <p className="text-xs font-medium text-white/80">{setting.label}</p>
                <p className="text-[11px] text-white/35 mt-0.5">{setting.desc}</p>
              </div>
              <button
                onClick={() => setAiSettings({ ...aiSettings, [setting.key]: !aiSettings[setting.key as keyof typeof aiSettings] })}
                className={`flex-shrink-0 w-10 h-5.5 rounded-full transition-all duration-200 relative ${
                  aiSettings[setting.key as keyof typeof aiSettings]
                    ? 'bg-indigo-500'
                    : 'bg-white/15'
                }`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${
                  aiSettings[setting.key as keyof typeof aiSettings] ? 'left-5.5' : 'left-0.5'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-2xl p-5 bg-[oklch(0.16_0.02_264)] border border-white/8 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Notifications
          </h2>
        </div>
        <div className="space-y-3">
          {[
            { key: 'processing', label: 'Processing complete', desc: 'When AI finishes processing a lecture' },
            { key: 'quizReminders', label: 'Quiz reminders', desc: 'Daily reminders for pending quizzes' },
            { key: 'weeklyReport', label: 'Weekly study report', desc: 'Summary of your weekly study activity' },
            { key: 'newFeatures', label: 'New features', desc: 'Updates about new Study-AI features' },
          ].map((setting) => (
            <div key={setting.key} className="flex items-start justify-between gap-4 py-2 border-b border-white/5 last:border-0">
              <div>
                <p className="text-xs font-medium text-white/80">{setting.label}</p>
                <p className="text-[11px] text-white/35 mt-0.5">{setting.desc}</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, [setting.key]: !notifications[setting.key as keyof typeof notifications] })}
                className={`flex-shrink-0 w-10 h-5.5 rounded-full transition-all duration-200 relative ${
                  notifications[setting.key as keyof typeof notifications]
                    ? 'bg-indigo-500'
                    : 'bg-white/15'
                }`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${
                  notifications[setting.key as keyof typeof notifications] ? 'left-5.5' : 'left-0.5'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-sm font-semibold text-white hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/25"
      >
        Save Changes
      </button>
    </div>
  );
}
