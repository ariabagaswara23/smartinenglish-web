import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function EventHighlightSection() {
  return (
    <section className="py-20 md:py-28 bg-[#fafafc] relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-blue-50/80 rounded-full blur-[100px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-40 right-0 w-[400px] h-[400px] bg-amber-50/80 rounded-full blur-[100px] opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-blue-100 bg-blue-50/50 mb-5">
            <span className="text-[11px] font-bold tracking-[0.15em] text-blue-700 uppercase">
              Kegiatan Eksternal
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0f172a] leading-[1.1] tracking-tight">
            Aktivitas & Event<br />
            <span className="italic text-primary font-serif">Lembaga.</span>
          </h2>
          <p className="mt-5 text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
            Selain fokus pada pembelajaran, kami aktif bergerak dalam berbagai kegiatan eksternal untuk membangun dampak dan relasi yang luas.
          </p>
        </div>

        {/* Events List */}
        <div className="space-y-20 md:space-y-28">
          
          {/* --- EVENT 1 (Gambar Kiri, Teks Kanan) --- */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16">
            {/* Kolom Gambar */}
            <div className="w-full md:w-1/2">
              <div className="relative aspect-video w-full rounded-3xl overflow-hidden shadow-2xl group border-4 border-white">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500 z-10 pointer-events-none" />
                <Image
                  src="https://images.unsplash.com/photo-1559027615-cd246c2904ca?q=80&w=600&auto=format&fit=crop"
                  alt="Kegiatan bakti sosial lembaga"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                  priority
                />
              </div>
            </div>

            {/* Kolom Teks */}
            <div className="w-full md:w-1/2 space-y-5">
              <h3 className="text-3xl md:text-4xl font-bold text-primary italic font-serif leading-tight tracking-tight">
                SMILE FEST
              </h3>
              <p className="text-gray-500 text-base leading-relaxed">
                Smile Fest adalah event tahunan yang diselenggarakan untuk mewadahi minat dan bakat peserta didik, baik dalam Bahasa Inggris seperti speech contest, story telling, maupun hal hal lain seperti musik, bela diri, pantomim dan kesenian daerah. Dalam acara ini juga Smart in English memberikan award kepada peserta didik dan instruktur yang berprestasi. Di event ini juga, Smile memberikan banyak hadiah atau benefit yang menarik bagi peserta didik maupun bagi yang belum bergabung bersama Smile.
              </p>
              <div className="pt-3">
                <Link 
                  href="/events/aksi-sosial-2026"
                  className="inline-flex justify-center items-center px-6 py-2.5 rounded-full border border-gray-200 bg-white text-gray-700 font-bold hover:bg-gray-50 hover:text-primary transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 text-sm group"
                >
                  Lihat Dokumentasi
                  <svg className="w-4 h-4 ml-2 transform transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* --- EVENT 2 (Gambar Kanan, Teks Kiri) --- */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12 lg:gap-16">
            {/* Kolom Gambar */}
            <div className="w-full md:w-1/2">
              <div className="relative aspect-video w-full rounded-3xl overflow-hidden shadow-2xl group border-4 border-white">
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/30 to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500 z-10 pointer-events-none" />
                <Image
                  src="https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop"
                  alt="Suasana pameran karya inovasi"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                />
              </div>
            </div>

            {/* Kolom Teks */}
            <div className="w-full md:w-1/2 space-y-5">
              <h3 className="text-3xl md:text-4xl font-bold text-primary italic font-serif leading-tight tracking-tight">
                SMILEVERSARY
              </h3>
              <p className="text-gray-500 text-base leading-relaxed">
                Smileversary adalah acara tahunan khusus yang diselenggarakan dalam rangka memperingati hari jadi Smart in English. Di tiap tahunnya, Smileversary mengadakan kursus bahasa Inggris gratis bagi masyarakat umum yang kurang mampu. Selain kursus bahasa Inggris gratis, Smile juga mengadakan promo, dan berbagai hadiah menarik.
              </p>
              <div className="pt-3">
                <Link 
                  href="/events/pameran-karya-kreatif"
                  className="inline-flex justify-center items-center px-6 py-2.5 rounded-full border border-gray-200 bg-white text-gray-700 font-bold hover:bg-gray-50 hover:text-emerald-600 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 text-sm group"
                >
                  Lihat Dokumentasi
                  <svg className="w-4 h-4 ml-2 transform transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* --- EVENT 3 (Gambar Kiri, Teks Kanan) --- */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16">
            {/* Kolom Gambar */}
            <div className="w-full md:w-1/2">
              <div className="relative aspect-video w-full rounded-3xl overflow-hidden shadow-2xl group border-4 border-white">
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500 z-10 pointer-events-none" />
                <Image
                  src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=600&auto=format&fit=crop"
                  alt="Seminar internasional stadium generale"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                />
              </div>
            </div>

            {/* Kolom Teks */}
            <div className="w-full md:w-1/2 space-y-5">
              <h3 className="text-3xl md:text-4xl font-bold text-primary italic font-serif leading-tight tracking-tight">
                HOLIDAY AT SMILE
              </h3>
              <p className="text-gray-500 text-base leading-relaxed">
                Holiday at Smile dalah program yang dilaksanakan saat liburan semester. Pembelajaran ini khusus untuk kelas Bahasa Inggris, yang meliputi kelas vocab, grammar, dan speaking.
              </p>
              <div className="pt-3">
                <Link 
                  href="/events/studium-generale-global"
                  className="inline-flex justify-center items-center px-6 py-2.5 rounded-full border border-gray-200 bg-white text-gray-700 font-bold hover:bg-gray-50 hover:text-purple-600 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 text-sm group"
                >
                  Lihat Dokumentasi
                  <svg className="w-4 h-4 ml-2 transform transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}