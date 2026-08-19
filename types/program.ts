export interface Program {
  id: string; // e.g., 'english', 'math', 'calistung'
  title: string;
  icon_name: string; // Nama icon Lucide, e.g. 'Languages', 'Percent'
  color: string; // Tailwind class background
  accent_class: string; // Tailwind class text
  badge_bg: string; // Tailwind class badge
  border_accent: string; // Tailwind class border
  description: string;
  order_index: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  sub_programs?: SubProgram[];
}

export interface SubProgram {
  id: string; // UUID
  program_id: string; // FK to programs.id
  name: string;
  description: string;
  badge: string | null;
  
  // Harga & Biaya (BIGINT numeric values)
  harga_daftar: number;
  spp_bulanan: number;
  spp_label: string | null; // e.g., 'Harga Paket'
  spp_note: string | null; // e.g., 'Dibayar di awal per paket'
  harga_modul: number | null;
  harga_ujian: number | null;
  
  // Detail
  jadwal: string;
  materi: string[]; // JSONB Array dari Supabase
  module_images: string[]; // List URL public dari bucket 'program-modules'
  
  // Promo / Discount Info
  is_discount_active: boolean;
  discount_percentage: number | null;
  harga_daftar_discount: number | null;
  spp_bulanan_discount: number | null;
  
  // Pengaturan
  order_index: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SubProgramDetail extends SubProgram {
  program?: Program; // Data relasi induk program
}