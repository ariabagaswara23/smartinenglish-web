import { z } from "zod";

export const eventFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Judul event wajib diisi." }),
  description: z.string().nullable().optional(),
  badge: z.string().nullable().optional(),
  alt: z.string().nullable().optional(),
  is_featured: z.boolean().default(false),
  src: z.string().nullable().optional(),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
