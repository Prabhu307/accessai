import React, { useState } from 'react';
import {
  Search,
  ExternalLink,
  Loader2,
  Globe,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface SearchGroundingPanelProps {
  documentContext: string;
  documentTitle: string;
}

export const SearchGroundingPanel: React.FC<SearchGroundingPanelProps> = ({
  documentContext,
  documentTitle,
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    answer: string;
    sources: Array<{ title: string; url: string }>;
    searchQueries: string[];
  } | null>(null);

  const samplePrompts = [
    'Check latest FDA warnings or safety recalls for these medications',
    'What are the 2026 IRS rules and deadlines for Collection Due Process Form 12153?',
    'What is the standard legal timeline for security deposit returns in tenant law?',
    'Explain the clinical differences between Cas9 and SpCas9-HF1 in plain terms',
  ];

  const handleSearch = async (queryText?: string) => {
    const q = queryText || query;
    if (!q.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/search-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          documentContext,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResult({
          answer: data.answer,
          sources: data.sources || [],
          searchQueries: data.searchQueries || [],
        });
      } else {
        setError(data.error || 'Failed to complete grounded search');
      }
    } catch (err: any) {
      setError(err.message || 'Network error executing Google Search grounding');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span>Google Search Grounding & Real-Time Fact Check</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
                gemini-3.5-flash
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cross-check document terms with live official Google Search data
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 w-fit">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verified Sources</span>
        </span>
      </div>

      {/* Suggested Search Prompts */}
      <div>
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>Recommended Fact-Checking Inquiries:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {samplePrompts.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setQuery(p);
                handleSearch(p);
              }}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors text-left"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="flex items-center gap-2"
      >
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search live official regulations, drug advisories, or statutes for this document..."
            disabled={isLoading}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-40 transition-colors shadow-md shadow-blue-500/20"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Searching Google...</span>
            </>
          ) : (
            <>
              <Search className="w-3.5 h-3.5" />
              <span>Verify</span>
            </>
          )}
        </button>
      </form>

      {/* Error alert */}
      {error && (
        <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className="space-y-4 pt-2">
          {/* Grounded Explanation */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-300">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Grounded Plain-Language Explanation:</span>
            </div>
            <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line font-medium">
              {result.answer}
            </div>
          </div>

          {/* Search Queries Executed */}
          {result.searchQueries.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-500">
              <span className="font-semibold">Google queries performed:</span>
              {result.searchQueries.map((sq, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono"
                >
                  "{sq}"
                </span>
              ))}
            </div>
          )}

          {/* Verified Web Citations */}
          {result.sources.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Verified Web Sources & Official References:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.sources.map((src, idx) => (
                  <a
                    key={idx}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all flex items-center justify-between gap-2 group"
                  >
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600">
                        {src.title}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {src.url}
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
