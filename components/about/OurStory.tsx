import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export default function OurStory() {
  const milestones = [
    "Berdiri sejak tahun 2018",
    "Kurikulum berstandar internasional",
    "Fasilitas belajar yang modern dan nyaman",
  ];

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Column */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/5] bg-slate-200 flex items-center justify-center">
              <span className="text-slate-400 font-medium text-center px-4">Gambar Perjalanan/Gedung Institusi (800x1000)</span>
              {/* <Image 
                src="/images/our-story.jpg" 
                alt="Perjalanan Smart In English" 
                fill 
                className="object-cover"
              /> */}
            </div>
            
            {/* Decoration Elements */}
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-yellow-400 rounded-3xl -z-10" />
            <div className="absolute -top-8 -left-8 w-40 h-40 bg-blue-600 rounded-full -z-10 opacity-10" />
            
            <div className="absolute bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hidden md:block">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <span className="text-2xl font-bold text-blue-600">5+</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Tahun</p>
                  <p className="text-xs text-slate-500">Pengalaman Mengajar</p>
                </div>
              </div>
            </div>
          </div>

          {/* Text Column */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-blue-100 bg-blue-50/50 mb-5">
              <span className="text-[11px] font-bold tracking-[0.15em] text-blue-700 uppercase">
                Perjalanan Kami
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0f172a] leading-[1.1] tracking-tight mb-6">
              Cerita Kami:<br />
              <span className="italic text-primary font-serif">Dedikasi untuk Pendidikan</span>
            </h2>
            <div className="space-y-6 text-gray-500 text-lg leading-relaxed mb-8">
              <p>
                Berawal dari semangat untuk menjembatani kesenjangan kemampuan berbahasa Inggris di masyarakat, kami mendirikan lembaga ini dengan satu tujuan sederhana: membuat belajar bahasa Inggris menjadi mudah, menyenangkan, dan aplikatif.
              </p>
              <p>
                Selama lebih dari 5 tahun, kami telah bertransformasi menjadi pusat pembelajaran bahasa yang dipercaya oleh ratusan siswa, mulai dari anak-anak hingga profesional, yang ingin meraih mimpi mereka di kancah global.
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              {milestones.map((item, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-green-500 mr-3 shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
