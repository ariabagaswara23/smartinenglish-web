'use client'

import * as React from 'react'
import Image from 'next/image'
import { UploadCloud, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { toast } from '@/components/ui/toast'
import { uploadGalleryImage, deleteGalleryImageFromStorage } from '@/app/admin/gallery/actions'

interface ImageUploaderProps {
    currentImageUrl: string | null
    onImageUploaded: (url: string) => void
    onImageRemoved: () => void
    disabled?: boolean
}

export function ImageUploader({ currentImageUrl, onImageUploaded, onImageRemoved, disabled }: ImageUploaderProps) {
    const [preview, setPreview] = React.useState<string | null>(currentImageUrl)
    const [isUploading, setIsUploading] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPreview(currentImageUrl)
    }, [currentImageUrl])

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Client-side validations
        if (file.size > 3 * 1024 * 1024) {
            toast.add({ title: 'File terlalu besar', description: 'Maksimal ukuran file adalah 3MB', type: 'warning' })
            return
        }
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            toast.add({ title: 'Format tidak didukung', description: 'Hanya menerima JPG, PNG, dan WebP', type: 'warning' })
            return
        }

        // Show preview immediately
        setPreview(URL.createObjectURL(file))
        setIsUploading(true)

        try {
            // If there's an existing image in storage, delete it first
            if (currentImageUrl && currentImageUrl.includes('gallery-images')) {
                await deleteGalleryImageFromStorage(currentImageUrl)
            }

            const formData = new FormData()
            formData.append('file', file)

            const result = await uploadGalleryImage(formData)

            if (!result.success) {
                toast.add({ title: 'Gagal upload', description: result.error || 'Terjadi kesalahan', type: 'error' })
                setPreview(currentImageUrl) // Revert preview
                return
            }

            onImageUploaded(result.url!)
            toast.add({ title: 'Berhasil', description: 'Gambar berhasil diupload', type: 'success' })
        } catch {
            toast.add({ title: 'Gagal upload', description: 'Terjadi kesalahan saat mengupload gambar', type: 'error' })
            setPreview(currentImageUrl) // Revert preview
        } finally {
            setIsUploading(false)
        }
    }

    const handleRemove = () => {
        setPreview(null)
        onImageRemoved()
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <div className="space-y-2">
            <label className="text-sm font-semibold text-black">Gambar *</label>
            <div className="flex items-start gap-4">
                {preview ? (
                    <div className="relative w-32 h-24 rounded-xl overflow-hidden border border-slate-200 group">
                        <Image src={preview} alt="Preview" fill className="object-cover" />
                        {isUploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <Loader2 className="w-6 h-6 text-white animate-spin" />
                            </div>
                        )}
                        {!isUploading && !disabled && (
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center transition-all"
                            >
                                <X className="w-6 h-6 text-white" />
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="w-32 h-24 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-slate-300" />
                    </div>
                )}

                <div className="flex-1">
                    <label className={`cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors ${(isUploading || disabled) ? 'opacity-50 pointer-events-none' : ''}`}>
                        <UploadCloud className="w-4 h-4 text-slate-500" />
                        {isUploading ? 'Mengupload...' : 'Pilih File'}
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleFileChange}
                            disabled={isUploading || disabled}
                        />
                    </label>
                    <p className="text-xs text-slate-500 mt-2">Format: JPG, PNG, WebP. Maks: 3MB.</p>
                </div>
            </div>
        </div>
    )
}
