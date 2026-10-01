import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User as UserIcon,
  LogOut,
  Bookmark,
  Sparkles,
  ChevronDown,
  UserPlus,
  Sliders,
  Check,
} from 'lucide-react';

interface UserAccountMenuProps {
  onOpenAuth: (mode: 'signup' | 'login') => void;
  onOpenSavedDocs: () => void;
}

export const UserAccountMenu: React.FC<UserAccountMenuProps> = ({
  onOpenAuth,
  onOpenSavedDocs,
}) => {
  const { user, isAuthenticated, logout, savedDocuments } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onOpenAuth('signup')}
          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-blue-500/20 transition-all"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Sign Up</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenAuth('login')}
          className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 font-bold text-xs transition-colors"
        >
          <span>Sign In</span>
        </button>
      </div>
    );
  }

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const needBadge =
    user.profile.primaryNeed === 'adhd'
      ? '🧠 ADHD Preset'
      : user.profile.primaryNeed === 'dyslexia'
      ? '📖 Dyslexia Preset'
      : user.profile.primaryNeed === 'low_vision'
      ? '👁️ Low Vision'
      : user.profile.primaryNeed === 'esl'
      ? '🌐 Plain English'
      : '✨ Accessible';

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-xs"
      >
        <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
          {initials || <UserIcon className="w-4 h-4" />}
        </div>
        <div className="text-left hidden md:block">
          <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[100px]">
            {user.name}
          </div>
          <div className="text-[10px] text-slate-400 leading-tight">
            {needBadge}
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
          {/* User Info Header */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800">
            <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
              {user.name}
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {user.email}
            </div>
            <div className="mt-1.5 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
              {needBadge}
            </div>
          </div>

          {/* Menu Items */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onOpenSavedDocs();
            }}
            className="w-full p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 text-xs font-semibold flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-blue-600" />
              <span>Saved Documents</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              {savedDocuments.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            className="w-full p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-700 dark:text-slate-300 hover:text-red-600 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};
