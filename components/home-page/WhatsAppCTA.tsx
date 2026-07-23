"use client"

import { MessageCircle, ArrowRight, Sparkles } from "lucide-react"

export default function WhatsAppCTA() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background dengan gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#1e40af]" />

      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-sky-300/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-8">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          <span className="text-[11px] font-bold tracking-[0.18em] text-white/90 uppercase">
            Daftar Sekarang
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl font-bold text-white leading-[1.1] tracking-tight mb-5">
          Siap Mulai Perjalanan{" "}
          <span className="italic font-serif text-yellow-300">
            Belajar Anak?
          </span>
        </h2>

        {/* Sub-text */}
        <p className="text-blue-100/80 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Hubungi admin kami via WhatsApp sekarang juga. Kami siap membantu
          memilihkan program terbaik yang sesuai dengan kebutuhan putra-putri
          Anda.
        </p>

        {/* CTA Button — centered */}
        <div className="flex justify-center">
          <a
            href="https://wa.me/6282129183000"
            target="_blank"
            rel="noopener noreferrer"
            id="cta-whatsapp-button"
            className="group relative inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-base px-8 py-4 rounded-2xl shadow-lg shadow-green-900/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-900/40 active:scale-100"
          >
            {/* Glow effect */}
            <span className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <MessageCircle className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:-rotate-6" />
            <span>Hubungi Admin via WhatsApp</span>
            <ArrowRight className="w-4 h-4 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>

        {/* Trust note */}
        <p className="mt-6 text-blue-200/60 text-xs">
          Gratis konsultasi · Respons cepat · Tanpa biaya tersembunyi
        </p>
      </div>
    </section>
  )
}
