import { Users, Award, Lightbulb, GraduationCap } from "lucide-react";
import Image from "next/image";

export default function WhyChooseUs() {
  const reasons = [
  {
    title: "Metode Interaktif & Menyenangkan",
    description: "Pembelajaran dirancang aktif, menyenangkan, dan aplikatif — mendorong siswa paham konsep, bukan sekadar menghafal.",
    icon: <Lightbulb className="w-8 h-8 text-blue-600" />,
    bgColor: "bg-blue-50",
  },
  {
    title: "Pengajar Berpengalaman",
    description: "Dibimbing oleh instruktur yang dedikatif, sabar, dan ramah anak, siap mendampingi setiap jenjang sesuai kebutuhan.",
    icon: <Users className="w-8 h-8 text-amber-600" />,
    bgColor: "bg-amber-50",
  },
  {
    title: "Terakreditasi B Resmi",
    description: "Lembaga teruji dengan materi dan kurikulum terstruktur yang disesuaikan dengan perkembangan dan standar pendidikan.",
    icon: <GraduationCap className="w-8 h-8 text-emerald-600" />,
    bgColor: "bg-emerald-50",
  },
  {
    title: "Terbukti & Terpercaya",
    description: "Telah mendampingi ribuan alumni sejak 2007 untuk meraih kemajuan akademik, kelulusan ujian, hingga kesiapan karier.",
    icon: <Award className="w-8 h-8 text-purple-600" />,
    bgColor: "bg-purple-50",
  },
];

  return (
    <section className="py-20 lg:py-28 bg-[#fafafc] relative overflow-hidden">
      {/* Dot grid pattern background */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.25]" 
        style={{
          backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-100/30 rounded-full blur-3xl pointer-events-none z-0" />

      {/* 1. Left Flank Accent: Full Height with Smooth Fade into Center */}
      <div 
        className="absolute inset-y-0 left-0 w-full sm:w-2/3 lg:w-1/2 h-full opacity-25 pointer-events-none z-0 select-none"
        style={{
          maskImage: 'radial-gradient(ellipse 90% 80% at 0% 50%, #000 30%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 0% 50%, #000 30%, transparent 85%)'
        }}
      >
        <Image
          src="/bg/visionmission-bg.svg"
          alt="Why Choose Us Pattern Left Accent"
          fill
          className="object-cover object-left"
          priority={false}
        />
      </div>

      {/* 2. Right Flank Accent: Full Height (Mirrored Horizontally & Vertically) with Smooth Fade into Center */}
      <div 
        className="absolute inset-y-0 right-0 w-full sm:w-2/3 lg:w-1/2 h-full opacity-20 pointer-events-none z-0 select-none"
        style={{
          maskImage: 'radial-gradient(ellipse 90% 80% at 100% 50%, #000 30%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 100% 50%, #000 30%, transparent 85%)'
        }}
      >
        <Image
          src="/bg/visionmission-bg.svg"
          alt="Why Choose Us Pattern Right Accent"
          fill
          className="object-cover object-right scale-x-[-1] scale-y-[-1]"
          priority={false}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center space-x-2 px-4 py-1.5 rounded-full border border-blue-100 bg-blue-50/50 mb-6 shadow-sm">
            <span className="text-[12px] font-bold tracking-[0.15em] text-primary uppercase">
              Keunggulan
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0f172a] leading-tight mb-6 tracking-tight">
            Mengapa Memilih <span className="italic text-primary font-serif">Kami?</span>
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
            Kami menawarkan lebih dari sekadar kursus bahasa Inggris. Kami memberikan pengalaman belajar yang memberdayakan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => (
            <div 
              key={index} 
              className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300 border border-slate-100 group"
            >
              <div className={`w-16 h-16 rounded-2xl ${reason.bgColor} flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300`}>
                {reason.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{reason.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
