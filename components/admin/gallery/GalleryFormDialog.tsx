'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm as useReactHookForm } from 'react-hook-form'
import { galleryItemFormSchema, GalleryItemFormValues } from '@/schemas/gallery'
import { createGalleryItem, updateGalleryItem } from '@/app/admin/gallery/actions'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { GalleryItemWithEvent } from '@/types/gallery'
import { GALLERY_CATEGORIES } from '@/types/gallery'
import { toast } from '@/components/ui/toast'
import { ImageUploader } from './ImageUploader'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

interface GalleryFormDialogProps {
    isOpen: boolean
    onClose: () => void
    itemToEdit?: GalleryItemWithEvent | null
    events: { id: string; title: string; badge: string }[]
}

export function GalleryFormDialog({ isOpen, onClose, itemToEdit, events }: GalleryFormDialogProps) {
    const queryClient = useQueryClient()
    const isEditMode = !!itemToEdit

    const categoryOptions = GALLERY_CATEGORIES.filter(c => c !== 'Semua')

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useReactHookForm<GalleryItemFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(galleryItemFormSchema) as any,
        defaultValues: {
            src: '',
            alt: '',
            caption: '',
            category: '',
            event_id: null,
        },
    })

    // eslint-disable-next-line react-hooks/incompatible-library
    const categoryValue = watch('category')
    const eventIdValue = watch('event_id')

    const eventSelectOptions = React.useMemo(() => [
        { value: '__none__', label: '— Tanpa Event —' },
        ...events.map((event) => ({ value: event.id, label: event.title })),
    ], [events])

    React.useEffect(() => {
        if (isOpen) {
            if (itemToEdit) {
                reset({
                    src: itemToEdit.src,
                    alt: itemToEdit.alt,
                    caption: itemToEdit.caption,
                    category: itemToEdit.category,
                    event_id: itemToEdit.event_id || null,
                })
            } else {
                reset({
                    src: '',
                    alt: '',
                    caption: '',
                    category: '',
                    event_id: null,
                })
            }
        }
    }, [isOpen, itemToEdit, reset])

    const mutation = useMutation({
        mutationFn: async (data: GalleryItemFormValues) => {
            if (isEditMode && itemToEdit) {
                const res = await updateGalleryItem(itemToEdit.id, data)
                if (!res.success) throw new Error(res.error)
                return res
            } else {
                const res = await createGalleryItem(data)
                if (!res.success) throw new Error(res.error)
                return res
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gallery'] })
            toast.add({
                title: isEditMode ? 'Berhasil diperbarui' : 'Berhasil ditambahkan',
                description: `Foto gallery ${isEditMode ? 'diperbarui' : 'ditambahkan'}.`,
                type: 'success',
            })
            onClose()
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
            toast.add({
                title: 'Terjadi kesalahan',
                description: error.message || 'Gagal menyimpan data',
                type: 'error',
            })
        }
    })

    const onSubmit = (data: GalleryItemFormValues) => {
        if (!data.src) {
            toast.add({ title: 'Gambar wajib diisi', description: 'Silakan upload gambar terlebih dahulu', type: 'warning' })
            return
        }
        mutation.mutate({
            ...data,
            alt: data.caption || data.alt || '',
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="font-bold text-2xl">
                        {isEditMode ? 'Edit Foto Gallery' : 'Upload Foto Gallery'}
                    </DialogTitle>
                    <hr />
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">

                    {/* Image Upload */}
                    <ImageUploader
                        currentImageUrl={watch('src') || null}
                        onImageUploaded={(url) => setValue('src', url, { shouldValidate: true })}
                        onImageRemoved={() => setValue('src', '', { shouldValidate: true })}
                        disabled={mutation.isPending}
                    />
                    {errors.src && <p className="text-xs text-destructive -mt-3">{errors.src.message}</p>}

                    {/* Caption */}
                    <div className="space-y-2">
                        <label className="text-sm text-slate-800">Caption *</label>
                        <Textarea
                            placeholder="Deskripsi singkat foto..."
                            className="resize-none h-20"
                            {...register('caption')}
                            aria-invalid={!!errors.caption}
                        />
                        {errors.caption && <p className="text-xs text-destructive">{errors.caption.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Category */}
                        <div className="space-y-2">
                            <label className="text-sm text-slate-800">Kategori *</label>
                            <Select
                                value={categoryValue}
                                onValueChange={(val) => {
                                    if (val) setValue('category', val, { shouldValidate: true })
                                }}
                            >
                                <SelectTrigger className="w-full" aria-invalid={!!errors.category}>
                                    <SelectValue placeholder="Pilih Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categoryOptions.map((cat) => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
                        </div>

                        {/* Event (optional) */}
                        <div className="space-y-2">
                            <label className="text-sm text-slate-800">
                                Event <span className="font-normal text-slate-400">(opsional)</span>
                            </label>
                            <Select
                                items={eventSelectOptions}
                                value={eventIdValue || '__none__'}
                                onValueChange={(val) => {
                                    setValue('event_id', val === '__none__' ? null : val, { shouldValidate: true })
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="— Tanpa Event —" />
                                </SelectTrigger>
                                <SelectContent>
                                    {eventSelectOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                        <Button type="button" variant="outline" onClick={onClose} disabled={mutation.isPending}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={mutation.isPending} className="bg-[#2546a1] hover:bg-[#1a347d] text-white">
                            {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {isEditMode ? 'Simpan Perubahan' : 'Upload & Simpan'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
