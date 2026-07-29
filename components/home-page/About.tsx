import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function About() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:flex lg:items-center lg:gap-16">
          
          {/* Left Content */}
          <div className="lg:w-[50%] flex flex-col items-start mb-16 lg:mb-0">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-blue-100 bg-blue-50/50 mb-6">
              <span className="text-[12px] font-bold tracking-[0.15em] text-primary uppercase">
                Tentang Kami
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-primary leading-[1.15] mb-6 tracking-tight">
              Lebih Dari Sekadar<br />
              <span className="italic text-primary font-serif pr-2">Tempat Kursus.</span>
            </h2>
            
            <p className="text-lg text-gray-500 mb-10 leading-relaxed max-w-[540px]">
              Didirikan sejak tahun 2007 oleh <span className='font-bold text-primary'>Mrs. Nurhasanah, S.Pd</span>, SMART IN ENGLISH didirikan dengan maksud untuk membantu warga sekitar dan para siswa sekolah dalam mempelajari Bahasa Inggris. Seiring dengan berjalannya waktu, SMART IN ENGLISH berkembang dan mulai membuka beberapa program lain seperti Calistung, Bimbel, Komputer dan Mengaji. Saat ini SMART IN ENGLISH sudah menjadi lembaga yang <span className='font-bold text-primary'>Terakreditasi B</span>.
            </p>
            
            <Link 
              href="/about" 
              className="inline-flex justify-center items-center px-8 py-3.5 rounded-full bg-[#2546a1] text-white font-bold hover:bg-[#1a347d] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm md:text-base group"
            >
              Lihat Selengkapnya
              <svg 
                className="w-5 h-5 ml-2.5 transform group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
          
          {/* Right Image */}
          <div className="lg:w-[50%] relative flex justify-center lg:justify-end">
            {/* Move aspect-ratio classes to this wrapper div */}
            <div className="relative w-full max-w-[500px] lg:max-w-full aspect-[4/3] sm:aspect-[4/3] lg:aspect-[5/4] rounded-3xl overflow-hidden shadow-2xl group border-4 border-white">
              {/* Overlay for premium feel */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500 z-10 pointer-events-none"></div>

              <Image
                src="/hero.jpg"
                alt="Gedung Lembaga smArt in english"
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
                className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
              />
            </div>

            {/* Decorative background blurs */}
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#facc15] rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse"></div>
            <div
              className="absolute -top-8 -right-8 w-40 h-40 bg-[#3b82f6] rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"
              style={{ animationDelay: '2s' }}
            ></div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
