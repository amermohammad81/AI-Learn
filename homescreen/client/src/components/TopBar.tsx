// TopBar.tsx
// Design: Midnight Scholar - sticky top bar with search, notifications, user avatar

import { Search, Bell, User, Zap } from 'lucide-react';
import { useState } from 'react';

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between pl-16 pr-6 lg:pl-6 py-3.5 bg-[oklch(0.12_0.02_264)]/80 backdrop-blur-xl border-b border-white/5">
      {/* Left: Title */}
      <div className="hidden sm:block">
        <h2 className="text-base font-bold text-white leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-white/40 mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Center: Search */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200 ${
        searchFocused
          ? 'bg-white/8 border-indigo-500/40 shadow-sm shadow-indigo-500/10 w-72'
          : 'bg-white/4 border-white/8 w-56 sm:w-64'
      }`}>
        <Search className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search lectures, courses..."
          className="flex-1 bg-transparent text-xs text-white/70 placeholder-white/25 outline-none min-w-0"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        <kbd className="hidden sm:flex items-center gap-0.5 text-[9px] text-white/20 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
          ⌘K
        </kbd>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* AI Credits */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <Zap className="w-3 h-3 text-amber-400" />
          <span className="text-[11px] font-semibold text-amber-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            47 AI Credits
          </span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/5 transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-400 rounded-full" />
        </button>

        {/* User Avatar */}
        <button className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl hover:bg-white/5 transition-all group">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="hidden sm:block text-xs font-medium text-white/60 group-hover:text-white/80 transition-colors">
            Alex
          </span>
        </button>
      </div>
    </header>
  );
}
