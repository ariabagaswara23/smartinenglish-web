'use server'

import { createClient } from '@/utils/supabase/server'
import { galleryItemFormSchema } from '@/schemas/gallery'
import { revalidatePath } from 'next/cache'
import type { GalleryItemWithEvent, FeaturedEvent, Event } from '@/types/gallery'

// ─── READ ──────────────────────────────────────────────────

export async function getGalleryItems(): Promise<GalleryItemWithEvent[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('gallery_items')
        .select(`
            *,
            event:events!event_id (
                id,
                title,
                badge
            )
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching gallery items:', error)
        throw new Error('Gagal mengambil data gallery')
    }

    return data as GalleryItemWithEvent[]
}

export async function getEvents(): Promise<Pick<Event, 'id' | 'title' | 'badge'>[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('events')
        .select('id, title, badge')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching events:', error)
        throw new Error('Gagal mengambil data events')
    }

    return data as Pick<Event, 'id' | 'title' | 'badge'>[]
}

export async function getFeaturedEvents(): Promise<FeaturedEvent[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('events')
        .select('id, title, description, src, alt, badge')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching featured events:', error)
        throw new Error('Gagal mengambil data featured events')
    }

    return data as FeaturedEvent[]
}

// ─── CREATE ────────────────────────────────────────────────

export async function createGalleryItem(payload: unknown) {
    const supabase = await createClient()

    const parsed = galleryItemFormSchema.safeParse(payload)
    if (!parsed.success) {
        return { success: false, error: 'Data tidak valid' }
    }

    const { data, error } = await supabase
        .from('gallery_items')
        .insert(parsed.data)
        .select()
        .single()

    if (error) {
        console.error('Error creating gallery item:', error)
        return { success: false, error: error.message || 'Gagal menambahkan foto' }
    }

    revalidatePath('/admin/gallery')
    revalidatePath('/gallery')
    return { success: true, data }
}

// ─── UPDATE ────────────────────────────────────────────────

export async function updateGalleryItem(id: string, payload: unknown) {
    const supabase = await createClient()

    const parsed = galleryItemFormSchema.safeParse(payload)
    if (!parsed.success) {
        return { success: false, error: 'Data tidak valid' }
    }

    const { data, error } = await supabase
        .from('gallery_items')
        .update(parsed.data)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error updating gallery item:', error)
        return { success: false, error: error.message || 'Gagal memperbarui foto' }
    }

    revalidatePath('/admin/gallery')
    revalidatePath('/gallery')
    return { success: true, data }
}

// ─── DELETE ────────────────────────────────────────────────

export async function deleteGalleryItem(id: string, imageUrl?: string | null) {
    const supabase = await createClient()

    // Hapus file dari Supabase Storage
    if (imageUrl) {
        try {
            const url = new URL(imageUrl)
            const pathSegments = url.pathname.split('/')
            const bucketIndex = pathSegments.indexOf('gallery-images')
            if (bucketIndex !== -1) {
                const filePath = pathSegments.slice(bucketIndex + 1).join('/')
                if (filePath) {
                    const { error: storageError } = await supabase.storage
                        .from('gallery-images')
                        .remove([filePath])

                    if (storageError) {
                        console.error('Error deleting image from storage:', storageError)
                        // Tetap lanjut hapus record DB
                    }
                }
            }
        } catch (e) {
            console.error('Invalid image URL format', e)
        }
    }

    const { error } = await supabase
        .from('gallery_items')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting gallery item:', error)
        return { success: false, error: 'Gagal menghapus foto' }
    }

    revalidatePath('/admin/gallery')
    revalidatePath('/gallery')
    return { success: true }
}

// ─── STORAGE UPLOAD ────────────────────────────────────────

export async function uploadGalleryImage(formData: FormData) {
    const supabase = await createClient()

    const file = formData.get('file') as File
    if (!file) {
        return { success: false, error: 'File tidak ditemukan' }
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
        return { success: false, error: 'Format file tidak didukung. Gunakan JPG, PNG, atau WebP.' }
    }

    // Validate file size (max 3MB)
    if (file.size > 3 * 1024 * 1024) {
        return { success: false, error: 'Ukuran file melebihi batas 3MB.' }
    }

    // Generate unique filename
    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`

    const { error: uploadError } = await supabase.storage
        .from('gallery-images')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
        })

    if (uploadError) {
        console.error('Error uploading gallery image:', uploadError)
        return { success: false, error: 'Gagal mengupload gambar' }
    }

    const { data: urlData } = supabase.storage
        .from('gallery-images')
        .getPublicUrl(fileName)

    return { success: true, url: urlData.publicUrl }
}

// ─── STORAGE DELETE (helper for image replacement) ─────────

export async function deleteGalleryImageFromStorage(imageUrl: string) {
    const supabase = await createClient()

    try {
        const url = new URL(imageUrl)
        const pathSegments = url.pathname.split('/')
        const bucketIndex = pathSegments.indexOf('gallery-images')
        if (bucketIndex !== -1) {
            const filePath = pathSegments.slice(bucketIndex + 1).join('/')
            if (filePath) {
                const { error } = await supabase.storage
                    .from('gallery-images')
                    .remove([filePath])

                if (error) {
                    console.error('Error deleting image from storage:', error)
                    return { success: false, error: 'Gagal menghapus gambar dari storage' }
                }
            }
        }
    } catch (e) {
        console.error('Invalid image URL format', e)
        return { success: false, error: 'Format URL gambar tidak valid' }
    }

    return { success: true }
}
