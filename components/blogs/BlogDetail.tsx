"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/types/blog";
import { useWhatsAppModal } from "@/providers/SiteSettingsContext";
import {
  Calendar,
  User,
  Clock,
  ArrowLeft,
  Share2,
  Check,
  Copy,
  ChevronRight,
  Sparkles,
  MessageCircle,
  BookOpen,
} from "lucide-react";

interface BlogDetailProps {
  blog: BlogPost;
  relatedBlogs?: BlogPost[];
}

export default function BlogDetail({ blog, relatedBlogs = [] }: BlogDetailProps) {
  const { openWhatsAppModal } = useWhatsAppModal();
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentUrl(window.location.href);
    }
  }, []);

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

  // Estimate reading time in minutes based on word count
  const readingTime = React.useMemo(() => {
    const text = blog.content ? blog.content.replace(/<[^>]*>?/gm, "") : "";
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 180);
    return minutes < 1 ? 1 : minutes;
  }, [blog.content]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareText = encodeURIComponent(`${blog.title} - smArt in english`);
  const shareUrl = encodeURIComponent(currentUrl);

  return (
    <article className="min-h-screen bg-[#fafafc] pb-24">
      {/* Top Breadcrumb & Back Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 overflow-x-auto py-1">
              <Link href="/" className="hover:text-primary transition-colors shrink-0">
                Beranda
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <Link href="/blog" className="hover:text-primary transition-colors shrink-0">
                Blog
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-xs">
                {blog.title}
              </span>
            </nav>

            {/* Back to Blog button */}
            <Link
              href="/blog"
              className="inline-flex items-center text-xs sm:text-sm font-semibold text-primary hover:text-blue-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Kembali ke Blog
            </Link>
          </div>
        </div>
      </div>

      {/* Main Article Header */}
      <header className="bg-white border-b border-gray-100 py-10 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Badge */}
          {blog.category && (
            <div className="mb-4">
              <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-bold bg-blue-50 text-primary border border-blue-100 uppercase tracking-wider">
                {blog.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0f172a] leading-tight tracking-tight mb-6">
            {blog.title}
          </h1>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm text-gray-500 pt-2 border-t border-gray-100">
            {/* Author */}
            {blog.author && (
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-primary flex items-center justify-center font-bold text-xs">
                  {blog.author.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-gray-800">{blog.author}</span>
              </div>
            )}

            {/* Date */}
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1.5 text-primary/70" />
              <span>{formatDate(blog.published_at || blog.created_at)}</span>
            </div>

            {/* Reading Time */}
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1.5 text-primary/70" />
              <span>~{readingTime} menit membaca</span>
            </div>
          </div>
        </div>
      </header>

      {/* Article Body Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12">
        {/* Cover Image */}
        {blog.image_url ? (
          <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-lg border border-gray-100 mb-10 bg-slate-100">
            <Image
              src={blog.image_url}
              alt={blog.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 900px"
              className="object-cover"
            />
          </div>
        ) : null}

        {/* Excerpt Lead Box */}
        {blog.excerpt && (
          <div className="bg-blue-50/60 border-l-4 border-primary rounded-r-2xl p-5 sm:p-6 mb-10 text-gray-700 text-base sm:text-lg leading-relaxed italic">
            &ldquo;{blog.excerpt}&rdquo;
          </div>
        )}

        {/* Rich Text HTML Content */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 md:p-12 shadow-xs">
          <div
            className="prose prose-slate prose-lg md:prose-xl max-w-none 
              prose-headings:font-bold prose-headings:text-slate-900 prose-headings:tracking-tight
              prose-p:text-slate-700 prose-p:leading-relaxed
              prose-a:text-primary prose-a:font-semibold prose-a:underline hover:prose-a:text-blue-900
              prose-img:rounded-2xl prose-img:shadow-md prose-img:my-8
              prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-blue-50/50 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:text-slate-700
              prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-primary
              prose-ul:list-disc prose-ul:my-4 prose-ol:list-decimal prose-ol:my-4
              prose-li:text-slate-700 prose-li:my-1"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        {/* Share Section */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-primary" />
            <span className="font-bold text-gray-800 text-sm sm:text-base">
              Bagikan artikel ini:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>

            {/* X / Twitter */}
            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors"
            >
              X / Twitter
            </a>

            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
            >
              Facebook
            </a>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Salin Tautan
                </>
              )}
            </button>
          </div>
        </div>

        {/* WhatsApp Consultation Banner */}
        <div className="mt-10 bg-gradient-to-br from-[#1e40af] to-[#1e3a8a] text-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Konsultasi Belajar
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold leading-tight mb-2">
                Tertarik Mengembangkan Bahasa Inggris Anda?
              </h3>
              <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
                Dapatkan bimbingan intensif dari pengajar profesional di smArt in english. Konsultasikan kebutuhan belajar Anda secara gratis sekarang!
              </p>
            </div>

            <button
              onClick={() => openWhatsAppModal()}
              className="shrink-0 bg-white hover:bg-gray-100 text-primary font-bold px-6 py-3.5 rounded-full text-sm shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer"
            >
              Konsultasi Sekarang
            </button>
          </div>
        </div>

        {/* Related Articles */}
        {relatedBlogs.length > 0 && (
          <section className="mt-16 sm:mt-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0f172a]">
                  Artikel Terkait Lainnya
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Baca juga tulisan inspiratif lainnya dari smArt in english.
                </p>
              </div>
              <Link
                href="/blog"
                className="hidden sm:inline-flex items-center text-sm font-bold text-primary hover:text-blue-900 transition-colors"
              >
                Lihat Semua
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((item) => (
                <Link
                  href={`/blog/${item.slug}`}
                  key={item.id}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-slate-300" />
                      </div>
                    )}
                    {item.category && (
                      <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-primary text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                        {item.category}
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <span className="text-xs text-gray-400 mb-2">
                      {formatDate(item.published_at || item.created_at)}
                    </span>
                    <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 text-base leading-snug mb-2">
                      {item.title}
                    </h3>
                    {item.excerpt && (
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mt-auto">
                        {item.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
