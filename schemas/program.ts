import { z } from "zod";

const optionalNumberSchema = z.preprocess(
  (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
  z.number().min(0, { message: "Nilai tidak boleh negatif" }).nullable().optional()
);

const optionalPercentageSchema = z.preprocess(
  (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
  z.number().min(0, { message: "Diskon minimal 0%" }).max(100, { message: "Diskon maksimal 100%" }).nullable().optional()
);

export const subProgramFormSchema = z.object({
  name: z.string().min(1, { message: "Nama sub-program wajib diisi" }),
  description: z.string().min(1, { message: "Deskripsi wajib diisi" }),
  badge: z.string().nullable().optional(),
  jadwal: z.string().min(1, { message: "Jadwal wajib diisi" }),
  
  // Harga & Biaya (BIGINT numeric values)
  harga_daftar: z.coerce.number({ message: "Biaya pendaftaran wajib diisi angka" }).min(0, { message: "Biaya pendaftaran tidak boleh negatif" }),
  spp_bulanan: z.coerce.number({ message: "SPP bulanan wajib diisi angka" }).min(0, { message: "SPP bulanan tidak boleh negatif" }),
  spp_label: z.string().nullable().optional(),
  spp_note: z.string().nullable().optional(),
  harga_modul: optionalNumberSchema,
  harga_ujian: optionalNumberSchema,
  
  // Promo / Discount Info
  is_discount_active: z.boolean().default(false),
  discount_percentage: optionalPercentageSchema,
  harga_daftar_discount: optionalNumberSchema,
  spp_bulanan_discount: optionalNumberSchema,
  
  // Pengaturan
  order_index: z.coerce.number().optional().default(0),
  is_active: z.boolean().default(true),
  
  // Materi & Media
  materi: z.array(z.string()).default([]),
  module_images: z.array(z.string()).default([]),
});

export type SubProgramFormValues = z.infer<typeof subProgramFormSchema>;
