import React from 'react';
import Image from 'next/image';

export default function HeroImageCollage() {
  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[480px] md:max-w-[560px] lg:max-w-[600px] mx-auto pt-8 md:pt-10 px-4 sm:px-0">
      {/* Container aspect ratio for the main image (Landscape 4:3) */}
      <div className="relative w-full aspect-[4/3] mx-auto z-10">
        
        {/* Main Image (Besar - Landscape) */}
        <div className="relative w-full h-full rounded-2xl md:rounded-3xl shadow-xl border-4 border-white overflow-hidden bg-gray-200">
          <Image
            src="/images/hero-image.jpg"
            alt="Suasana kelas mengajar"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            className="object-cover hover:scale-105 transition-transform duration-700"
            priority
            quality={80}
          />
          {/* Overlay shadow inside the card */}
          <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] rounded-[28px] pointer-events-none"></div>
        </div>

        {/* Secondary Image (Polaroid - Kiri Bawah) */}
        {/* Lebar sekitar 35-40% dari kontainer utama */}
        <div className="absolute -bottom-6 -left-4 sm:-bottom-10 sm:-left-8 w-[40%] sm:w-[35%] aspect-[4/5] rounded-xl sm:rounded-2xl border-[4px] sm:border-[6px] border-white shadow-2xl overflow-hidden -rotate-3 z-20 hover:-rotate-1 hover:scale-105 transition-all duration-300 bg-white">
          <Image
            src="/images/hero-image-2.jpg"
            alt="Murid interaktif"
            fill
            sizes="(max-width: 768px) 30vw, 20vw"
            className="object-cover"
            quality={80}
          />
        </div>

        {/* Floating Trust Badge (Kanan Atas) */}
        <div className="absolute -top-4 -right-2 sm:-top-6 sm:-right-6 z-30">
          <div className="bg-white/90 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-3 rounded-xl shadow-lg border border-slate-100 flex items-center gap-2 sm:gap-3 hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-yellow-100 text-yellow-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">4.9/5 Rating</p>
              <p className="text-[9px] sm:text-[10px] text-gray-500 font-medium">Orang Tua Murid</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
