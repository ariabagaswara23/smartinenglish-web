// ============================================================
//  Gallery Dummy Data
//  Semua data foto galeri dipusatkan di sini agar mudah dikelola.
// ============================================================

export type GalleryCategory =
  | "Semua"
  | "SMILE FEST"
  | "SMILEVERSARY"
  | "Suasana Kelas"
  | "Fasilitas";

export interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  category: Exclude<GalleryCategory, "Semua">;
  caption: string;
}

export interface FeaturedEvent {
  id: number;
  title: string;
  description: string;
  src: string;
  alt: string;
  badge: string;
}

// ─── Featured Events (Auto-Slider) ─────────────────────────
export const featuredEvents: FeaturedEvent[] = [
  {
    id: 1,
    title: "SMILE FEST 2024",
    description:
      "Perayaan minat dan bakat peserta didik — mulai dari speech contest, story telling, hingga penampilan seni yang memukau.",
    src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
    alt: "Suasana panggung SMILE FEST 2024",
    badge: "Event Tahunan",
  },
  {
    id: 2,
    title: "SMILEVERSARY ke-9",
    description:
      "Peringatan hari jadi smArt in english — kursus gratis untuk masyarakat, promo spesial, dan berbagai hadiah menarik.",
    src: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop",
    alt: "Suasana perayaan SMILEVERSARY ke-9",
    badge: "Milestones",
  },
  {
    id: 3,
    title: "Holiday at Smile",
    description:
      "Program intensif liburan semester — kelas vocab, grammar, dan speaking yang seru dan interaktif.",
    src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop",
    alt: "Siswa belajar saat program Holiday at Smile",
    badge: "Program Liburan",
  },
  {
    id: 4,
    title: "Wisuda & Graduation Day",
    description:
      "Momen istimewa pelepasan siswa berprestasi yang telah menyelesaikan program belajar bersama kami.",
    src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop",
    alt: "Suasana wisuda dan graduation day",
    badge: "Wisuda",
  },
];

// ─── Gallery Items (Filter Grid) ───────────────────────────
export const galleryItems: GalleryItem[] = [
  // SMILE FEST
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
    alt: "Panggung utama SMILE FEST",
    category: "SMILE FEST",
    caption: "Panggung Utama SMILE FEST 2024",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop",
    alt: "Penampilan speech contest",
    category: "SMILE FEST",
    caption: "Lomba Speech Contest",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=800&auto=format&fit=crop",
    alt: "Pemberian award SMILE FEST",
    category: "SMILE FEST",
    caption: "Pemberian Award Berprestasi",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    alt: "Penampilan story telling",
    category: "SMILE FEST",
    caption: "Story Telling Competition",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=800&auto=format&fit=crop",
    alt: "Foto bersama peserta SMILE FEST",
    category: "SMILE FEST",
    caption: "Foto Bersama Peserta",
  },

  // SMILEVERSARY
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop",
    alt: "Perayaan SMILEVERSARY",
    category: "SMILEVERSARY",
    caption: "Perayaan SMILEVERSARY ke-9",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1559027615-cd246c2904ca?q=80&w=800&auto=format&fit=crop",
    alt: "Kursus gratis SMILEVERSARY",
    category: "SMILEVERSARY",
    caption: "Kursus Bahasa Inggris Gratis",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop",
    alt: "Selebrasi ulang tahun lembaga",
    category: "SMILEVERSARY",
    caption: "Momen Perayaan Ulang Tahun",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop",
    alt: "Pemotongan kue SMILEVERSARY",
    category: "SMILEVERSARY",
    caption: "Upacara Pemotongan Kue",
  },

  // Suasana Kelas
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop",
    alt: "Siswa belajar bahasa Inggris",
    category: "Suasana Kelas",
    caption: "Kelas Bahasa Inggris Interaktif",
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
    alt: "Diskusi kelompok dalam kelas",
    category: "Suasana Kelas",
    caption: "Sesi Diskusi Kelompok",
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop",
    alt: "Guru mengajar di depan kelas",
    category: "Suasana Kelas",
    caption: "Pengajar Berpengalaman",
  },
  {
    id: 13,
    src: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800&auto=format&fit=crop",
    alt: "Siswa fokus belajar",
    category: "Suasana Kelas",
    caption: "Suasana Belajar yang Kondusif",
  },
  {
    id: 14,
    src: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=800&auto=format&fit=crop",
    alt: "Kelas matematika",
    category: "Suasana Kelas",
    caption: "Kelas Matematika Asyik",
  },
  {
    id: 15,
    src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=800&auto=format&fit=crop",
    alt: "Kelas komputer",
    category: "Suasana Kelas",
    caption: "Kelas Komputer & Coding",
  },

  // Fasilitas
  {
    id: 16,
    src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=800&auto=format&fit=crop",
    alt: "Ruang kelas modern",
    category: "Fasilitas",
    caption: "Ruang Kelas Modern & Nyaman",
  },
  {
    id: 17,
    src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop",
    alt: "Laboratorium komputer",
    category: "Fasilitas",
    caption: "Lab Komputer Lengkap",
  },
  {
    id: 18,
    src: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop",
    alt: "Ruang baca perpustakaan",
    category: "Fasilitas",
    caption: "Pojok Baca & Perpustakaan",
  },
  {
    id: 19,
    src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=800&auto=format&fit=crop",
    alt: "Area tunggu yang nyaman",
    category: "Fasilitas",
    caption: "Area Tunggu yang Nyaman",
  },
];

export const galleryCategories: GalleryCategory[] = [
  "Semua",
  "SMILE FEST",
  "SMILEVERSARY",
  "Suasana Kelas",
  "Fasilitas",
];
