import { Metadata } from "next";
import BlogList from "@/components/blogs/BlogList";
import { getPublicBlogs } from "@/app/admin/blogs/actions";

export const metadata: Metadata = {
  title: "Blog & Informasi Terbaru | SMART in ENGLISH",
  description:
    "Temukan berbagai tips belajar bahasa Inggris, artikel inspiratif seputar edukasi, dan informasi pengumuman terbaru dari smArt in english.",
  openGraph: {
    title: "Blog & Informasi Terbaru | SMART in ENGLISH",
    description:
      "Temukan berbagai tips belajar bahasa Inggris, artikel inspiratif seputar edukasi, dan informasi pengumuman terbaru dari smArt in english.",
    type: "website",
  },
};

export default async function BlogPage() {
  const blogs = await getPublicBlogs();

  return <BlogList initialBlogs={blogs} />;
}
