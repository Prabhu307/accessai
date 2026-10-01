import React, { useState } from 'react';
import {
  ContrastTheme,
  ReadingFont,
} from '../types/accessibility';
import {
  Sparkles,
  Sun,
  Moon,
  Eye,
  Coffee,
  Type,
  Maximize2,
  Minimize2,
  Compass,
  Sliders,
  HelpCircle,
  Volume2,
  CheckCircle2,
  Keyboard,
  X,
  Mic,
} from 'lucide-react';
import { UserAccountMenu } from './UserAccountMenu';

interface HeaderProps {
  theme: ContrastTheme;
  setTheme: (t: ContrastTheme) => void;
  fontFamily: ReadingFont;
  setFontFamily: (f: ReadingFont) => void;
  fontSize: number; // e.g. 100, 115, 130, 150, 175, 200
  setFontSize: (size: number) => void;
  dyslexiaMode: boolean;
  setDyslexiaMode: (v: boolean) => void;
  bionicMode: boolean;
  setBionicMode: (v: boolean) => void;
  rulerActive: boolean;
  setRulerActive: (v: boolean) => void;
  onOpenVoice: () => void;
  onOpenAuth: (mode: 'signup' | 'login') => void;
  onOpenSavedDocs: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  setTheme,
  fontFamily,
  setFontFamily,
  fontSize,
  setFontSize,
  dyslexiaMode,
  setDyslexiaMode,
  bionicMode,
  setBionicMode,
  rulerActive,
  setRulerActive,
  onOpenVoice,
  onOpenAuth,
  onOpenSavedDocs,
}) => {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);

  const increaseFontSize = () => {
    setFontSize(Math.min(220, fontSize + 15));
  };

  const decreaseFontSize = () => {
    setFontSize(Math.max(90, fontSize - 15));
  };

  const resetFontSize = () => {
    setFontSize(100);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b backdrop-blur-md transition-colors duration-200 border-slate-200/80 bg-white/90 dark:border-slate-800 dark:bg-slate-950/90"
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
                  ClarifyAI
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  Problem 29: Accessibility Assistant
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Demystifying complex medical, legal, and academic information for all minds
              </p>
            </div>
          </div>

          {/* Quick Accessibility Controls Toolbar */}
          <div className="flex items-center gap-2">
            {/* Quick Font Size Adjuster */}
            <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={decreaseFontSize}
                disabled={fontSize <= 90}
                aria-label="Decrease font size"
                title="Decrease font size (A-)"
                className="p-1.5 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 transition-colors"
              >
                <span className="text-xs font-bold px-1">A-</span>
              </button>
              <button
                type="button"
                onClick={resetFontSize}
                aria-label="Reset font size to 100%"
                title="Reset font size"
                className="px-2 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600"
              >
                {fontSize}%
              </button>
              <button
                type="button"
                onClick={increaseFontSize}
                disabled={fontSize >= 220}
                aria-label="Increase font size"
                title="Increase font size (A+)"
                className="p-1.5 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 transition-colors"
              >
                <span className="text-xs font-bold px-1">A+</span>
              </button>
            </div>

            {/* Quick Contrast Theme Picker */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setTheme('default')}
                aria-label="Light standard theme"
                title="Light mode"
                className={`p-1.5 rounded transition-all ${
                  theme === 'default'
                    ? 'bg-white dark:bg-slate-700 shadow-sm text-amber-600 font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                aria-label="Dark mode theme"
                title="Dark mode"
                className={`p-1.5 rounded transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-900 text-blue-400 shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Moon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setTheme('yellow-black')}
                aria-label="High contrast yellow on black (WCAG AAA)"
                title="High Contrast Yellow-on-Black (AAA)"
                className={`p-1.5 rounded transition-all ${
                  theme === 'yellow-black'
                    ? 'bg-black text-yellow-300 border border-yellow-300 font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setTheme('sepia')}
                aria-label="Soft warm sepia theme for eye relaxation"
                title="Warm Sepia (Low Eye Strain)"
                className={`p-1.5 rounded transition-all ${
                  theme === 'sepia'
                    ? 'bg-[#e9dac1] text-[#4a3525] font-bold shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Coffee className="w-4 h-4" />
              </button>
            </div>

            {/* Reading Assistance Quick Toggles */}
            <div className="hidden lg:flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setDyslexiaMode(!dyslexiaMode)}
                aria-pressed={dyslexiaMode}
                title="Toggle Dyslexia-friendly spacing & font"
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 ${
                  dyslexiaMode
                    ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                <Type className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Dyslexia Font</span>
              </button>

              <button
                type="button"
                onClick={() => setBionicMode(!bionicMode)}
                aria-pressed={bionicMode}
                title="Toggle Bionic Reading (bolds first half of words for ADHD & focus)"
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 ${
                  bionicMode
                    ? 'bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-700 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Bionic Read</span>
              </button>

              <button
                type="button"
                onClick={() => setRulerActive(!rulerActive)}
                aria-pressed={rulerActive}
                title="Toggle Reading Ruler (horizontal guide that follows cursor)"
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 ${
                  rulerActive
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Reading Ruler</span>
              </button>
            </div>

            {/* Live Voice Call Button with gemini-3.8-live */}
            <button
              type="button"
              onClick={onOpenVoice}
              aria-label="Start real-time voice conversation with Gemini Live"
              title="Real-time Voice Conversation (gemini-3.8-live)"
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-blue-500/20 transition-transform active:scale-95"
            >
              <Mic className="w-3.5 h-3.5 animate-pulse" />
              <span className="hidden sm:inline">Live Voice</span>
            </button>

            {/* Accessibility Panel & Help Shortcuts */}
            <button
              type="button"
              onClick={() => setShowShortcuts(true)}
              aria-label="View keyboard shortcuts and accessibility guide"
              title="Keyboard shortcuts & accessibility tips"
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* User Account / Sign Up / Sign In Menu */}
            <UserAccountMenu
              onOpenAuth={onOpenAuth}
              onOpenSavedDocs={onOpenSavedDocs}
            />

            {/* Mobile / Full Settings Trigger */}
            <button
              type="button"
              onClick={() => setShowSettingsDrawer(true)}
              aria-label="Open reading customization drawer"
              className="lg:hidden p-2 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Accessibility Preferences Drawer for Mobile or Detailed Customization */}
      {showSettingsDrawer && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="accessibility-drawer-title"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end"
        >
          <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full p-6 shadow-2xl overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-blue-600" />
                  <h2 id="accessibility-drawer-title" className="font-bold text-lg text-slate-900 dark:text-white">
                    Accessibility Preferences
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSettingsDrawer(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                  aria-label="Close preferences drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6 py-6">
                {/* Font Family */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                    Reading Font Family
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFontFamily('default')}
                      className={`p-3 rounded-lg border text-left text-sm ${
                        fontFamily === 'default'
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 font-bold text-blue-800 dark:text-blue-300'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="font-sans">Standard Clean</div>
                      <div className="text-xs text-slate-500">Plus Jakarta Sans</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontFamily('hyperlegible')}
                      className={`p-3 rounded-lg border text-left text-sm ${
                        fontFamily === 'hyperlegible'
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 font-bold text-blue-800 dark:text-blue-300'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="font-hyper">Atkinson Hyper</div>
                      <div className="text-xs text-slate-500">Braille Institute high-legibility</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontFamily('lexend')}
                      className={`p-3 rounded-lg border text-left text-sm ${
                        fontFamily === 'lexend'
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 font-bold text-blue-800 dark:text-blue-300'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="font-lexend">Lexend</div>
                      <div className="text-xs text-slate-500">Designed to reduce visual stress</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontFamily('dyslexic')}
                      className={`p-3 rounded-lg border text-left text-sm ${
                        fontFamily === 'dyslexic'
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 font-bold text-blue-800 dark:text-blue-300'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="font-dyslexia">Dyslexia Friendly</div>
                      <div className="text-xs text-slate-500">Distinct letterforms</div>
                    </button>
                  </div>
                </div>

                {/* Font Size Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="font-size-slider" className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Text Scale: {fontSize}%
                    </label>
                    <button
                      type="button"
                      onClick={resetFontSize}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Reset to 100%
                    </button>
                  </div>
                  <input
                    id="font-size-slider"
                    type="range"
                    min="90"
                    max="220"
                    step="10"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>90%</span>
                    <span>150%</span>
                    <span>220%</span>
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                    <div>
                      <div className="font-medium text-sm text-slate-900 dark:text-white">
                        Dyslexia Spacing & Font
                      </div>
                      <div className="text-xs text-slate-500">
                        Increases letter and line spacing to prevent visual crowding
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={dyslexiaMode}
                      onChange={(e) => setDyslexiaMode(e.target.checked)}
                      className="w-5 h-5 rounded text-blue-600 accent-blue-600"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                    <div>
                      <div className="font-medium text-sm text-slate-900 dark:text-white">
                        Bionic Reading Mode
                      </div>
                      <div className="text-xs text-slate-500">
                        Bold initial characters to guide eyes effortlessly (ADHD focus)
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={bionicMode}
                      onChange={(e) => setBionicMode(e.target.checked)}
                      className="w-5 h-5 rounded text-indigo-600 accent-indigo-600"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                    <div>
                      <div className="font-medium text-sm text-slate-900 dark:text-white">
                        Visual Reading Ruler
                      </div>
                      <div className="text-xs text-slate-500">
                        Highlight bar that follows your cursor to avoid losing your line
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={rulerActive}
                      onChange={(e) => setRulerActive(e.target.checked)}
                      className="w-5 h-5 rounded text-emerald-600 accent-emerald-600"
                    />
                  </label>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowSettingsDrawer(false)}
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              Done & Apply
            </button>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts & Accessibility Guide Dialog */}
      {showShortcuts && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-dialog-title"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-blue-600" />
                <h3 id="shortcuts-dialog-title" className="font-bold text-lg text-slate-900 dark:text-white">
                  Keyboard Shortcuts & Accessibility Info
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowShortcuts(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                aria-label="Close shortcuts modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-sm">
              <p className="text-slate-600 dark:text-slate-400">
                ClarifyAI complies with WCAG 2.2 AAA accessibility standards. You can navigate the entire application without a mouse.
              </p>

              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 rounded bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-700 dark:text-slate-300">Play / Pause Narration</span>
                  <kbd className="px-2 py-1 bg-white dark:bg-slate-900 border rounded text-xs font-mono font-bold shadow-xs">Space</kbd>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-700 dark:text-slate-300">Navigate Interactive Focus Cards</span>
                  <div className="flex gap-1">
                    <kbd className="px-2 py-1 bg-white dark:bg-slate-900 border rounded text-xs font-mono font-bold shadow-xs">←</kbd>
                    <kbd className="px-2 py-1 bg-white dark:bg-slate-900 border rounded text-xs font-mono font-bold shadow-xs">→</kbd>
                  </div>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-700 dark:text-slate-300">Cycle Contrast Themes</span>
                  <kbd className="px-2 py-1 bg-white dark:bg-slate-900 border rounded text-xs font-mono font-bold shadow-xs">Alt + C</kbd>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-700 dark:text-slate-300">Toggle Bionic Reading Mode</span>
                  <kbd className="px-2 py-1 bg-white dark:bg-slate-900 border rounded text-xs font-mono font-bold shadow-xs">Alt + B</kbd>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  Screen Reader Support:
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  All headings, buttons, inputs, and tabs have semantic ARIA labels, live announcement regions, and high-contrast visible focus rings.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowShortcuts(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
