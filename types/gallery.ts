// ─── Supabase Table: events ────────────────────────────────
export interface Event {
    id: string;
    title: string;
    description: string | null;
    src: string;
    alt: string;
    badge: string;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
    gallery_items?: GalleryItem[];
}

// Alias backward-compatible untuk FeaturedSlider dengan data relasi gallery_items
export type FeaturedEvent = Pick<Event, 'id' | 'title' | 'description' | 'src' | 'alt' | 'badge'> & {
    gallery_items?: Pick<GalleryItem, 'id' | 'src' | 'alt' | 'created_at'>[];
};

// ─── Supabase Table: gallery_items ─────────────────────────
export interface GalleryItem {
    id: string;
    src: string;
    alt: string;
    caption: string;
    category: string;
    event_id: string | null;
    created_at: string;
}

// Joined type: gallery_items + nested event data (dari Supabase select with join)
export interface GalleryItemWithEvent extends GalleryItem {
    event: Pick<Event, 'id' | 'title' | 'badge'> | null;
}

// ─── Category Constants ────────────────────────────────────
export const GALLERY_CATEGORIES = [
    "Semua",
    "SMILE FEST",
    "SMILEVERSARY",
    "Suasana Kelas",
    "Event Tahunan",
    "Fasilitas",
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];