'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { BookOpen, Calendar, ClipboardList, GraduationCap } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { getPublicPrograms } from '@/app/admin/programs/actions';
import { Program, SubProgram } from '@/types/program';
import { Skeleton } from '@/components/ui/skeleton';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { formatRupiah } from '@/lib/utils';
import { useWhatsAppModal } from '@/providers/SiteSettingsContext';

// --- Helper Icon Component ---
const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (LucideIcons as any)[name] || LucideIcons.HelpCircle;
  return <IconComponent className={className} />;
};

// --- Modal Component ---

interface ModalProps {
  sub: SubProgram;
  accentClass: string;
  badgeBg: string;
  borderAccent: string;
  programIconName: string;
  programTitle: string;
  onClose: () => void;
}

function ProgramModal({ sub, accentClass, badgeBg, borderAccent, programIconName, programTitle, onClose }: ModalProps) {
  const { openWhatsAppModal } = useWhatsAppModal();

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const { harga_daftar, spp_bulanan, spp_label, spp_note, harga_modul, harga_ujian, jadwal, materi } = sub;

  const priceItems = [
    {
      label: 'Harga Daftar',
      value: formatRupiah(harga_daftar),
      valueDiscount: sub.is_discount_active && sub.harga_daftar_discount !== null && sub.harga_daftar_discount !== undefined
        ? (sub.harga_daftar_discount === 0 ? 'GRATIS (Rp 0)' : formatRupiah(sub.harga_daftar_discount))
        : null,
      icon: ClipboardList,
      note: 'Dibayar sekali saat pendaftaran'
    },
    {
      label: spp_label ?? 'SPP Bulanan',
      value: formatRupiah(spp_bulanan),
      valueDiscount: sub.is_discount_active && sub.spp_bulanan_discount !== null && sub.spp_bulanan_discount !== undefined
        ? formatRupiah(sub.spp_bulanan_discount)
        : null,
      icon: Calendar,
      note: spp_note ?? 'Dibayar setiap bulan'
    },
    ...(harga_modul !== null && harga_modul !== undefined
      ? [{ label: 'Harga Modul', value: formatRupiah(harga_modul), icon: BookOpen, note: 'Buku ajar / modul pembelajaran' }]
      : []),
    ...(harga_ujian !== null && harga_ujian !== undefined
      ? [{ label: 'Harga Ujian', value: formatRupiah(harga_ujian), icon: GraduationCap, note: 'Biaya pelaksanaan ujian' }]
      : []),
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal Panel */}
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`sticky top-0 z-10 bg-white border-b ${borderAccent} px-6 py-5 rounded-t-3xl flex items-start justify-between gap-4`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              <DynamicIcon name={programIconName} className="w-6 h-6" />
            </span>
            <div>
              <p className={`text-[10px] font-bold tracking-widest uppercase ${accentClass}`}>{programTitle}</p>
              <h3 className="text-lg font-bold text-gray-900 leading-tight flex items-center gap-2">
                {sub.name}
                {sub.is_discount_active && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-2 animate-pulse">
                    {sub.discount_percentage ? `${sub.discount_percentage}% OFF` : 'PROMO'}
                  </span>
                )}
              </h3>
              {sub.badge && (
                <span className={`inline-block mt-1 text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ${badgeBg} ${accentClass}`}>
                  {sub.badge}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            aria-label="Tutup modal"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed">{sub.description}</p>

          {/* Schedule */}
          <div className={`flex items-center gap-3 p-4 rounded-2xl border ${borderAccent} ${badgeBg}`}>
            <Calendar className="w-6 h-6 text-black" />
            <div>
              <p className={`text-[10px] font-bold tracking-wider uppercase ${accentClass}`}>Jadwal Pertemuan</p>
              <p className="text-gray-800 font-semibold text-sm mt-0.5">{jadwal}</p>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">Biaya Program</h4>
            <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
              {priceItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex flex-col gap-1 p-4 rounded-2xl border border-gray-100 bg-gray-50">
                    <div className={`${accentClass} p-2 w-fit rounded-xl bg-blue-50`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium mt-1">{item.label}</p>
                    {sub.is_discount_active && item.valueDiscount ? (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground line-through">{item.value}</p>
                        <p className="text-base font-bold text-red-600">{item.valueDiscount}</p>
                      </div>
                    ) : (
                      <p className="text-base font-bold text-gray-900">{item.value}</p>
                    )}
                    <p className="text-[10px] text-gray-400">{item.note}</p>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-[11px] text-gray-400 flex items-center gap-1.5">
              <span>ℹ️</span>
              Harga dapat berubah sewaktu-waktu. Hubungi kami untuk informasi terbaru.
            </p>
          </div>

          {/* Materi */}
          {materi && materi.length > 0 && (
            <div>
              <h4 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">Materi yang Dipelajari</h4>
              <ul className="space-y-2">
                {materi.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <span className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full ${badgeBg} ${accentClass} flex items-center justify-center text-[10px] font-bold`}>
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Module Images */}
          {sub.module_images && sub.module_images.length > 0 && (
            <div>
              <h4 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">Galeri Modul / Buku</h4>
              <Carousel className="w-full max-w-xl mx-auto">
                <CarouselContent>
                  {sub.module_images.map((img, idx) => (
                    <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/3">
                      <div className="p-1">
                        <Dialog>
                          <DialogTrigger render={<button type="button" className="cursor-pointer overflow-hidden rounded-xl border hover:border-blue-500 transition-colors w-full block focus:outline-none" />}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img} alt={`Module ${idx}`} className="w-full h-40 object-cover" />
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl bg-transparent border-none shadow-none">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img} alt={`Module ${idx}`} className="w-full h-auto max-h-[80vh] object-contain rounded-lg" />
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 rounded-b-3xl flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              openWhatsAppModal({
                programName: sub.name,
                defaultMessage: `Halo Admin, saya ingin berkonsultasi mengenai program ${sub.name}. Boleh dibantu penjelasan jadwal dan rekomendasinya?`
              });
            }}
            className="flex-1 inline-flex justify-center items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-all cursor-pointer"
          >
            Konsultasi Dulu
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              openWhatsAppModal({
                programName: sub.name,
                templateType: 'program',
              });
            }}
            className="flex-1 inline-flex justify-center items-center gap-2 px-5 py-2.5 rounded-full bg-[#2546a1] text-white font-bold text-sm hover:bg-[#1a347d] transition-all shadow hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
          >
            Daftar Sekarang
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Sub-component: SubProgramCard ---

interface SubProgramCardProps {
  sub: SubProgram;
  accentClass: string;
  badgeBg: string;
  onClick: () => void;
}

function SubProgramCard({ sub, accentClass, badgeBg, onClick }: SubProgramCardProps) {
  return (
    <button
      onClick={onClick}
      className="group text-left flex flex-col gap-2 p-4 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-md transition-all duration-200 w-full relative"
    >
      {sub.is_discount_active && (
        <div className="absolute -top-3 -right-3 z-10">
          <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white animate-pulse">
            PROMO {sub.discount_percentage ? `${sub.discount_percentage}%` : ''}
          </span>
        </div>
      )}
      <div className="flex items-start justify-between gap-2 w-full">
        {sub.badge && (
          <span className={`self-start text-[10px] font-medium tracking-widest uppercase px-2.5 py-1 rounded-full ${badgeBg} ${accentClass}`}>
            {sub.badge}
          </span>
        )}
        <span className="flex-shrink-0 text-gray-300 group-hover:text-gray-500 transition-colors ml-auto">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </span>
      </div>
      <p className="text-sm font-semibold text-gray-800 leading-snug group-hover:text-gray-900">{sub.name}</p>
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{sub.description}</p>
      <p className={`text-[10px] font-bold tracking-wide ${accentClass} opacity-0 group-hover:opacity-100 transition-opacity mt-auto pt-2`}>
        Klik untuk lihat detail & harga →
      </p>
    </button>
  );
}

// --- Main Component ---

export default function Programs() {
  const [activeId, setActiveId] = useState<string>('');
  const [selectedSub, setSelectedSub] = useState<SubProgram | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = await getPublicPrograms();
      setPrograms(data || []);
      if (data && data.length > 0) {
        setActiveId(data[0].id);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const active = programs.find((p) => p.id === activeId);
  const handleClose = useCallback(() => setSelectedSub(null), []);

  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden" id='program'>
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[120px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-50 rounded-full blur-[100px] opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-blue-100 bg-blue-50/50 mb-5">
            <span className="text-[11px] font-bold tracking-[0.15em] text-blue-700 uppercase">
              Program Unggulan
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-primary leading-[1.1] tracking-tight">
            Semua yang Kamu Butuhkan,<br />
            <span className="italic text-primary font-serif">Ada di Sini.</span>
          </h2>
          <p className="mt-5 text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
            Dari Bahasa Inggris hingga Calistung — kami siapkan program belajar terbaik untuk setiap kebutuhan dan usia.
          </p>
        </div>

        {loading ? (
          <div className="space-y-8">
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-10 w-32 rounded-full" />)}
            </div>
            <div className="rounded-3xl border border-gray-100 bg-gray-50 overflow-hidden shadow-sm p-6 md:p-10">
              <Skeleton className="h-14 w-64 mb-8 rounded-xl" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
              </div>
            </div>
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Belum ada program yang tersedia.
          </div>
        ) : active ? (
          <>
            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {programs.map((prog) => {
                return (
                  <button
                    key={prog.id}
                    onClick={() => setActiveId(prog.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                      activeId === prog.id
                        ? `${prog.color} text-white border-transparent shadow-md scale-[1.03]`
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <DynamicIcon name={prog.icon_name} className="w-4 h-4" />
                    <span>{prog.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Program Panel */}
            <div className="rounded-3xl border border-gray-100 bg-gray-50 overflow-hidden shadow-sm">
              <div className="p-6 md:p-10">

                {/* Program Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl ${active.color} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                      <DynamicIcon name={active.icon_name} className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-[#0f172a] tracking-tight">{active.title}</h3>
                      <p className="text-gray-500 text-sm mt-0.5 max-w-md">{active.description}</p>
                    </div>
                  </div>
                </div>

                {/* Click hint */}
                <p className="text-xs text-gray-400 mb-4 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Klik kartu program untuk melihat detail, harga, dan materi pembelajaran.
                </p>

                {/* Sub-program Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {active.sub_programs?.filter((sub: SubProgram) => sub.is_active).map((sub: SubProgram) => (
                    <SubProgramCard
                      key={sub.id}
                      sub={sub}
                      accentClass={active.accent_class}
                      badgeBg={active.badge_bg}
                      onClick={() => setSelectedSub(sub)}
                    />
                  ))}
                </div>
              </div>

              {/* CTA Footer */}
              <div className="border-t border-gray-200 bg-white px-6 md:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-500">
                  Tidak yakin program mana yang cocok?{' '}
                  <Link href="/contact" className="font-semibold text-primary hover:underline underline-offset-2">
                    Hubungi kami
                  </Link>
                </p>
                <Link
                  href="/daftar"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#2546a1] text-white font-bold text-sm hover:bg-[#1a347d] transition-all shadow hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap"
                >
                  Daftar Kelas Sekarang
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </>
        ) : null}

      </div>

      {/* Modal */}
      {selectedSub && active && (
        <ProgramModal
          sub={selectedSub}
          accentClass={active.accent_class}
          badgeBg={active.badge_bg}
          borderAccent={active.border_accent}
          programIconName={active.icon_name}
          programTitle={active.title}
          onClose={handleClose}
        />
      )}
    </section>
  );
}
