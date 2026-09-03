import { z } from "zod";

export const galleryItemFormSchema = z.object({
    src: z.string().url({ message: "URL gambar harus valid." }),
    alt: z.string().optional(),
    caption: z.string().min(2, { message: "Caption minimal 2 karakter." }),
    category: z.string().min(1, { message: "Kategori wajib dipilih." }),
    event_id: z.string().uuid().nullable().optional(),
});

export type GalleryItemFormValues = z.infer<typeof galleryItemFormSchema>;
