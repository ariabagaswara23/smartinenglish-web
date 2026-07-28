export interface FeaturedEvent {
    id: string;
    title: string;
    description: string;
    src: string;
    alt: string;
    badge: string;
}

export interface GalleryItem {
    id: string;
    src: string;
    alt: string;
    category: string;
    caption: string;
    event_id?: string;
}

// Untuk kodingan tab filter di FE:
export const GALLERY_CATEGORIES = [
    "Semua",
    "SMILE FEST",
    "SMILEVERSARY",
    "Suasana Kelas",
    "Fasilitas",
] as const;