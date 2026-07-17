import React from 'react';

export default function VisionMission() {
  const cards = [
    {
      title: "Visi",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      description: [
        "Terwujudnya lingkungan pembelajaran yang baik",
        "Terwujudnya lulusan yang unggul dalam keterampilan dan kecakapan hidup.",
        "Terwujudnya pembelajaran yang variatif dan inovatif."
      ],
      bgColor: "bg-[#2546a1]", // brand blue
      accent: "bg-blue-50",
    },
    {
      title: "Misi",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      description: [
        "Meningkatnya lingkungan pembelajaran yang baik",
        "Meningkatnya lulusan yang unggul dalam keterampilan dan kecakapan hidup.",
        "Meningkatnya pembelajaran yang variatifdan inovatif."
      ],
      bgColor: "bg-[#2d436a]", // secondary dark blue
      accent: "bg-slate-100",
    },
    {
      title: "Tujuan",
      icon: (
        <svg className="w-8 h-8 text-[#78350f]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      description: [
        "Lembaga memiliki lingkungan yang kondusif dan aman guna mendukung proses pembelajaran.",
        "Lembaga memiliki peserta didik yang unggul dalam keterampilan dan kecakapan hidup.",
        "Lembaga menerapkan strategi pembelajaran yang vatiatif dan inovatif sehingga terciptanya pembelajaran yang aktif, kreatif, inspiratif dan menyenangkan."
      ],
      bgColor: "bg-[#facc15]", // brand yellow
      accent: "bg-yellow-50",
    }
  ];

  return (
    <section className="py-24 bg-[#fafafc] relative overflow-hidden">
      {/* Background pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.3]" 
        style={{
          backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center space-x-2 px-4 py-1.5 rounded-full border border-gray-200 bg-white shadow-sm mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
            <span className="text-[12px] font-bold tracking-[0.15em] text-primary uppercase">
              Komitmen Kami
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-[#0f172a] leading-tight mb-6 tracking-tight">
            Visi, Misi & <span className="italic text-primary font-serif">Tujuan</span>
          </h2>
          
          <p className="text-lg text-gray-500 leading-relaxed">
            Pondasi utama dalam setiap langkah yang kami ambil untuk memberikan pengalaman belajar bahasa Inggris terbaik bagi Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div 
              key={index}
              className="bg-white rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden"
            >
              {/* Decorative background shape inside card */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${card.accent} rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-110`}></div>
              
              {/* <div className={`w-16 h-16 ${card.bgColor} rounded-2xl flex items-center justify-center shadow-lg mb-8 relative z-10 transform group-hover:-rotate-3 transition-transform duration-500`}>
                {card.icon}
              </div> */}
              
              <h3 className="text-2xl font-bold text-[#0f172a] mb-4 relative z-10">{card.title}</h3>
              
              <div className="text-gray-600 leading-relaxed relative z-10 space-y-3">
                {card.description.map((point, i) => (
                  <div key={i} className="flex items-start">
                    {card.description.length > 1 && (
                      <span className="text-blue-600 mr-2.5 mt-0 font-bold text-lg leading-none">•</span>
                    )}
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
