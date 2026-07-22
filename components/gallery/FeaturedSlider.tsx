"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { featuredEvents } from "@/lib/data/galleryData";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FeaturedSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredEvents.length);
    }, 3500); // 3.5 seconds

    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredEvents.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? featuredEvents.length - 1 : prev - 1
    );
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] tracking-tight">
            Event <span className="italic text-primary font-serif">Unggulan</span>
          </h2>
        </div>

        <div className="relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl aspect-video bg-gray-100 group">
          {featuredEvents.map((event, index) => (
            <div
              key={event.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <Image
                src={event.src}
                alt={event.alt}
                fill
                className="object-cover"
                priority={index === 0}
              />
              {/* Gradient Overlay for Text Visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 flex flex-col items-start text-white">
                <span className="bg-primary text-white text-[10px] md:text-xs font-bold px-3 py-1 md:px-4 md:py-1.5 rounded-full uppercase tracking-wider mb-3 shadow-md">
                  {event.badge}
                </span>
                <h3 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 drop-shadow-md">
                  {event.title}
                </h3>
                <p className="text-sm md:text-lg text-gray-200 max-w-2xl drop-shadow-sm line-clamp-2 md:line-clamp-none">
                  {event.description}
                </p>
              </div>
            </div>
          ))}

          {/* Navigation Controls */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-all opacity-0 group-hover:opacity-100"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-all opacity-0 group-hover:opacity-100"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-6 right-6 md:right-12 z-20 flex space-x-2">
            {featuredEvents.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 rounded-full h-2 md:h-2.5 ${
                  index === currentIndex
                    ? "w-6 md:w-8 bg-primary"
                    : "w-2 md:w-2.5 bg-white/50 hover:bg-white"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
