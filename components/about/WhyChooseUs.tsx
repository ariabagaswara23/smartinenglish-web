import { BookOpen, Users, Award, Lightbulb } from "lucide-react";

export default function WhyChooseUs() {
  const reasons = [
    {
      title: "Metode Pembelajaran Interaktif",
      description: "Kami menerapkan metode yang mendorong siswa aktif berbicara dan berpartisipasi di kelas, bukan sekadar menghafal.",
      icon: <Lightbulb className="w-8 h-8 text-blue-600" />,
      bgColor: "bg-blue-50",
    },
    {
      title: "Pengajar Profesional",
      description: "Dibimbing oleh instruktur berpengalaman, bersertifikat, dan dedikatif yang siap membantu Anda menguasai bahasa Inggris.",
      icon: <Users className="w-8 h-8 text-yellow-600" />,
      bgColor: "bg-yellow-50",
    },
    {
      title: "Kurikulum Terstruktur",
      description: "Materi disusun sistematis sesuai dengan standar internasional, menyesuaikan dengan tingkat kemampuan peserta.",
      icon: <BookOpen className="w-8 h-8 text-green-600" />,
      bgColor: "bg-green-50",
    },
    {
      title: "Lulusan Berkualitas",
      description: "Ratusan alumni kami telah berhasil meraih skor tes memuaskan dan sukses dalam karier atau pendidikan lanjutan.",
      icon: <Award className="w-8 h-8 text-purple-600" />,
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
