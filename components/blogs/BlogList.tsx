"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/types/blog";
import { Search, Calendar, User, ArrowRight, BookOpen, Sparkles, Filter } from "lucide-react";

interface BlogListProps {
  initialBlogs?: BlogPost[];
}

export default function BlogList({ initialBlogs = [] }: BlogListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Extract unique categories from blogs
  const categories = useMemo(() => {
    const cats = new Set<string>();
    initialBlogs.forEach((blog) => {
      if (blog.category) {
        cats.add(blog.category);
      }
    });
    return Array.from(cats);
  }, [initialBlogs]);

  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    return initialBlogs.filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (blog.excerpt && blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
        blog.author.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        blog.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [initialBlogs, searchQuery, selectedCategory]);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  return (
    <main className="min-h-screen bg-[#fafafc] pb-24">
      {/* Blog Header Hero */}
      <section className="bg-white py-16 md:py-24 border-b border-gray-100 relative overflow-hidden">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center justify-center space-x-2 px-4 py-1.5 rounded-full border border-blue-100 bg-blue-50/60 mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-[12px] font-bold tracking-[0.15em] text-primary uppercase">
              Pusat Informasi & Edukasi
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0f172a] leading-tight mb-6 tracking-tight">
            Blog & <span className="text-primary italic font-serif">Pengumuman</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Temukan berbagai tips belajar bahasa Inggris, artikel inspiratif seputar edukasi, dan informasi pengumuman terbaru dari smArt in english.
          </p>

          {/* Search & Filter Bar */}
          <div className="mt-10 max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari topik, tips, atau judul artikel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm sm:text-base text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 text-xs font-semibold text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-md transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Category Chips */}
          {categories.length > 0 && (
            <div className="mt-6 flex items-center justify-center flex-wrap gap-2 max-w-3xl mx-auto">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  selectedCategory === "all"
                    ? "bg-primary text-white shadow-sm ring-2 ring-primary/20"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                }`}
              >
                Semua Kategori ({initialBlogs.length})
              </button>
              {categories.map((cat) => {
                const count = initialBlogs.filter(
                  (b) => b.category.toLowerCase() === cat.toLowerCase()
                ).length;
                const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-primary text-white shadow-sm ring-2 ring-primary/20"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Blog List Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        {filteredBlogs.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {initialBlogs.length === 0
                ? "Belum Ada Artikel Dipublikasikan"
                : "Artikel Tidak Ditemukan"}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {initialBlogs.length === 0
                ? "Saat ini belum ada artikel blog yang tersedia. Silakan kunjungi kembali nanti."
                : `Tidak ada artikel yang cocok dengan filter "${searchQuery || selectedCategory}".`}
            </p>
            {(searchQuery || selectedCategory !== "all") && (
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-blue-900 transition-colors shadow-sm cursor-pointer"
              >
                <Filter className="w-4 h-4" />
                Reset Filter
              </button>
            )}
          </div>
        ) : (
          /* Grid of Blog Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <Link
                href={`/blog/${blog.slug}`}
                key={blog.id}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-xs border border-gray-100/80 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
              >
                {/* Cover Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  {blog.image_url ? (
                    <Image
                      src={blog.image_url}
                      alt={blog.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-blue-300" />
                    </div>
                  )}

                  {/* Category Badge */}
                  {blog.category && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-white/95 backdrop-blur-md text-primary text-[11px] font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm border border-white/50">
                        {blog.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col">
                  {/* Meta Bar */}
                  <div className="flex items-center text-xs text-gray-500 mb-3.5 space-x-4">
                    <div className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 text-primary/70 shrink-0" />
                      <span>{formatDate(blog.published_at || blog.created_at)}</span>
                    </div>
                    {blog.author && (
                      <div className="flex items-center">
                        <User className="w-3.5 h-3.5 mr-1.5 text-primary/70 shrink-0" />
                        <span className="truncate max-w-[120px]">{blog.author}</span>
                      </div>
                    )}
                  </div>

                  {/* Blog Title */}
                  <h2 className="text-xl font-bold text-[#0f172a] mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {blog.title}
                  </h2>

                  {/* Excerpt */}
                  {blog.excerpt && (
                    <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  )}

                  {/* Read More Link */}
                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center text-primary font-bold text-sm">
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}