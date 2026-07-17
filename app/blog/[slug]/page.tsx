import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { mockBlogs } from '@/lib/data/mockBlogs';

type Params = Promise<{ slug: string }>;

export default async function BlogDetailPage(props: { params: Params }) {
  const params = await props.params;
  const { slug } = params;
  
  const blog = mockBlogs.find(b => b.slug === slug);
  
  if (!blog) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#fafafc] pb-24">
      {/* Blog Header / Hero */}
      <section className="bg-white pt-24 pb-16 md:pt-32 md:pb-24 border-b border-gray-100 relative">
        {/* Background pattern */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.2]" 
          style={{
            backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-block mb-6">
            <span className="bg-blue-50 text-primary text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider border border-blue-100 shadow-sm">
              {blog.category}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0f172a] mb-8 leading-tight tracking-tight">
            {blog.title}
          </h1>
          
          <div className="flex items-center justify-center text-gray-500 space-x-6 text-sm font-medium">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              {blog.author}
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {blog.date}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[16/9] md:aspect-[2/1] bg-gray-200">
          <img 
            src={blog.imageUrl} 
            alt={blog.title} 
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Blog Content */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-24">
        <div 
          className="text-gray-700 text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
        
        {/* Back to Blog List */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-primary font-bold hover:text-blue-900 transition-colors group"
          >
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Kembali ke Daftar Blog
          </Link>
        </div>
      </section>
    </main>
  );
}
