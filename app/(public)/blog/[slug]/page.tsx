import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogBySlug, getRecentBlogs } from "@/app/admin/blogs/actions";
import BlogDetail from "@/components/blogs/BlogDetail";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Artikel Tidak Ditemukan - SMART in ENGLISH",
      description: "Artikel yang Anda cari tidak dapat ditemukan atau sudah dihapus.",
    };
  }

  const title = `${blog.title} | SMART in ENGLISH`;
  const description =
    blog.excerpt ||
    "Baca artikel dan tips belajar bahasa Inggris terbaru dari smArt in english.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: blog.published_at || blog.created_at,
      authors: [blog.author],
      images: blog.image_url ? [{ url: blog.image_url }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: blog.image_url ? [blog.image_url] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog || blog.status !== "published") {
    notFound();
  }

  const relatedBlogs = await getRecentBlogs(slug, 3);

  return <BlogDetail blog={blog} relatedBlogs={relatedBlogs} />;
}
