import { Metadata } from 'next'
import { GalleryAdminGrid } from '@/components/admin/gallery/GalleryAdminGrid'
import { Image as ImageIcon } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Kelola Gallery — Admin SMART in ENGLISH',
}

export default function GalleryAdminPage() {
    return (
        <div className="space-y-8 max-w-7xl">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center border border-violet-100">
                        <ImageIcon className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Kelola Gallery</h1>
                        <p className="text-sm text-slate-500">
                            Atur foto dokumentasi kegiatan SMART in ENGLISH
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <GalleryAdminGrid />
        </div>
    )
}
