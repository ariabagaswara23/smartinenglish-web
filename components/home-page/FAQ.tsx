"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { MessageCircle } from "lucide-react"

// Menggunakan penamaan 'trigger' dan 'content' sesuai dokumentasimu
const faqItems = [
  {
    value: "item-1",
    trigger: "Apakah anak bisa mengambil lebih dari satu program sekaligus?",
    content:
      "Bisa sekali. Kami menyediakan paket khusus bagi siswa yang ingin mengombinasikan beberapa program sekaligus, misalnya kelas Matematika bersamaan dengan kelas Bahasa Inggris atau Komputer.",
  },
  {
    value: "item-2",
    trigger: "Bagaimana sistem menentukan jadwal belajarnya?",
    content:
      "Jadwal belajar di lembaga kami sangat fleksibel. Orang tua bisa berdiskusi dengan tim admin kami saat pendaftaran untuk menyesuaikan hari dan jam luang anak agar tidak bentrok dengan sekolah formal.",
  },
  {
    value: "item-3",
    trigger: "Untuk kelas Komputer, apakah harus membawa perangkat sendiri?",
    content:
      "Kami sudah menyediakan fasilitas komputer/laptop lengkap di dalam kelas yang siap digunakan. Namun, jika siswa ingin membawa laptop pribadi agar lebih nyaman menyimpan hasil tugasnya, sangat diperbolehkan.",
  },
  {
    value: "item-4",
    trigger: "Berapa usia minimal untuk kelas Calistung dan Mengaji?",
    content:
      "Untuk kelas Calistung dan Mengaji, kami menerima siswa mulai dari usia 4 tahun (jenjang PAUD/TK) dengan metode pendekatan belajar sambil bermain yang ramah anak.",
  },
]

export default function FAQ() {
  return (
    <section className="py-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Layout 2 Kolom (Asimetris) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Kolom Kiri: Header & CTA WhatsApp */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-blue-100 bg-blue-50/50 mb-5">
              <span className="text-[11px] font-bold tracking-[0.15em] text-blue-700 uppercase">
                FAQ
              </span>
            </div>
            <h2 className="text-4xl font-bold text-[#0f172a] leading-[1.1] tracking-tight mb-4">
              Punya Pertanyaan<br />
              <span className="italic text-primary font-serif">Seputar Kursus?</span>
            </h2>
            <p className="text-gray-500 text-sm md:text-base mb-6">
              Berikut adalah beberapa pertanyaan yang paling sering diajukan oleh para orang tua.
            </p>

            <a
              href="https://wa.me/your-number"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1e40af] hover:bg-[#25D366] text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              Tanya Admin via WhatsApp
            </a>
          </div>

          {/* Kolom Kanan: Accordion Sesuai Dokumentasimu */}
          <div className="lg:col-span-8 bg-white border border-gray-100 p-6 md:p-8 rounded-2xl shadow-sm">
            <Accordion defaultValue={["item-1"]} className="w-full space-y-2">
              {faqItems.map((item) => (
                <AccordionItem key={item.value} value={item.value} className="border-b border-gray-100 pb-2">
                  <AccordionTrigger className="text-left font-semibold text-[#0f172a] text-sm md:text-base hover:text-blue-700 hover:no-underline transition-colors py-4">
                    {item.trigger}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-500 text-sm leading-relaxed pt-1 pb-4">
                    {item.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

        </div>
      </div>
    </section>
  )
}