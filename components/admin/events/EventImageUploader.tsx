'use client'

import * as React from 'react'
import Image from 'next/image'
import { UploadCloud, X, Image as ImageIcon, Loader2, ZoomIn } from 'lucide-react'
import { toast } from '@/components/ui/toast'
import { ImageLightbox } from '@/components/ui/image-lightbox'
import { uploadEventPoster, deleteEventPosterFromStorage } from '@/app/admin/events/actions'

interface EventImageUploaderProps {
    currentImageUrl?: string | null
    onImageUploaded: (url: string) => void
    onImageRemoved: () => void
    disabled?: boolean
}

export function EventImageUploader({
    currentImageUrl,
    onImageUploaded,
    onImageRemoved,
    disabled,
}: EventImageUploaderProps) {
    const [preview, setPreview] = React.useState<string | null>(currentImageUrl || null)
    const [isUploading, setIsUploading] = React.useState(false)
    const [lightboxOpen, setLightboxOpen] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPreview(currentImageUrl || null)
    }, [currentImageUrl])

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validasi ukuran (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.add({
                title: 'File terlalu besar',
                description: 'Ukuran poster maksimal adalah 5MB.',
                type: 'warning',
            })
            return
        }

        // Validasi format
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            toast.add({
                title: 'Format tidak didukung',
                description: 'Gunakan format JPG, PNG, atau WebP.',
                type: 'warning',
            })
            return
        }

        // Preview lokal instan
        const localPreview = URL.createObjectURL(file)
        setPreview(localPreview)
        setIsUploading(true)

        try {
            // Jika sudah ada gambar lama di bucket event-posters, hapus terlebih dahulu
            if (currentImageUrl && currentImageUrl.includes('event-posters')) {
                await deleteEventPosterFromStorage(currentImageUrl)
            }

            const formData = new FormData()
            formData.append('file', file)

            const result = await uploadEventPoster(formData)

            if (!result.success || !result.url) {
                toast.add({
                    title: 'Gagal mengunggah',
                    description: result.error || 'Terjadi kesalahan saat upload poster.',
                    type: 'error',
                })
                setPreview(currentImageUrl || null)
                return
            }

            onImageUploaded(result.url)
            toast.add({
                title: 'Poster Terunggah',
                description: 'Poster event berhasil diunggah ke storage.',
                type: 'success',
            })
        } catch (err) {
            console.error('Upload poster error:', err)
            toast.add({
                title: 'Gagal mengunggah',
                description: 'Terjadi gangguan koneksi saat mengunggah poster.',
                type: 'error',
            })
            setPreview(currentImageUrl || null)
        } finally {
            setIsUploading(false)
        }
    }

    const handleRemove = async () => {
        const oldUrl = currentImageUrl
        setPreview(null)
        onImageRemoved()
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }

        if (oldUrl && oldUrl.includes('event-posters')) {
            try {
                await deleteEventPosterFromStorage(oldUrl)
            } catch (err) {
                console.error('Failed to cleanup poster on remove:', err)
            }
        }
    }

    return (
        <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800">
                Poster / Banner Event
            </label>
            <div className="flex flex-col sm:flex-row items-start gap-4">
                {preview ? (
                    <div className="relative w-full sm:w-48 h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-sm">
                        <Image
                            src={preview}
                            alt="Preview Poster Event"
                            fill
                            className="object-cover transition-transform group-hover:scale-105 duration-300"
                        />
                        {isUploading && (
                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1.5 text-white">
                                <Loader2 className="w-6 h-6 animate-spin" />
                                <span className="text-xs font-medium">Mengunggah...</span>
                            </div>
                        )}
                        {!isUploading && (
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                {/* Zoom / Lightbox button */}
                                <button
                                    type="button"
                                    onClick={() => setLightboxOpen(true)}
                                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white backdrop-blur-sm transition-all shadow"
                                    title="Lihat poster ukuran penuh"
                                    aria-label="Lihat poster ukuran penuh"
                                >
                                    <ZoomIn className="w-4 h-4" />
                                </button>
                                {/* Remove button */}
                                {!disabled && (
                                    <button
                                        type="button"
                                        onClick={handleRemove}
                                        className="p-2 bg-white/20 hover:bg-red-500/80 rounded-lg text-white backdrop-blur-sm transition-all shadow"
                                        title="Hapus foto poster"
                                        aria-label="Hapus foto poster"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="w-full sm:w-48 h-32 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400 gap-1">
                        <ImageIcon className="w-8 h-8 text-slate-300" />
                        <span className="text-xs">Belum ada poster</span>
                    </div>
                )}

                <div className="flex-1 space-y-2">
                    <label
                        className={`cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-colors ${
                            isUploading || disabled ? 'opacity-50 pointer-events-none' : ''
                        }`}
                    >
                        <UploadCloud className="w-4 h-4 text-blue-600" />
                        <span>{isUploading ? 'Mengunggah poster...' : preview ? 'Ganti Poster' : 'Pilih File Poster'}</span>
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleFileChange}
                            disabled={isUploading || disabled}
                        />
                    </label>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Format: <span className="font-medium text-slate-700">JPG, PNG, WebP</span>. Ukuran maks:{' '}
                        <span className="font-medium text-slate-700">5MB</span>. Disarankan rasio landscape 16:9.
                    </p>
                </div>
            </div>

            {/* Lightbox */}
            <ImageLightbox
                isOpen={lightboxOpen && Boolean(preview)}
                onClose={() => setLightboxOpen(false)}
                items={preview ? [{ src: preview, alt: 'Preview Poster Event', title: 'Preview Poster Event' }] : []}
                currentIndex={0}
            />
        </div>
    )
}
