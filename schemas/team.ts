import { z } from "zod";

const optionalStringSchema = z.preprocess(
  (val) => (typeof val === "string" && val.trim() === "" ? null : val),
  z.string().nullable().optional()
);

export const teamFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  type: z.enum(['teacher', 'staff']),
  role: z.string().min(2, { message: "Role must be at least 2 characters." }),
  experience_years: optionalStringSchema,
  education: optionalStringSchema,
  subject_category: z.array(z.string()).optional(),
  description: z.string().optional(),
  order_index: z.coerce.number().min(0),
  is_active: z.boolean().default(true),
  image_url: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.type === 'teacher') {
    if (!data.subject_category || data.subject_category.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Subject categories are required for teachers.",
        path: ["subject_category"],
      });
    }
  }
});

export type TeamFormValues = z.infer<typeof teamFormSchema>;
