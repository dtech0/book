'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md glass-card rounded-[2.5rem] border border-slate-200/80 dark:border-white/10 shadow-2xl p-7 sm:p-9 space-y-6 animate-in zoom-in-95">
        <div className="flex items-start gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
              isDestructive
                ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30 shadow-rose-950/30'
                : 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 shadow-emerald-950/30'
            }`}
          >
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">{title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">{message}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3.5 px-4 rounded-2xl glass-panel hover:bg-slate-100 dark:hover:bg-white/10 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-black text-white shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] ${
              isDestructive
                ? 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-rose-600/30'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/30'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
