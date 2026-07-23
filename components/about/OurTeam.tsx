import Image from "next/image";

export default function OurTeam() {
  const team = [
    {
      name: "Budi Santoso",
      role: "Lead Instructor / TOEFL Specialist",
      description: "Memiliki pengalaman lebih dari 10 tahun mengajar TOEFL dan IELTS dengan sertifikasi CELTA.",
      imageUrl: "/images/team-1.jpg", // placeholder
    },
    {
      name: "Sarah Wijaya",
      role: "Senior Instructor / Speaking & Conversation",
      description: "Ahli dalam melatih kepercayaan diri siswa saat berbicara bahasa Inggris di depan umum.",
      imageUrl: "/images/team-2.jpg", // placeholder
    },
    {
      name: "David Kurniawan",
      role: "Instructor / English for Kids",
      description: "Pakar pendidikan anak usia dini dengan metode mengajar yang sangat menyenangkan.",
      imageUrl: "/images/team-3.jpg", // placeholder
    },
    {
      name: "Anita Putri",
      role: "Instructor / Business English",
      description: "Mantan praktisi multinasional yang fokus pada komunikasi bisnis dan presentasi.",
      imageUrl: "/images/team-4.jpg", // placeholder
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center space-x-2 px-4 py-1.5 rounded-full border border-blue-100 bg-blue-50/50 mb-6 shadow-sm">
            <span className="text-[12px] font-bold tracking-[0.15em] text-primary uppercase">
              Instruktur
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0f172a] leading-tight mb-6 tracking-tight">
            Tim <span className="italic text-primary font-serif">Pengajar</span> Kami
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
            Belajar langsung dari para ahli yang berdedikasi tinggi untuk kesuksesan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div 
              key={index}
              className="bg-slate-50 rounded-3xl overflow-hidden group hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-square w-full bg-slate-200 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium text-sm">
                  Foto {member.name}
                </div>
                {/* <Image 
                  src={member.imageUrl}
                  alt={`Foto ${member.name}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                /> */}
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium text-sm mb-4">{member.role}</p>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {member.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
