/**
 * Helper utilities for WhatsApp numbers and links formatting.
 */

export const DEFAULT_WA_NUMBER = "6282129183000";
export const DEFAULT_WA_TEMPLATE = "Halo Admin, saya ingin bertanya seputar program bimbingan belajar di SMART in ENGLISH.";
export const DEFAULT_WA_PROGRAM_TEMPLATE = "Halo Admin, saya tertarik untuk mendaftar program {program}. Boleh minta info lebih lanjut seputar jadwal dan biayanya?";

/**
 * Normalizes phone number to international wa.me format (e.g. 6282129183000).
 */
export function cleanWhatsAppNumber(phone?: string | null): string {
  if (!phone) return DEFAULT_WA_NUMBER;

  // Remove any spaces, dashes, parentheses, or dots
  let cleaned = phone.replace(/[\s\-\(\)\.]/g, "");

  // If starts with +, remove +
  if (cleaned.startsWith("+")) {
    cleaned = cleaned.substring(1);
  }

  // If starts with 08..., convert to 628...
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.substring(1);
  }

  // If only 8..., prepend 62
  if (cleaned.startsWith("8")) {
    cleaned = "62" + cleaned;
  }

  return cleaned || DEFAULT_WA_NUMBER;
}

/**
 * Formats a raw number into human-readable phone format e.g. "+62 821-2918-3000".
 */
export function formatDisplayPhone(phone?: string | null): string {
  const cleaned = cleanWhatsAppNumber(phone);
  if (cleaned.startsWith("62")) {
    const rest = cleaned.substring(2);
    // Format: +62 8xx-xxxx-xxxx
    if (rest.length >= 8) {
      const part1 = rest.substring(0, 3);
      const part2 = rest.substring(3, 7);
      const part3 = rest.substring(7);
      return `+62 ${part1}-${part2}${part3 ? `-${part3}` : ""}`;
    }
    return `+62 ${rest}`;
  }
  return phone || `+62 821-2918-3000`;
}

/**
 * Generates direct wa.me link.
 */
export function createWhatsAppUrl(phone?: string | null, text?: string): string {
  const num = cleanWhatsAppNumber(phone);
  const trimmedText = text?.trim();
  if (trimmedText) {
    return `https://wa.me/${num}?text=${encodeURIComponent(trimmedText)}`;
  }
  return `https://wa.me/${num}`;
}

/**
 * Replaces placeholders or constructs a program-specific message.
 */
export function interpolateProgramMessage(template?: string | null, programName: string = ""): string {
  if (!template || !template.trim()) {
    return `Halo Admin, saya tertarik untuk mendaftar program ${programName || "SMART in ENGLISH"}. Boleh minta info lebih lanjut?`;
  }

  const placeholderRegex = /\{program\}|\{nama_program\}|\[nama program\]|\[program\]/gi;
  if (placeholderRegex.test(template)) {
    return template.replace(placeholderRegex, programName || "SMART in ENGLISH");
  }

  if (programName && !template.toLowerCase().includes(programName.toLowerCase())) {
    return `${template.trim()} (${programName})`;
  }

  return template;
}
