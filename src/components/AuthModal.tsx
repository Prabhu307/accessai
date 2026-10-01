import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AccessibilityNeed } from '../types/auth';
import {
  X,
  User,
  Mail,
  Lock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  Zap,
  BookOpen,
  Globe,
  Sliders,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signup' | 'login';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'signup',
}) => {
  const { signup, login, loginDemoUser } = useAuth();

  const [mode, setMode] = useState<'signup' | 'login'>(defaultMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [primaryNeed, setPrimaryNeed] = useState<AccessibilityNeed>('adhd');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const res = await signup(name, email, password, primaryNeed);
        if (res.success) {
          onClose();
        } else {
          setError(res.error || 'Failed to create account.');
        }
      } else {
        const res = await login(email, password);
        if (res.success) {
          onClose();
        } else {
          setError(res.error || 'Failed to sign in.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginDemoUser();
    onClose();
  };

  const accessibilityOptions: Array<{
    id: AccessibilityNeed;
    label: string;
    description: string;
    icon: any;
    preset: string;
  }> = [
    {
      id: 'adhd',
      label: 'ADHD & Executive Function',
      description: 'Prioritized checklist, single-step cards, bionic word fixation.',
      icon: Zap,
      preset: 'Bionic Reading + Step Mode',
    },
    {
      id: 'dyslexia',
      label: 'Dyslexia & Reading Strain',
      description: 'Multisyllabic breakdowns, Open-Dyslexic spacing & font.',
      icon: BookOpen,
      preset: 'Dyslexic Font + Syllable Guides',
    },
    {
      id: 'low_vision',
      label: 'Low Vision & Contrast Needs',
      description: 'High-contrast yellow/black WCAG AAA theme + enlarged fonts.',
      icon: Eye,
      preset: 'High Contrast + 120% Zoom',
    },
    {
      id: 'esl',
      label: 'English as Second Language',
      description: 'Grade 3-4 plain everyday vocabulary with real-world analogies.',
      icon: Globe,
      preset: 'Plain English + Jargon Buster',
    },
    {
      id: 'general',
      label: 'General Accessibility',
      description: 'Atkinson Hyperlegible typography with audio narration.',
      icon: Sliders,
      preset: 'Balanced Accessibility',
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 id="auth-modal-title" className="font-extrabold text-base text-slate-900 dark:text-white">
                {mode === 'signup' ? 'Create ClarifyAI Account' : 'Welcome Back'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Personalized accessibility profile & document library
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch between Sign Up and Sign In */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-1.5">
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'signup'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Sign Up (New User)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'login'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Sign In (Existing)
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name / Preferred Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maya Patel"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Password {mode === 'signup' && <span className="font-normal text-slate-400">(or leave simple for local use)</span>}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>

            {/* Accessibility Profile Selection during Sign Up */}
            {mode === 'signup' && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Your Primary Accessibility Goal:
                  </label>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                    Auto-tunes app settings
                  </span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {accessibilityOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = primaryNeed === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setPrimaryNeed(opt.id)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 shadow-xs'
                            : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div
                          className={`p-1.5 rounded-lg mt-0.5 shrink-0 ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">
                              {opt.label}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                            {opt.description}
                          </p>
                          <span className="inline-block mt-1 text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                            Preset: {opt.preset}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 mt-4"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {isLoading
                  ? 'Saving Profile...'
                  : mode === 'signup'
                  ? 'Create My Accessible Account'
                  : 'Sign In to ClarifyAI'}
              </span>
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block mb-2">
              Evaluating ClarifyAI for the Hackathon?
            </span>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Instant 1-Click Demo Login (Pre-configured ADHD Profile)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
