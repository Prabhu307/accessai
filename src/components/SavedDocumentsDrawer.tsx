import React from 'react';
import { useAuth } from '../context/AuthContext';
import { SavedUserDocument } from '../types/auth';
import { TransformedDocument } from '../types/accessibility';
import {
  X,
  Bookmark,
  Trash2,
  FolderOpen,
  ArrowRight,
  Clock,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

interface SavedDocumentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDocument: (doc: SavedUserDocument) => void;
}

export const SavedDocumentsDrawer: React.FC<SavedDocumentsDrawerProps> = ({
  isOpen,
  onClose,
  onSelectDocument,
}) => {
  const { savedDocuments, deleteDocument, user } = useAuth();

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="saved-docs-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800">
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h2 id="saved-docs-title" className="font-extrabold text-base text-slate-900 dark:text-white">
                Saved Documents
              </h2>
              <p className="text-xs text-slate-500">
                {user ? `${user.name}'s Library (${savedDocuments.length})` : `Saved in local session (${savedDocuments.length})`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close saved documents drawer"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Document List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {savedDocuments.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <FolderOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">
                No Saved Documents Yet
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                When you transform a medical record, tax notice, or contract, click "Save to Library" to keep it here.
              </p>
            </div>
          ) : (
            savedDocuments.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-blue-300 transition-all space-y-2.5 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 uppercase">
                    {doc.documentType}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(doc.savedAt).toLocaleDateString()}</span>
                  </span>
                </div>

                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2">
                  {doc.title}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {doc.oneSentenceSummary}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                  <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {doc.simplifiedGrade}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => deleteDocument(doc.id)}
                      aria-label="Delete document"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectDocument(doc);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 transition-colors shadow-xs"
                    >
                      <span>Open</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
