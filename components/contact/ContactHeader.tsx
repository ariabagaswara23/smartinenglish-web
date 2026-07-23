import React from "react";
import { Headphones } from "lucide-react";

export default function ContactHeader() {
  return (
    <section className="relative overflow-hidden bg-[#fafafc] pt-24 pb-12 md:pt-32 md:pb-16 border-b border-gray-100">
      {/* Background pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.2]"
        style={{
          backgroundImage: "radial-gradient(#94a3b8 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center justify-center space-x-2 px-4 py-1.5 rounded-full border border-blue-100 bg-blue-50/50 mb-6 shadow-sm">
          <Headphones className="w-4 h-4 text-primary" />
          <span className="text-[12px] font-bold tracking-[0.15em] text-primary uppercase">
            Kontak
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-[#0f172a] leading-tight mb-6 tracking-tight">
          Hubungi <span className="italic text-primary font-serif">Kami</span>
        </h1>

        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Punya pertanyaan seputar program kami? Jangan ragu untuk menghubungi tim admin. Kami siap membantu memberikan solusi belajar terbaik.
        </p>
      </div>
    </section>
  );
}
