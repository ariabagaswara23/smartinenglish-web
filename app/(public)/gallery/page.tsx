import React from "react";
import GalleryHero from "@/components/gallery/GalleryHero";
import FeaturedSlider from "@/components/gallery/FeaturedSlider";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import WhatsAppCTA from "@/components/home-page/WhatsAppCTA";
import { getFeaturedEvents, getGalleryItems } from "@/app/admin/gallery/actions";

export const metadata = {
  title: "Galeri & Momen Kegiatan | SMART in ENGLISH",
  description: "Lihat keseruan belajar, berbagai event menarik, dan fasilitas yang kami sediakan untuk mendukung proses belajar peserta didik di SMART in ENGLISH.",
};

export default async function GalleryPage() {
  const [featuredEvents, galleryItems] = await Promise.all([
    getFeaturedEvents(),
    getGalleryItems(),
  ]);

  return (
    <main className="min-h-screen bg-white">
      <GalleryHero />
      <FeaturedSlider events={featuredEvents} />
      <GalleryGrid items={galleryItems} />
      <WhatsAppCTA />
    </main>
  );
}
