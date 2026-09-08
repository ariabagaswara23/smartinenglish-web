'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { eventFormSchema, EventFormValues } from '@/schemas/event-schema'
import { createEvent, updateEvent } from '@/app/admin/events/actions'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Event } from '@/types/event'
import { toast } from '@/components/ui/toast'
import { EventImageUploader } from './EventImageUploader'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Loader2, Sparkles, Tag, Type, AlignLeft } from 'lucide-react'

interface EventFormDialogProps {
    isOpen: boolean
    onClose: () => void
    eventToEdit?: Event | null
}

export function EventFormDialog({ isOpen, onClose, eventToEdit }: EventFormDialogProps) {
    const queryClient = useQueryClient()
    const isEditMode = Boolean(eventToEdit)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<EventFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(eventFormSchema) as any,
        defaultValues: {
            title: '',
            badge: '',
            description: '',
            alt: '',
            is_featured: false,
            src: '',
        },
    })

    const isFeaturedValue = watch('is_featured')
    const currentSrc = watch('src')

    React.useEffect(() => {
        if (isOpen) {
            if (eventToEdit) {
                reset({
                    title: eventToEdit.title,
                    badge: eventToEdit.badge || '',
                    description: eventToEdit.description || '',
                    alt: eventToEdit.alt || '',
                    is_featured: eventToEdit.is_featured,
                    src: eventToEdit.src || '',
                })
            } else {
                reset({
                    title: '',
                    badge: '',
                    description: '',
                    alt: '',
                    is_featured: false,
                    src: '',
                })
            }
        }
    }, [isOpen, eventToEdit, reset])

    const mutation = useMutation({
        mutationFn: async (data: EventFormValues) => {
            if (isEditMode && eventToEdit) {
                const res = await updateEvent(eventToEdit.id, data)
                if (!res.success) throw new Error(res.error)
                return res
            } else {
                const res = await createEvent(data)
                if (!res.success) throw new Error(res.error)
                return res
            }
        },
        onSuccess: (_res, variables) => {
            queryClient.invalidateQueries({ queryKey: ['events'] })
            toast.add({
                title: isEditMode ? 'Event Diperbarui' : 'Event Ditambahkan',
                description: `Event "${variables.title}" berhasil ${isEditMode ? 'diperbarui' : 'disimpan'}.`,
                type: 'success',
            })
            onClose()
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
            toast.add({
                title: 'Gagal Menyimpan',
                description: error.message || 'Terjadi kesalahan saat menyimpan event.',
                type: 'error',
            })
        },
    })

    const onSubmit = (data: EventFormValues) => {
        mutation.mutate({
            ...data,
            alt: data.alt || data.title,
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[620px] max-h-[92vh] overflow-y-auto p-6 rounded-2xl bg-white">
                <DialogHeader className="space-y-1.5 pb-3 border-b border-slate-100">
                    <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
                            <Sparkles className="w-5 h-5" />
                        </span>
                        {isEditMode ? 'Edit Data Event' : 'Tambah Event Baru'}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-slate-500">
                        {isEditMode
                            ? 'Perbarui rincian, poster, atau status featured event ini.'
                            : 'Isi formulir di bawah untuk menambahkan event kegiatan baru.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-4">
                    {/* Judul Event */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                            <Type className="w-4 h-4 text-slate-400" />
                            Judul Event <span className="text-red-500">*</span>
                        </label>
                        <Input
                            {...register('title')}
                            placeholder="Contoh: SMILE FEST 2026"
                            className={`h-11 rounded-xl bg-white border-slate-200 text-slate-900 focus-visible:ring-blue-500 ${
                                errors.title ? 'border-red-500' : ''
                            }`}
                        />
                        {errors.title && (
                            <p className="text-xs font-medium text-red-500">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Badge Pill */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                            <Tag className="w-4 h-4 text-slate-400" />
                            Badge / Label Kategori
                        </label>
                        <Input
                            {...register('badge')}
                            placeholder="Contoh: Event Tahunan, Special Event, Workshop"
                            className="h-11 rounded-xl bg-white border-slate-200 text-slate-900 focus-visible:ring-blue-500"
                        />
                        <p className="text-xs text-slate-500">
                            Teks label kecil yang muncul sebagai sorotan di atas judul event.
                        </p>
                    </div>

                    {/* Deskripsi Event */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                            <AlignLeft className="w-4 h-4 text-slate-400" />
                            Deskripsi Singkat
                        </label>
                        <Textarea
                            {...register('description')}
                            rows={4}
                            placeholder="Tuliskan gambaran singkat tentang kegiatan, perlombaan, atau aktivitas event..."
                            className="resize-none rounded-xl bg-white border-slate-200 text-slate-900 focus-visible:ring-blue-500 text-sm leading-relaxed"
                        />
                    </div>

                    {/* Poster Uploader */}
                    <div className="pt-1">
                        <EventImageUploader
                            currentImageUrl={currentSrc}
                            onImageUploaded={(url) => {
                                setValue('src', url)
                                if (!watch('alt')) {
                                    setValue('alt', watch('title') || 'Poster Event')
                                }
                            }}
                            onImageRemoved={() => setValue('src', '')}
                            disabled={mutation.isPending}
                        />
                    </div>

                    {/* Alt Text (SEO & Aksesibilitas) */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-600">
                            Alt Text Gambar (Opsional)
                        </label>
                        <Input
                            {...register('alt')}
                            placeholder="Deskripsi gambar untuk aksesibilitas dan SEO"
                            className="h-9 text-xs rounded-lg bg-slate-50/70 border-slate-200 text-slate-700"
                        />
                    </div>

                    {/* Toggle Featured */}
                    <div className="flex items-center justify-between rounded-xl border border-slate-200/80 p-4 bg-slate-50/60 transition-colors hover:bg-slate-50">
                        <div className="space-y-0.5 pr-4">
                            <label
                                htmlFor="is-featured-switch"
                                className="text-sm font-semibold text-slate-900 cursor-pointer block"
                            >
                                Jadikan Featured Event
                            </label>
                            <p className="text-xs text-slate-500 leading-normal">
                                Event dengan status featured akan diprioritaskan tampil pada homepage atau bagian sorotan utama.
                            </p>
                        </div>
                        <Switch
                            id="is-featured-switch"
                            checked={Boolean(isFeaturedValue)}
                            onCheckedChange={(checked) => setValue('is_featured', checked)}
                            disabled={mutation.isPending}
                        />
                    </div>

                    <DialogFooter className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={mutation.isPending}
                            className="rounded-xl border-slate-200 hover:bg-slate-100"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={mutation.isPending}
                            className="rounded-xl bg-[#2546a1] hover:bg-[#1d3780] text-white shadow-md shadow-blue-500/20 gap-2 min-w-[120px]"
                        >
                            {mutation.isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Menyimpan...</span>
                                </>
                            ) : (
                                <span>{isEditMode ? 'Simpan Perubahan' : 'Tambah Event'}</span>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
