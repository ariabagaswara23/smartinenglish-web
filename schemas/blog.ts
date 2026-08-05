import { z } from "zod";

export const blogFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  slug: z.string().min(3, { message: "Slug must be at least 3 characters." }),
  excerpt: z.string().nullable().optional(),
  content: z.string().min(10, { message: "Content must be at least 10 characters." }),
  category: z.string().min(1, { message: "Category is required." }),
  author: z.string().min(2, { message: "Author must be at least 2 characters." }),
  image_url: z.string().nullable().optional(),
  status: z.enum(['draft', 'published']),
  published_at: z.string().nullable().optional(),
});

export type BlogFormValues = z.infer<typeof blogFormSchema>;
