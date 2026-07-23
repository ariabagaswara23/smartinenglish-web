import Image from "next/image";
import { Info } from "lucide-react";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-[#fafafc] pt-24 pb-16 md:pt-32 md:pb-24 border-b border-gray-100">
      {/* Background pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.2]"
        style={{
          backgroundImage: "radial-gradient(#94a3b8 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center space-x-2 px-4 py-1.5 rounded-full border border-blue-100 bg-blue-50/50 mb-6 shadow-sm">
            <Info className="w-4 h-4 text-primary" />
            <span className="text-[12px] font-bold tracking-[0.15em] text-primary uppercase">
              Tentang Kami
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0f172a] leading-tight mb-6 tracking-tight">
            Membangun Generasi <span className="italic text-primary font-serif">Percaya Diri</span> Berbahasa Inggris
          </h1>
          
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10">
            Kami hadir untuk memberikan pengalaman belajar bahasa Inggris yang interaktif, menyenangkan, dan berorientasi pada masa depan.
          </p>
        </div>

        {/* Hero Image */}
        <div className="mt-12 relative rounded-3xl overflow-hidden shadow-2xl aspect-video max-w-5xl mx-auto border border-gray-100">
          <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
             <span className="text-slate-400 font-medium">Gambar Suasana Belajar / Institusi (1200x675)</span>
          </div>
          {/* Ganti dengan komponen Image sebenarnya saat gambar tersedia */}
          {/* <Image 
            src="/images/about-hero.jpg" 
            alt="Suasana belajar di Smart In English" 
            fill 
            className="object-cover"
            priority
          /> */}
        </div>
      </div>
    </section>
  );
}
