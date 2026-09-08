'use client'

import * as React from 'react'
import Image from 'next/image'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getEvents, deleteEvent, toggleFeaturedEvent } from '@/app/admin/events/actions'
import type { Event } from '@/types/event'
import { EventFormDialog } from './EventFormDialog'
import { ImageLightbox, type LightboxItem } from '@/components/ui/image-lightbox'
import { toast } from '@/components/ui/toast'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
    Calendar,
    Plus,
    Search,
    Edit2,
    Trash2,
    Sparkles,
    Image as ImageIcon,
    Loader2,
    CalendarCheck2,
    Layers,
    ZoomIn,
} from 'lucide-react'

type FilterTab = 'all' | 'featured' | 'regular'

function formatDateIndo(dateStr: string) {
    if (!dateStr) return '-'
    try {
        const date = new Date(dateStr)
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }).format(date)
    } catch {
        return dateStr
    }
}

export function EventsTable() {
    const queryClient = useQueryClient()

    // ── State ────────────────────────────────────────────────
    const [searchQuery, setSearchQuery] = React.useState('')
    const [filterTab, setFilterTab] = React.useState<FilterTab>('all')
    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [eventToEdit, setEventToEdit] = React.useState<Event | null>(null)
    const [eventToDelete, setEventToDelete] = React.useState<Event | null>(null)
    const [togglingId, setTogglingId] = React.useState<string | null>(null)
    const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null)

    // ── Query ────────────────────────────────────────────────
    const { data: events = [], isLoading, isError, error } = useQuery({
        queryKey: ['events'],
        queryFn: getEvents,
    })

    // ── Mutations ────────────────────────────────────────────
    const toggleFeaturedMutation = useMutation({
        mutationFn: async ({ id, isFeatured }: { id: string; isFeatured: boolean }) => {
            setTogglingId(id)
            const res = await toggleFeaturedEvent(id, isFeatured)
            if (!res.success) throw new Error(res.error)
            return { id, isFeatured }
        },
        onSuccess: (variables) => {
            queryClient.invalidateQueries({ queryKey: ['events'] })
            toast.add({
                title: 'Status Diperbarui',
                description: variables.isFeatured
                    ? 'Event kini diatur sebagai Featured.'
                    : 'Event tidak lagi berstatus Featured.',
                type: 'success',
            })
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (err: any) => {
            toast.add({
                title: 'Gagal Mengubah Status',
                description: err.message || 'Terjadi kesalahan saat memperbarui status featured.',
                type: 'error',
            })
        },
        onSettled: () => {
            setTogglingId(null)
        },
    })

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await deleteEvent(id)
            if (!res.success) throw new Error(res.error)
            return res
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] })
            toast.add({
                title: 'Event Dihapus',
                description: `Event "${eventToDelete?.title}" beserta posternya berhasil dihapus.`,
                type: 'success',
            })
            setEventToDelete(null)
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (err: any) => {
            toast.add({
                title: 'Gagal Menghapus',
                description: err.message || 'Terjadi gangguan saat menghapus event.',
                type: 'error',
            })
        },
    })

    // ── Filtered Data & Stats ────────────────────────────────
    const eventList = (events || []) as Event[]
    const totalCount = eventList.length
    const featuredCount = eventList.filter((e) => e.is_featured).length
    const withPosterCount = eventList.filter((e) => Boolean(e.src)).length

    const filteredEvents = React.useMemo<Event[]>(() => {
        return eventList.filter((event) => {
            const query = searchQuery.toLowerCase().trim()
            const matchesQuery =
                !query ||
                event.title.toLowerCase().includes(query) ||
                (event.badge && event.badge.toLowerCase().includes(query)) ||
                (event.description && event.description.toLowerCase().includes(query))

            let matchesTab = true
            if (filterTab === 'featured') matchesTab = event.is_featured === true
            if (filterTab === 'regular') matchesTab = event.is_featured === false

            return matchesQuery && matchesTab
        })
    }, [eventList, searchQuery, filterTab])

    const eventsWithPoster = React.useMemo(() => {
        return filteredEvents.filter((e) => Boolean(e.src))
    }, [filteredEvents])

    const lightboxItems: LightboxItem[] = React.useMemo(() => {
        return eventsWithPoster.map((e) => ({
            src: e.src!,
            alt: e.alt || e.title,
            title: e.title,
            badge: e.badge,
            isFeatured: e.is_featured,
        }))
    }, [eventsWithPoster])

    const handleOpenCreate = () => {
        setEventToEdit(null)
        setIsFormOpen(true)
    }

    const handleOpenEdit = (event: Event) => {
        setEventToEdit(event)
        setIsFormOpen(true)
    }

    const handleDeleteConfirm = () => {
        if (!eventToDelete) return
        deleteMutation.mutate(eventToDelete.id)
    }

    return (
        <div className="space-y-6">
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Total Event
                        </p>
                        <p className="text-2xl font-bold text-slate-900 mt-0.5">{totalCount}</p>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Featured Event
                        </p>
                        <p className="text-2xl font-bold text-slate-900 mt-0.5">{featuredCount}</p>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                        <CalendarCheck2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Dengan Poster
                        </p>
                        <p className="text-2xl font-bold text-slate-900 mt-0.5">{withPosterCount}</p>
                    </div>
                </div>
            </div>

            {/* Actions Bar & Filters */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                    {/* Search Input */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Cari event atau badge..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-10 rounded-xl bg-slate-50/50 border-slate-200 text-sm focus-visible:ring-blue-500"
                        />
                    </div>

                    {/* Filter Tabs */}
                    <div className="inline-flex p-1 bg-slate-100 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setFilterTab('all')}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                filterTab === 'all'
                                    ? 'bg-white text-slate-900 shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            Semua ({totalCount})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterTab('featured')}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                filterTab === 'featured'
                                    ? 'bg-white text-amber-700 shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            Featured ({featuredCount})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterTab('regular')}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                filterTab === 'regular'
                                    ? 'bg-white text-slate-900 shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            Reguler ({totalCount - featuredCount})
                        </button>
                    </div>
                </div>

                {/* Add Event Button */}
                <Button
                    onClick={handleOpenCreate}
                    className="rounded-xl bg-[#2546a1] hover:bg-[#1d3780] text-white shadow-md shadow-blue-500/20 gap-2 h-10 px-4"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Event
                </Button>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50/80">
                            <TableRow className="border-b border-slate-200">
                                <TableHead className="w-28 font-semibold text-slate-700">Poster</TableHead>
                                <TableHead className="font-semibold text-slate-700">Judul & Deskripsi</TableHead>
                                <TableHead className="w-40 font-semibold text-slate-700">Badge</TableHead>
                                <TableHead className="w-28 text-center font-semibold text-slate-700">
                                    Featured
                                </TableHead>
                                <TableHead className="w-36 font-semibold text-slate-700">
                                    Tanggal Dibuat
                                </TableHead>
                                <TableHead className="w-28 text-right font-semibold text-slate-700">
                                    Aksi
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-48 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                                            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                                            <span className="text-sm font-medium">Memuat data events...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : isError ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-48 text-center text-red-500">
                                        <p className="font-medium">
                                            Gagal memuat data:{' '}
                                            {(error as Error)?.message || 'Terjadi kesalahan'}
                                        </p>
                                    </TableCell>
                                </TableRow>
                            ) : filteredEvents.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-60 text-center">
                                        <div className="max-w-sm mx-auto flex flex-col items-center justify-center gap-3 text-slate-400 py-6">
                                            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                                                <Layers className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <p className="text-base font-semibold text-slate-800">
                                                    {searchQuery ? 'Tidak ada event yang cocok' : 'Belum ada data event'}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    {searchQuery
                                                        ? 'Coba gunakan kata kunci pencarian lain.'
                                                        : 'Mulai buat event pertama untuk menampilkan aktivitas lembaga.'}
                                                </p>
                                            </div>
                                            {!searchQuery && (
                                                <Button
                                                    onClick={handleOpenCreate}
                                                    variant="outline"
                                                    size="sm"
                                                    className="mt-2 rounded-xl gap-2 border-slate-200"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    Tambah Event Pertama
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredEvents.map((event: Event) => {
                                    const isToggling = togglingId === event.id
                                    return (
                                        <TableRow
                                            key={event.id}
                                            className="hover:bg-slate-50/60 transition-colors border-b border-slate-100 group"
                                        >
                                            {/* Poster Thumbnail */}
                                            <TableCell className="py-3.5">
                                                {event.src ? (
                                                    <div className="relative w-20 h-14 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs group/img">
                                                        <Image
                                                            src={event.src}
                                                            alt={event.alt || event.title}
                                                            fill
                                                            className="object-cover transition-transform group-hover/img:scale-105 duration-200"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const posterIdx = eventsWithPoster.findIndex((e) => e.id === event.id)
                                                                if (posterIdx !== -1) setLightboxIndex(posterIdx)
                                                            }}
                                                            className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                                                            title="Lihat ukuran penuh (Lightbox)"
                                                            aria-label="Lihat poster event ukuran penuh"
                                                        >
                                                            <ZoomIn className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="w-20 h-14 rounded-xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-slate-300">
                                                        <ImageIcon className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </TableCell>

                                            {/* Title & Description */}
                                            <TableCell className="py-3.5">
                                                <div className="space-y-1 max-w-md">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-slate-900 leading-tight">
                                                            {event.title}
                                                        </span>
                                                        {event.is_featured && (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                                <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                                                                Featured
                                                            </span>
                                                        )}
                                                    </div>
                                                    {event.description ? (
                                                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                                            {event.description}
                                                        </p>
                                                    ) : (
                                                        <p className="text-xs text-slate-400 italic">
                                                            Tanpa deskripsi
                                                        </p>
                                                    )}
                                                </div>
                                            </TableCell>

                                            {/* Badge */}
                                            <TableCell className="py-3.5">
                                                {event.badge ? (
                                                    <Badge
                                                        variant="outline"
                                                        className="font-medium bg-blue-50/60 text-blue-700 border-blue-200 text-xs px-2.5 py-0.5 rounded-lg"
                                                    >
                                                        {event.badge}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-xs text-slate-400">—</span>
                                                )}
                                            </TableCell>

                                            {/* Switch Toggle (is_featured) */}
                                            <TableCell className="py-3.5 text-center">
                                                <div className="inline-flex items-center justify-center">
                                                    {isToggling ? (
                                                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                                    ) : (
                                                        <Switch
                                                            checked={event.is_featured}
                                                            onCheckedChange={(checked) =>
                                                                toggleFeaturedMutation.mutate({
                                                                    id: event.id,
                                                                    isFeatured: checked,
                                                                })
                                                            }
                                                            title={
                                                                event.is_featured
                                                                    ? 'Klik untuk nonaktifkan featured'
                                                                    : 'Klik untuk jadikan featured'
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            </TableCell>

                                            {/* Tanggal Dibuat */}
                                            <TableCell className="py-3.5 text-xs text-slate-600 font-medium whitespace-nowrap">
                                                {formatDateIndo(event.created_at)}
                                            </TableCell>

                                            {/* Actions */}
                                            <TableCell className="py-3.5 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleOpenEdit(event)}
                                                        className="h-8 w-8 p-0 rounded-lg text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/50"
                                                        title="Edit Event"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setEventToDelete(event)}
                                                        className="h-8 w-8 p-0 rounded-lg text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50/50"
                                                        title="Hapus Event"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Modal Form Dialog */}
            <EventFormDialog
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                eventToEdit={eventToEdit}
            />

            {/* Alert Dialog Delete Confirmation */}
            <AlertDialog
                open={Boolean(eventToDelete)}
                onOpenChange={(open) => !open && !deleteMutation.isPending && setEventToDelete(null)}
            >
                <AlertDialogContent className="rounded-2xl max-w-md p-6 bg-white">
                    <AlertDialogHeader className="space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
                            <Trash2 className="w-5 h-5" />
                        </div>
                        <AlertDialogTitle className="text-lg font-bold text-slate-900">
                            Hapus Event?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-slate-600 leading-relaxed">
                            Apakah Anda yakin ingin menghapus event{' '}
                            <span className="font-semibold text-slate-900">
                                &quot;{eventToDelete?.title}&quot;
                            </span>
                            ? File poster di storage dan data event akan dihapus secara permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4 flex items-center justify-end gap-2.5">
                        <AlertDialogCancel
                            disabled={deleteMutation.isPending}
                            className="rounded-xl border-slate-200 hover:bg-slate-100"
                        >
                            Batal
                        </AlertDialogCancel>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteConfirm}
                            disabled={deleteMutation.isPending}
                            className="rounded-xl bg-red-600 hover:bg-red-700 min-w-[90px]"
                        >
                            {deleteMutation.isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                                    <span>Menghapus...</span>
                                </>
                            ) : (
                                'Hapus'
                            )}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Lightbox Modal */}
            <ImageLightbox
                isOpen={lightboxIndex !== null}
                onClose={() => setLightboxIndex(null)}
                items={lightboxItems}
                currentIndex={lightboxIndex ?? 0}
            />
        </div>
    )
}
