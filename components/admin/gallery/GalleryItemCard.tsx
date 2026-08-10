'use client'

import Image from 'next/image'
import { GalleryItemWithEvent } from '@/types/gallery'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2 } from 'lucide-react'

interface GalleryItemCardProps {
    item: GalleryItemWithEvent
    onEdit: (item: GalleryItemWithEvent) => void
    onDelete: (item: GalleryItemWithEvent) => void
}

const categoryColors: Record<string, string> = {
    'SMILE FEST': 'bg-blue-50 text-blue-700 border-blue-200',
    'SMILEVERSARY': 'bg-purple-50 text-purple-700 border-purple-200',
    'Suasana Kelas': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Fasilitas': 'bg-amber-50 text-amber-700 border-amber-200',
}

export function GalleryItemCard({ item, onEdit, onDelete }: GalleryItemCardProps) {
    return (
        <div className="group relative bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
            {/* Thumbnail */}
            <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Hover overlay with actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                    <button
                        onClick={() => onEdit(item)}
                        className="p-2.5 bg-white rounded-xl shadow-lg hover:bg-slate-50 transform scale-90 group-hover:scale-100 transition-all duration-300"
                        aria-label="Edit foto"
                    >
                        <Edit className="w-4 h-4 text-slate-700" />
                    </button>
                    <button
                        onClick={() => onDelete(item)}
                        className="p-2.5 bg-white rounded-xl shadow-lg hover:bg-red-50 transform scale-90 group-hover:scale-100 transition-all duration-300"
                        aria-label="Hapus foto"
                    >
                        <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="p-4 space-y-2.5">
                <p className="text-sm font-semibold text-slate-800 line-clamp-1" title={item.caption}>
                    {item.caption}
                </p>

                <div className="flex flex-wrap items-center gap-1.5">
                    <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold ${categoryColors[item.category] || 'bg-slate-50 text-slate-600 border-slate-200'}`}
                    >
                        {item.category}
                    </Badge>
                    {item.event && (
                        <Badge
                            variant="outline"
                            className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 border-indigo-200"
                        >
                            {item.event.badge || item.event.title}
                        </Badge>
                    )}
                </div>
            </div>
        </div>
    )
}
