'use client';

import React, { useEffect, useRef } from 'react';
import { useSiteSettings } from '@/providers/SiteSettingsContext';
import { formatDisplayPhone } from '@/lib/whatsapp';
import { MessageCircle, Send, X, Sparkles, MessageSquare, CheckCircle2, RefreshCw } from 'lucide-react';

export default function WhatsAppModal() {
  const {
    settings,
    isModalOpen,
    closeWhatsAppModal,
    modalMessage,
    setModalMessage,
    selectedProgram,
    activeTemplateType,
    selectTemplateType,
    sendWhatsAppMessage,
  } = useSiteSettings();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus textarea when modal opens
  useEffect(() => {
    if (isModalOpen) {
      const timer = setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          // Move cursor to end of text
          const len = textareaRef.current.value.length;
          textareaRef.current.setSelectionRange(len, len);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeWhatsAppModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeWhatsAppModal]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  const displayPhone = formatDisplayPhone(settings.whatsapp_number);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendWhatsAppMessage();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in-0 duration-200"
      onClick={closeWhatsAppModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="wa-modal-title"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />

      {/* Modal Card */}
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 transform transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="bg-[#25D366] p-6 text-white relative">
          {/* Close button */}
          <button
            onClick={closeWhatsAppModal}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <MessageCircle className="w-7 h-7 text-white fill-white/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="wa-modal-title" className="text-xl font-bold text-white tracking-tight">
                  Kirim Pesan WhatsApp
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-800/40 text-emerald-100 border border-emerald-300/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  CS Online
                </span>
              </div>
              <p className="text-emerald-100 text-xs mt-0.5">
                Admin Customer Service SMART in ENGLISH
              </p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Info Card: Destination Number */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Tujuan Chat</p>
                <p className="font-bold text-slate-800 text-sm">{displayPhone}</p>
              </div>
            </div>
            <span className="text-[11px] text-slate-500 hidden sm:inline-block bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-medium">
              Respon Cepat
            </span>
          </div>

          {/* Template Switcher Buttons */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Pilih Template Pesan
              </label>
              <span className="text-[11px] text-slate-400">Bisa diedit</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => selectTemplateType('default')}
                className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all text-center ${
                  activeTemplateType === 'default'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Pesan Umum
              </button>

              <button
                type="button"
                onClick={() => selectTemplateType('program')}
                className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all text-center truncate ${
                  activeTemplateType === 'program'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                title={selectedProgram ? `Program: ${selectedProgram}` : 'Template Program'}
              >
                {selectedProgram ? `Program: ${selectedProgram}` : 'Program Kursus'}
              </button>

              <button
                type="button"
                onClick={() => selectTemplateType('custom')}
                className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all text-center ${
                  activeTemplateType === 'custom'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Tulis Bebas
              </button>
            </div>
          </div>

          {/* Textarea Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="wa-message-input" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                Isi Pesan WhatsApp:
              </label>
              <span className="text-[11px] text-slate-400">
                {modalMessage.length} karakter
              </span>
            </div>

            <div className="relative">
              <textarea
                id="wa-message-input"
                ref={textareaRef}
                rows={4}
                value={modalMessage}
                onChange={(e) => setModalMessage(e.target.value)}
                placeholder="Tuliskan pertanyaan atau informasi yang ingin Anda tanyakan ke admin..."
                className="w-full p-3.5 text-sm text-slate-800 bg-slate-50/70 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent transition-all resize-none"
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              💡 <span className="font-medium text-slate-500">Tips:</span> Silakan sesuaikan isi pesan di atas sebelum Anda dialihkan ke aplikasi WhatsApp.
            </p>
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={closeWhatsAppModal}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-[2] py-3 px-5 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 hover:shadow-green-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Send className="w-4 h-4" />
              <span>Kirim via WhatsApp</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
