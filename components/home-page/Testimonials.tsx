"use client";

import { Quote, Star } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay"

const testimonials = [
  {
    name: "Bunda Rahma",
    role: "Orang Tua dari Hafizh",
    program: "Kelas Calistung",
    content: "Anak saya sekarang jauh lebih lancar membaca sebelum masuk SD. Metode belajarnya seru dan tidak bikin anak stres!",
    rating: 5,
  },
  {
    name: "Ahmad Fauzi",
    role: "Pelajar SMA",
    program: "Bahasa Inggris",
    content: "Membantu banget buat naikin skor TOEFL saya. Tutornya asyik diajak diskusi dan penjelasannya gampang dipahami.",
    rating: 5,
  },
  {
    name: "Mama Citra",
    role: "Orang Tua dari Keisha",
    program: "Matematika",
    content: "Dulu Keisha paling malas kalau disuruh belajar Matematika. Sejak ikut kursus di sini, nilainya naik drastis dan jadi rajin hitung!",
    rating: 5,
  },
  {
    name: "Ayah Dedi",
    role: "Orang Tua dari Zayan",
    program: "Kelas Komputer",
    content: "Zayan sekarang paham dasar coding block dan gak cuma main game aja. Investasi gadget jadi terasa bermanfaat.",
    rating: 5,
  },
  {
    name: "Bunda Sarah",
    role: "Orang Tua dari Aisyah",
    program: "Kelas Mengaji",
    content: "Progres tajwid dan hafalan surat pendeknya cepat sekali. Gurunya sangat sabar membimbing anak-anak aktif.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-blue-100 bg-blue-50/50 mb-5">
                <span className="text-[11px] font-bold tracking-[0.15em] text-blue-700 uppercase">
                Testimoni
                </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary leading-[1.1] tracking-tight">
                Apa Kata<br />
                <span className="italic text-primary font-serif">Mereka?</span>
            </h2>
        </div>
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    plugins={[Autoplay({
                        delay: 5000,
                    })]}
                    className="w-full px-4"
                >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {testimonials.map((item, index) => (
                        <CarouselItem 
                            key={index} 
                            // Responsivitas: mobile = 1 card, tablet = 2 cards, desktop = 3 cards
                            className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                        >
                            <div className="p-2 h-full">
                                <Card className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col justify-between overflow-hidden relative">
                                    
                                    {/* Ikon Kutipan Dekoratif */}
                                    <Quote className="absolute right-4 top-4 text-gray-100 w-12 h-12 -z-0 pointer-events-none" />

                                    <CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
                      
                                    {/* Bagian Atas: Rating & Konten */}
                                    <div>
                                        {/* Bintang */}
                                        <div className="flex items-center gap-0.5 mb-4">
                                            {Array.from({ length: item.rating }).map((_, i) => (
                                                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                            ))}
                                        </div>

                                        {/* Teks Testi */}
                                        <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">
                                            &quot;{item.content}&quot;
                                        </p>
                                    </div>

                                    {/* Bagian Bawah: Profil & Badge Kategori */}
                                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-3">
                                          {/* Avatar Placeholder Bulat */}
                                          <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1e40af] font-bold text-sm flex items-center justify-center shrink-0">
                                            {item.name.charAt(0)}
                                          </div>
                                          <div>
                                            <h4 className="text-sm font-semibold text-gray-900">{item.name}</h4>
                                            <p className="text-xs text-gray-400">{item.role}</p>
                                          </div>
                                        </div>

                                        {/* Badge Dinamis Multi-program */}
                                        <span className="text-[10px] font-bold bg-blue-50 text-[#1e40af] px-2.5 py-1 rounded-full shrink-0">
                                          {item.program}
                                        </span>
                                    </div>

                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                        ))}
                    </CarouselContent>
          
          {/* Navigasi Arrows */}
          <CarouselPrevious className="-left-4 hidden md:flex text-[#1e3a8a] border-gray-200 hover:bg-blue-50" />
          <CarouselNext className="-right-4 hidden md:flex text-[#1e3a8a] border-gray-200 hover:bg-blue-50" />
            </Carousel>
        </div>
    </section>
  );
}