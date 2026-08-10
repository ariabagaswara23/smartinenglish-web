'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteGalleryItem } from '@/app/admin/gallery/actions'
import { GalleryItemWithEvent } from '@/types/gallery'
import { toast } from '@/components/ui/toast'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Loader2 } from 'lucide-react'

interface GalleryDeleteDialogProps {
    isOpen: boolean
    onClose: () => void
    item: GalleryItemWithEvent | null
}

export function GalleryDeleteDialog({ isOpen, onClose, item }: GalleryDeleteDialogProps) {
    const queryClient = useQueryClient()

    const deleteMutation = useMutation({
        mutationFn: async () => {
            if (!item) return
            const res = await deleteGalleryItem(item.id, item.src)
            if (!res.success) throw new Error(res.error)
            return res
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gallery'] })
            toast.add({
                title: 'Berhasil dihapus',
                description: 'Foto gallery telah dihapus dari database dan storage.',
                type: 'success',
            })
            onClose()
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
            toast.add({
                title: 'Gagal menghapus',
                description: error.message || 'Terjadi kesalahan saat menghapus foto',
                type: 'error',
            })
        },
    })

    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-lg font-bold">
                        Hapus Foto Gallery?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-500">
                        Foto ini akan dihapus permanen dari database dan storage.
                        Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleteMutation.isPending}>
                        Batal
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault()
                            deleteMutation.mutate()
                        }}
                        disabled={deleteMutation.isPending}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {deleteMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Ya, Hapus
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
