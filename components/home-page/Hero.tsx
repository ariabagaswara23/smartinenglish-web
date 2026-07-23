import React from 'react';
import Link from 'next/link';
import TextType from '../ui/TextType';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#fafafc]">
      {/* Background building image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Background Gedung Lembaga" 
          className="w-full h-full object-cover opacity-45"
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
        <div className="pt-8 pb-24 md:pt-12 md:pb-24 lg:flex lg:items-center lg:gap-12">
          
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
              <Link 
                href="/daftar" 
                className="inline-flex justify-center items-center px-8 py-3.5 rounded-full bg-[#2546a1] text-white font-bold hover:bg-[#1a347d] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm md:text-base"
              >
                Daftar Kelas Sekarang
              </Link>
              <Link 
                href="/program" 
                className="inline-flex justify-center items-center px-8 py-3.5 rounded-full border border-[#2546a1]/30 bg-transparent text-[#2546a1] font-bold hover:bg-[#2546a1]/5 transition-all text-sm md:text-base"
              >
                Lihat Program
              </Link>
            </div>
          </div>
          
          {/* Right Image/Graphic Area */}
          <div className="lg:w-[45%] mt-20 lg:mt-0 relative flex justify-center lg:justify-end">
            {/* Central Graphic Container */}
            <div className="relative w-full max-w-[340px] sm:max-w-[400px] md:max-w-[440px] lg:max-w-[480px] flex justify-center items-center pt-8">
              
              {/* Stacked Cards Effect */}
              <div className="relative w-full aspect-[4/5] sm:aspect-[3/4]">
                {/* Back Card */}
                <div className="absolute inset-0 bg-[#2d436a] rounded-[32px] transform rotate-6 translate-x-4 sm:translate-x-8 shadow-xl overflow-hidden opacity-95">
                   <img 
                     src="https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                     alt="Background Card" 
                     className="w-full h-full object-cover opacity-30 mix-blend-overlay grayscale"
                   />
                </div>
                
                {/* Front Card */}
                <div className="absolute inset-0 bg-gray-200 rounded-[32px] shadow-2xl overflow-hidden transform -rotate-2 z-10 border-4 border-white bg-white">
                  <img 
                    src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Kegiatan Belajar Mengajar"
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay shadow inside the card */}
                  <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] rounded-[28px] pointer-events-none"></div>
                </div>

                {/* Floating Elements */}

                {/* Top Left Badge */}
                <div className="absolute -left-4 sm:-left-12 top-6 sm:top-10 z-20 transform -rotate-3">
                  <div className="bg-[#2546a1] text-white px-5 py-2.5 rounded-full shadow-lg text-[13px] sm:text-sm font-bold flex items-center space-x-1.5 border-[3px] border-[#fafafc]">
                    <span>✦</span>
                    <span>SMART in ENGLISH</span>
                  </div>
                </div>

                {/* Bottom Right Floating Badge */}
                <div className="absolute -bottom-2 -right-2 sm:-right-6 z-20 transform rotate-[4deg]">
                  <div className="bg-[#facc15] text-[#78350f] px-4 sm:px-5 py-2 rounded-full shadow-lg font-bold text-xs sm:text-sm flex items-center space-x-1 border-[3px] border-[#fafafc]">
                    <span>98% Puas</span>
                    <span>⭐</span>
                  </div>
                </div>

              </div>
            </div>
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
