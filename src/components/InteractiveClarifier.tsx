import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Loader2,
  Sparkles,
  Bot,
  User,
  HelpCircle,
  CheckCircle,
} from 'lucide-react';

interface InteractiveClarifierProps {
  originalText: string;
  documentTitle: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

export const InteractiveClarifier: React.FC<InteractiveClarifierProps> = ({
  originalText,
  documentTitle,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: `Hello! I'm here to clarify anything in "${documentTitle}". You can ask me what a word means, whether you owe money, when to take a dose, or ask me to explain any sentence in simpler words.`,
    },
  ]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestedQuestions = [
    'What is the #1 most urgent thing I need to do?',
    'Are there any penalties, fees, or risks mentioned?',
    'What should I definitely avoid doing?',
    'Explain this as if I have never seen this topic before.',
  ];

  const handleAsk = async (qText?: string) => {
    const textToAsk = qText || question;
    if (!textToAsk.trim() || loading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: textToAsk.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuestion('');
    setLoading(true);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalText,
          question: textToAsk.trim(),
          audience: 'plain_language',
        }),
      });
      const data = await res.json();
      if (data.success && data.answer) {
        const assistantMsg: Message = {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text: data.answer,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        const errorMsg: Message = {
          id: `err-${Date.now()}`,
          role: 'assistant',
          text: 'I apologize, but I could not clarify that right now. Please try rephrasing your question.',
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        text: 'Network issue connecting to ClarifyAI. Please check your connection.',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Ask ClarifyAI About This Document
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Get direct, jargon-free answers to your doubts
            </p>
          </div>
        </div>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
          Supportive AI Tutor
        </span>
      </div>

      {/* Suggested Quick Questions */}
      <div>
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
          <span>Quick Clarification Prompts:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((sq, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleAsk(sq)}
              disabled={loading}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-300 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors text-left"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Chat History Box */}
      <div className="max-h-72 overflow-y-auto space-y-3 p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 text-xs leading-relaxed ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.role === 'assistant' && (
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}
            <div
              className={`p-3 rounded-2xl max-w-[85%] ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-xs rounded-bl-xs'
              }`}
            >
              {m.text}
            </div>
            {m.role === 'user' && (
              <div className="w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 text-xs justify-start">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
              <span>Analyzing document in simple terms...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask anything about this document in simple words..."
          disabled={loading}
          className="flex-1 p-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 transition-colors shadow-md shadow-blue-500/20"
          aria-label="Send question"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
