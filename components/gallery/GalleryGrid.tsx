"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { galleryItems, galleryCategories, GalleryCategory } from "@/lib/data/galleryData";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

export default function GalleryGrid() {
  const [activeFilter, setActiveFilter] = useState<GalleryCategory>("Semua");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Filter items based on active category
  const filteredItems =
    activeFilter === "Semua"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter);

  // Lightbox Handlers
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    // eslint-disable-next-line react-hooks/immutability
    document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
  };

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    document.body.style.overflow = "auto";
  }, []);

  const nextLightboxImage = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev! + 1) % filteredItems.length);
    }
  }, [lightboxIndex, filteredItems.length]);

  const prevLightboxImage = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) =>
        prev === 0 ? filteredItems.length - 1 : prev! - 1
      );
    }
  }, [lightboxIndex, filteredItems.length]);

  // Handle keyboard events for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextLightboxImage();
      if (e.key === "ArrowLeft") prevLightboxImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, closeLightbox, nextLightboxImage, prevLightboxImage]);

  return (
    <section className="py-16 md:py-24 bg-[#fafafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
          {galleryCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeFilter === category
                  ? "bg-primary text-white shadow-md transform scale-105"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-primary hover:border-blue-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden aspect-square bg-gray-200 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
              onClick={() => openLightbox(index)}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/60 transition-colors duration-500 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 p-4 text-center">
                <ZoomIn className="w-10 h-10 text-white mb-3 transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-500" />
                <span className="text-white font-bold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  {item.caption}
                </span>
                <span className="text-blue-100 text-sm mt-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (if needed in future, though dummy data always has something) */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Tidak ada foto untuk kategori ini.</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          {/* Navigation Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); prevLightboxImage(); }}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 p-3 md:p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6 md:w-10 md:h-10" />
          </button>

          {/* Navigation Next */}
          <button
            onClick={(e) => { e.stopPropagation(); nextLightboxImage(); }}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 p-3 md:p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6 md:w-10 md:h-10" />
          </button>

          {/* Main Image Container */}
          <div 
            className="relative w-full max-w-6xl h-full max-h-[85vh] px-4 md:px-20 flex flex-col items-center justify-center"
            onClick={closeLightbox} // Click outside to close
          >
            <div 
              className="relative w-full h-full cursor-auto"
              onClick={(e) => e.stopPropagation()} // Prevent close when clicking image
            >
              <Image
                src={filteredItems[lightboxIndex].src}
                alt={filteredItems[lightboxIndex].alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
            
            {/* Caption in Lightbox */}
            <div className="absolute bottom-4 left-0 w-full text-center pointer-events-none px-4">
              <p className="text-white text-lg md:text-xl font-bold bg-black/50 inline-block px-6 py-2 rounded-full backdrop-blur-md">
                {filteredItems[lightboxIndex].caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
