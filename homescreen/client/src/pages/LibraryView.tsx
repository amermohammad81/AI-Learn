// LibraryView.tsx
// Design: Midnight Scholar - Global library of shared study materials

import { Globe, Star, Download, Search, BookOpen, Filter } from 'lucide-react';
import { GLOBAL_LIBRARY_ITEMS } from '@/lib/data';
import { useState } from 'react';
import { toast } from 'sonner';

export function LibraryView() {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = GLOBAL_LIBRARY_ITEMS.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-extrabold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Global Library
          </h1>
          <p className="text-xs text-white/40 mt-0.5">
            Community-shared study materials powered by AI
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full">
          <Globe className="w-3 h-3" />
          {GLOBAL_LIBRARY_ITEMS.length} Resources
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 border border-white/8 focus-within:border-indigo-500/40 transition-colors">
          <Search className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs text-white/70 placeholder-white/25 outline-none"
          />
        </div>
        <button
          onClick={() => toast.info('Filter feature coming soon!', { duration: 2000 })}
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 border border-white/8 text-xs text-white/50 hover:text-white/70 hover:bg-white/8 transition-all"
        >
          <Filter className="w-3.5 h-3.5" />
          Filter
        </button>
      </div>

      {/* Library Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item, index) => (
          <div
            key={item.id}
            className="rounded-2xl p-5 bg-[oklch(0.16_0.02_264)] border border-white/8 hover:border-white/15 transition-all duration-200 hover:-translate-y-0.5 group card-enter"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/8 border border-white/10 text-white/40">
                {item.subject}
              </span>
            </div>

            <h3 className="text-sm font-bold text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {item.title}
            </h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-[11px] text-white/35">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-amber-400">{item.rating}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  {item.downloads.toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => toast.success(`Downloading "${item.title}"...`, { duration: 2000 })}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/25 text-[11px] font-medium text-indigo-400 hover:bg-indigo-500/25 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Download className="w-3 h-3" />
                Get
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Globe className="w-10 h-10 text-white/15 mx-auto mb-3" />
          <p className="text-sm text-white/40">No results found</p>
        </div>
      )}
    </div>
  );
}
