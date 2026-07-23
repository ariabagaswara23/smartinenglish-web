import React from "react";
import { MapPin, MessageCircle, Clock, ExternalLink, Phone } from "lucide-react";
import { InstagramIcon } from "../svg/InstagramIcon";

export default function ContactInfo() {
  return (
    <div className="flex flex-col space-y-8 lg:pr-8">
      
      {/* Alamat */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-start gap-4 transition-all hover:shadow-md">
        <div className="bg-blue-50 p-4 rounded-full shrink-0">
          <MapPin className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#0f172a] mb-2">Lokasi Kami</h3>
          <p className="text-gray-500 mb-4 leading-relaxed">
            Belakang Klinik Budi Luhur, Jl. Kerkof Gg. Dwikarya No.56, Leuwigajah, Kec. Cimahi Sel., Kota Cimahi, Jawa Barat 40532
          </p>
          <a
            href="https://maps.app.goo.gl/eAWpj5QHjysunL5C9"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-semibold text-primary hover:text-blue-800 transition-colors"
          >
            Buka di Google Maps
            <ExternalLink className="w-4 h-4 ml-1.5" />
          </a>
        </div>
      </div>

      {/* WhatsApp */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-start gap-4 transition-all hover:shadow-md">
        <div className="bg-green-50 p-4 rounded-full shrink-0">
          <MessageCircle className="w-6 h-6 text-[#25D366]" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#0f172a] mb-2">Hubungi via WhatsApp</h3>
          <p className="text-gray-500 mb-5 leading-relaxed">
            Kami siap menjawab pertanyaan Anda seputar program, biaya, dan pendaftaran.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://wa.me/6282129183000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold px-5 py-2.5 rounded-full transition-all shadow-sm hover:shadow-md text-sm"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat via WhatsApp
            </a>
            <a
              href="tel:+6282129183000"
              className="inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-5 py-2.5 rounded-full transition-all text-sm"
            >
              <Phone className="w-4 h-4 mr-2" />
              Telepon
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Jam Operasional */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <div className="bg-amber-50 p-4 rounded-full inline-block mb-4">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="text-xl font-bold text-[#0f172a] mb-3">Jam Operasional</h3>
          <ul className="space-y-0.5 text-gray-500 text-sm">
            <li className="flex justify-between border-b border-gray-50 pb-2">
              <span>Senin - Jumat</span>
              <span className="font-medium text-gray-700">12:00 - 18:00</span>
            </li>
            <li className="flex justify-between border-b border-gray-50 pb-2 pt-1">
              <span>Sabtu</span>
              <span className="font-medium text-gray-700">09:00 - 18:00</span>
            </li>
            <li className="flex justify-between pt-1">
              <span>Minggu</span>
              <span className="font-medium text-red-500">Tutup</span>
            </li>
          </ul>
        </div>

        {/* Media Sosial */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md flex flex-col">
          <div className="bg-pink-50 p-4 rounded-full inline-block mb-4 w-fit">
            <InstagramIcon className="w-6 h-6 text-pink-600" />
          </div>
          <h3 className="text-xl font-bold text-[#0f172a] mb-2">Media Sosial</h3>
          <p className="text-gray-500 text-sm mb-4 flex-1">
            Ikuti keseruan dan update kegiatan terbaru kami.
          </p>
          <a
            href="https://instagram.com/smile_smartinenglish"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-semibold text-pink-600 hover:text-pink-700 transition-colors mt-auto mb-2"
          >
            @smile_smartinenglish (Instagram)
            <ExternalLink className="w-4 h-4 ml-1.5" />
          </a>
          <a
            href="https://www.tiktok.com/@smile_smartinenglish"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-semibold text-[#040404] hover:text-[#fe2858] transition-colors mt-auto"
          >
            @smile_smartinenglish (TikTok)
            <ExternalLink className="w-4 h-4 ml-1.5" />
          </a>
        </div>
      </div>

    </div>
  );
}
