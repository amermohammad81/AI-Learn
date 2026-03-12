// Sidebar.tsx
// Design: Midnight Scholar - Dark Academia Glassmorphism
// Fixed left sidebar with icon + label navigation, Pro badge, collapsible on mobile

import { useState } from 'react';
import {
  Home,
  BookOpen,
  Globe,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Brain,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'courses', label: 'My Courses', icon: BookOpen },
  { id: 'library', label: 'Global Library', icon: Globe },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

export function Sidebar({ activeView, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-5 border-b border-white/5',
        collapsed && 'justify-center px-2'
      )}>
        <div className="relative flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[oklch(0.10_0.02_264)]" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-sm font-bold text-white leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Study<span className="text-indigo-400">AI</span>
            </h1>
            <p className="text-[10px] text-white/40 leading-tight">Smart Learning</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileOpen(false);
              }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative',
                collapsed && 'justify-center px-2',
                isActive
                  ? 'bg-indigo-500/20 text-indigo-300 shadow-sm shadow-indigo-500/10'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-400 rounded-full" />
              )}
              <Icon className={cn(
                'flex-shrink-0 transition-colors',
                collapsed ? 'w-5 h-5' : 'w-4 h-4',
                isActive ? 'text-indigo-400' : 'text-white/40 group-hover:text-white/60'
              )} />
              {!collapsed && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span className="ml-auto text-[10px] bg-indigo-500/30 text-indigo-300 px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Pro Badge */}
      <div className="px-2 pb-4">
        {!collapsed ? (
          <div className="relative overflow-hidden rounded-xl p-3 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20">
            <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 rounded-full -translate-y-6 translate-x-6" />
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-amber-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                PRO
              </span>
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed">
              Unlock unlimited AI processing & advanced analytics
            </p>
            <button className="mt-2 w-full text-[11px] font-semibold bg-gradient-to-r from-indigo-500 to-violet-500 text-white py-1.5 rounded-lg hover:opacity-90 transition-opacity">
              Upgrade Now
            </button>
          </div>
        ) : (
          <button className="w-full flex justify-center p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 hover:opacity-80 transition-opacity">
            <Sparkles className="w-4 h-4 text-amber-400" />
          </button>
        )}
      </div>

      {/* Collapse Toggle (desktop) */}
      <div className="px-2 pb-3 hidden lg:block">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 py-2 text-white/30 hover:text-white/60 transition-colors text-xs rounded-lg hover:bg-white/5"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-[oklch(0.16_0.02_264)] border border-white/10 text-white/70 hover:text-white transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside className={cn(
        'lg:hidden fixed left-0 top-0 bottom-0 z-50 w-64 bg-[oklch(0.10_0.02_264)] border-r border-white/5 transition-transform duration-300',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className={cn(
        'hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-30 bg-[oklch(0.10_0.02_264)] border-r border-white/5 transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}>
        <SidebarContent />
      </aside>
    </>
  );
}
