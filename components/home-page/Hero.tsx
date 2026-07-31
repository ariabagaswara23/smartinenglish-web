import React from 'react';
import Link from 'next/link';
import TextType from '../ui/TextType';
import Image from 'next/image';
import HeroImageCollage from './HeroImageCollage';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#fafafc]">
      {/* Background building image */}
      <div className="absolute inset-0 z-0">
        <Image
        src="/images/background-hero.jpg" // Next.js akan auto-convert ke AVIF/WebP di server/edge
        alt="Background Hero"
        fill
        priority // Wajib untuk Hero agar LCP cepat!
        sizes="100vw"
        className="object-cover -z-10"
        quality={80} // Quality 75-80 sudah sangat tajam namun hemat ukuran
      />
      </div>
      {/* Gradient overlay to ensure text is readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#fafafc]/95 via-[#fafafc]/80 to-transparent z-0 md:block hidden"></div>
      <div className="absolute inset-0 bg-[#fafafc]/90 z-0 md:hidden block"></div>

      {/* Background pattern (dots) */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.25]" 
        style={{
          backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="pt-24 pb-24 md:pt-32 md:pb-24 md:h-[100vh] lg:flex lg:items-center lg:gap-12">
          
          {/* Left Content */}
          <div className="lg:w-[55%] flex flex-col items-start text-left">
            
            <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-bold text-[#0f172a] leading-[1.1] mb-6 tracking-tight">
              Tempat Belajar <br />
              <span className="inline-block text-primary italic font-serif">
                  <TextType
                    text={[
                    'Bahasa Inggris',
                    'Matematika',
                    'Calistung',
                    'Mengaji',
                    'Komputer'
                    ]}
                    typingSpeed={75}
                    pauseDuration={1500}
                    showCursor
                    cursorCharacter="●"
                    deletingSpeed={50}
  cursorBlinkDuration={0.5}
                  />
              </span> <br /> yang
              <span className="italic text-primary font-serif pr-2"> Asyik.</span>
            </h1>
            
            {/* Subheading */}
            <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-[500px] leading-relaxed">
              Bimbingan belajar yang efektif dan menyenangkan untuk jenjang SD, SMP, SMA, dan Mahasiswa.
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {/* <Link 
                href="/daftar" 
                className="inline-flex justify-center items-center px-8 py-3.5 rounded-full bg-[#2546a1] text-white font-bold hover:bg-[#1a347d] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm md:text-base"
              >
                Daftar Kelas Sekarang
              </Link> */}
              <a 
                href="https://wa.me/6282129183000" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex justify-center items-center px-8 py-3.5 rounded-full bg-[#2546a1] text-white font-bold hover:bg-[#1a347d] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm md:text-base"
              >
                Daftar Kelas Sekarang
              </a>
              <Link 
                href="/#program" 
                className="inline-flex justify-center items-center px-8 py-3.5 rounded-full border border-[#2546a1]/30 bg-transparent text-[#2546a1] font-bold hover:bg-[#2546a1]/5 transition-all text-sm md:text-base"
              >
                Lihat Program
              </Link>
            </div>
          </div>
          
          {/* Right Image/Graphic Area */}
          <div className="lg:w-[45%] mt-20 lg:mt-0 relative flex justify-center lg:justify-end">
            <HeroImageCollage />
          </div>
          
        </div>
      </div>
      
      {/* Divider line at bottom */}
      <div className="absolute bottom-0 left-0 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-1/2 border-b border-gray-200"></div>
      </div>
    </section>
  );
}
