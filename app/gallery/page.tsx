import React from "react";
import GalleryHero from "@/components/gallery/GalleryHero";
import FeaturedSlider from "@/components/gallery/FeaturedSlider";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import WhatsAppCTA from "@/components/home-page/WhatsAppCTA";

export const metadata = {
  title: "Galeri & Momen Kegiatan | SMART in ENGLISH",
  description: "Lihat keseruan belajar, berbagai event menarik, dan fasilitas yang kami sediakan untuk mendukung proses belajar peserta didik di SMART in ENGLISH.",
};

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-white">
      <GalleryHero />
      <FeaturedSlider />
      <GalleryGrid />
      <WhatsAppCTA />
    </main>
  );
}
