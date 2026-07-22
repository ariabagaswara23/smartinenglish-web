import React from "react";
import ContactHeader from "@/components/contact/ContactHeader";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactMap from "@/components/contact/ContactMap";
import WhatsAppCTA from "@/components/home-page/WhatsAppCTA";

export const metadata = {
  title: "Hubungi Kami | smArt in english",
  description: "Punya pertanyaan seputar program kami? Jangan ragu untuk menghubungi tim admin smArt in english. Kami siap membantu memberikan solusi belajar terbaik.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header Section */}
      <ContactHeader />

      {/* Main Content Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 
            Split-Screen Layout
            1 Column on mobile/tablet (lg:grid-cols-1)
            2 Columns on desktop (lg:grid-cols-2)
          */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-0 items-stretch">
            
            {/* Kiri: Informasi Kontak */}
            <div className="flex flex-col w-full h-full">
              <ContactInfo />
            </div>

            {/* Kanan: Google Maps */}
            <div className="flex flex-col w-full h-full lg:pl-8">
              <ContactMap />
            </div>

          </div>
        </div>
      </section>

      {/* Tambahan: CTA WhatsApp di bawah */}
      <WhatsAppCTA />
    </main>
  );
}
