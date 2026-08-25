'use client'

import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getGalleryItems, getEvents } from '@/app/admin/gallery/actions'
import { GalleryItemWithEvent, GALLERY_CATEGORIES } from '@/types/gallery'
import { GalleryItemCard } from './GalleryItemCard'
import { GalleryFormDialog } from './GalleryFormDialog'
import { GalleryDeleteDialog } from './GalleryDeleteDialog'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Plus, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react'

const ITEMS_PER_PAGE = 12

export function GalleryAdminGrid() {
    // ── State ────────────────────────────────────────────────
    const [categoryFilter, setCategoryFilter] = React.useState<string>('Semua')
    const [eventFilter, setEventFilter] = React.useState<string>('__all__')
    const [currentPage, setCurrentPage] = React.useState(1)
    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [editItem, setEditItem] = React.useState<GalleryItemWithEvent | null>(null)
    const [deleteItem, setDeleteItem] = React.useState<GalleryItemWithEvent | null>(null)

    // ── Queries ──────────────────────────────────────────────
    const { data: galleryItems, isLoading: isLoadingGallery } = useQuery({
        queryKey: ['gallery'],
        queryFn: getGalleryItems,
    })

    const { data: events, isLoading: isLoadingEvents } = useQuery({
        queryKey: ['events'],
        queryFn: getEvents,
    })

    // ── Filtering ────────────────────────────────────────────
    const filteredItems = React.useMemo(() => {
        if (!galleryItems) return []
        let items = galleryItems as GalleryItemWithEvent[]

        if (categoryFilter !== 'Semua') {
            items = items.filter(item => item.category === categoryFilter)
        }

        if (eventFilter !== '__all__') {
            if (eventFilter === '__none__') {
                items = items.filter(item => !item.event_id)
            } else {
                items = items.filter(item => item.event_id === eventFilter)
            }
        }

        return items
    }, [galleryItems, categoryFilter, eventFilter])

    const eventFilterOptions = React.useMemo(() => [
        { value: '__all__', label: 'Semua Event' },
        { value: '__none__', label: 'Tanpa Event' },
        ...(events?.map((event: { id: string; title: string; badge: string }) => ({
            value: event.id,
            label: event.title,
        })) || []),
    ], [events])

    // ── Pagination ───────────────────────────────────────────
    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE)
    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    // Reset page when filters change
    React.useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentPage(1)
    }, [categoryFilter, eventFilter])

    // ── Handlers ─────────────────────────────────────────────
    const handleCreate = () => {
        setEditItem(null)
        setIsFormOpen(true)
    }

    const handleEdit = (item: GalleryItemWithEvent) => {
        setEditItem(item)
        setIsFormOpen(true)
    }

    const handleDelete = (item: GalleryItemWithEvent) => {
        setDeleteItem(item)
    }

    const handleCloseForm = () => {
        setIsFormOpen(false)
        setEditItem(null)
    }

    const handleCloseDelete = () => {
        setDeleteItem(null)
    }

    // ── Render ───────────────────────────────────────────────
    const isLoading = isLoadingGallery || isLoadingEvents

    return (
        <div className="space-y-6">
            {/* Toolbar: Filters + Create Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-wrap items-center gap-3">
                    {/* Category Filter */}
                    <Select value={categoryFilter} onValueChange={(val) => setCategoryFilter(val ?? 'Semua')}>
                        <SelectTrigger className="w-[170px] bg-white">
                            <SelectValue placeholder="Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                            {GALLERY_CATEGORIES.map((cat) => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Event Filter */}
                    <Select
                        items={eventFilterOptions}
                        value={eventFilter}
                        onValueChange={(val) => setEventFilter(val ?? '__all__')}
                    >
                        <SelectTrigger className="w-[200px] bg-white">
                            <SelectValue placeholder="Filter Event" />
                        </SelectTrigger>
                        <SelectContent>
                            {eventFilterOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Button
                    onClick={handleCreate}
                    className="bg-[#2546a1] hover:bg-[#1a347d] text-white gap-2 px-5 py-2.5 text-sm"
                >
                    <Plus className="w-4 h-4" />
                    Upload Foto Baru
                </Button>
            </div>

            {/* Gallery Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-white border border-slate-100 rounded-2xl overflow-hidden animate-pulse">
                            <div className="aspect-[4/3] bg-slate-200" />
                            <div className="p-4 space-y-2.5">
                                <div className="h-4 bg-slate-200 rounded w-3/4" />
                                <div className="h-5 bg-slate-100 rounded-full w-20" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : paginatedItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-100 rounded-2xl">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
                        <ImageIcon className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-medium mb-1">Belum ada foto gallery</p>
                    <p className="text-slate-400 text-sm mb-5">
                        {categoryFilter !== 'Semua' || eventFilter !== '__all__'
                            ? 'Tidak ada foto untuk filter yang dipilih.'
                            : 'Mulai dengan mengupload foto pertama.'
                        }
                    </p>
                    {categoryFilter === 'Semua' && eventFilter === '__all__' && (
                        <Button
                            onClick={handleCreate}
                            variant="outline"
                            className="gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Upload Foto
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {paginatedItems.map((item) => (
                        <GalleryItemCard
                            key={item.id}
                            item={item}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="h-9 w-9 p-0"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>

                    {Array.from({ length: totalPages }).map((_, i) => (
                        <Button
                            key={i}
                            variant={currentPage === i + 1 ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCurrentPage(i + 1)}
                            className={`h-9 w-9 p-0 text-sm ${
                                currentPage === i + 1
                                    ? 'bg-[#2546a1] hover:bg-[#1a347d] text-white'
                                    : ''
                            }`}
                        >
                            {i + 1}
                        </Button>
                    ))}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="h-9 w-9 p-0"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            )}

            {/* Item count */}
            {!isLoading && filteredItems.length > 0 && (
                <p className="text-center text-xs text-slate-400">
                    Menampilkan {paginatedItems.length} dari {filteredItems.length} foto
                </p>
            )}

            {/* Dialogs */}
            <GalleryFormDialog
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                itemToEdit={editItem}
                events={events || []}
            />

            <GalleryDeleteDialog
                isOpen={!!deleteItem}
                onClose={handleCloseDelete}
                item={deleteItem}
            />
        </div>
    )
}
