import { z } from "zod";

export const siteSettingsSchema = z.object({
  whatsapp_number: z.string().min(1, "Nomor WhatsApp wajib diisi"),
  whatsapp_template_default: z.string().min(1, "Template default wajib diisi"),
  whatsapp_template_program: z.string().min(1, "Template program wajib diisi"),
  contact_email: z.string().email("Format email tidak valid").min(1, "Email wajib diisi"),
  social_instagram: z.string().url("URL Instagram tidak valid").or(z.literal("")),
  social_tiktok: z.string().url("URL TikTok tidak valid").or(z.literal("")),
});

export type SiteSettingsValues = z.infer<typeof siteSettingsSchema>;
