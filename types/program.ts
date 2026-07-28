import { LucideIcon } from "lucide-react";

interface SubProgram {
    name: string;
    description: string;
    badge?: string;
    // Modal detail fields
    detail?: {
        hargaDaftar: string;
        sppBulanan: string;
        /** Override label for sppBulanan (e.g. 'Harga Paket', 'Harga Pembelajaran') */
        sppLabel?: string;
        /** Override note for sppBulanan */
        sppNote?: string;
        hargaModul?: string;
        hargaUjian?: string;
        jadwal: string;
        materi: string[];
    };
}

interface Program {
    id: string;
    icon: LucideIcon;
    title: string;
    color: string;
    accentClass: string;
    badgeBg: string;
    borderAccent: string;
    description: string;
    subPrograms: SubProgram[];
}