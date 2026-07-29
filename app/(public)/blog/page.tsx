import React from 'react';
import Link from 'next/link';
import { mockBlogs } from '@/lib/data/mockBlogs';

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#fafafc] pb-24">
      {/* Blog Header */}
      <section className="bg-white py-16 md:py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center justify-center space-x-2 px-4 py-1.5 rounded-full border border-blue-100 bg-blue-50/50 mb-6">
            <span className="text-[12px] font-bold tracking-[0.15em] text-primary uppercase">
              Pusat Informasi
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-[#0f172a] leading-tight mb-6 tracking-tight">
            Blog & <span className="italic text-primary font-serif">Pengumuman</span>
          </h1>
          
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Temukan berbagai tips belajar bahasa Inggris, artikel inspiratif, dan informasi terbaru dari smArt in english.
          </p>
        </div>
      </section>

      {/* Blog List Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockBlogs.map((blog) => (
            <Link href={`/blog/${blog.slug}`} key={blog.id} className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img 
                  src={blog.imageUrl} 
                  alt={blog.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/95 backdrop-blur-sm text-primary text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                    {blog.category}
                  </span>
                </div>
              </div>
              <div className="p-6 sm:p-8 flex-1 flex flex-col">
                <div className="flex items-center text-xs text-gray-500 mb-4 space-x-4">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {blog.date}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    {blog.author}
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-[#0f172a] mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                  {blog.title}
                </h2>
                
                <p className="text-gray-500 text-sm line-clamp-3 mb-8 flex-1 leading-relaxed">
                  {blog.excerpt}
                </p>
                
                <div className="mt-auto flex items-center text-primary font-bold text-sm">
                  Baca Selengkapnya
                  <svg className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
