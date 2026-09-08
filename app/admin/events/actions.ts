/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { createClient } from '@/utils/supabase/server'
import { eventFormSchema } from '@/schemas/event-schema'
import { revalidatePath } from 'next/cache'
import type { Event, EventOption } from '@/types/event'

// ─── READ ──────────────────────────────────────────────────

export async function getEvents(): Promise<Event[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching events:', error)
        throw new Error('Gagal mengambil data events')
    }

    return (data || []) as Event[]
}

export async function getEventOptions(): Promise<EventOption[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('events')
        .select('id, title, badge')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching event options:', error)
        throw new Error('Gagal mengambil opsi event')
    }

    return (data || []) as EventOption[]
}

// ─── CREATE ────────────────────────────────────────────────

export async function createEvent(payload: unknown) {
    const supabase = await createClient()

    const parsed = eventFormSchema.safeParse(payload)
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0]?.message || 'Data tidak valid' }
    }

    const { data, error } = await supabase
        .from('events')
        .insert({
            title: parsed.data.title,
            description: parsed.data.description || null,
            badge: parsed.data.badge || null,
            alt: parsed.data.alt || parsed.data.title,
            is_featured: parsed.data.is_featured ?? false,
            src: parsed.data.src || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating event:', error)
        return { success: false, error: error.message || 'Gagal menambahkan event' }
    }

    revalidatePath('/admin/events')
    revalidatePath('/admin/gallery')
    revalidatePath('/gallery')
    revalidatePath('/')
    return { success: true, data: data as Event }
}

// ─── UPDATE ────────────────────────────────────────────────

export async function updateEvent(id: string, payload: unknown) {
    const supabase = await createClient()

    const parsed = eventFormSchema.safeParse(payload)
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0]?.message || 'Data tidak valid' }
    }

    const { data, error } = await supabase
        .from('events')
        .update({
            title: parsed.data.title,
            description: parsed.data.description || null,
            badge: parsed.data.badge || null,
            alt: parsed.data.alt || parsed.data.title,
            is_featured: parsed.data.is_featured ?? false,
            src: parsed.data.src || null,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error updating event:', error)
        return { success: false, error: error.message || 'Gagal memperbarui event' }
    }

    revalidatePath('/admin/events')
    revalidatePath('/admin/gallery')
    revalidatePath('/gallery')
    revalidatePath('/')
    return { success: true, data: data as Event }
}

// ─── DELETE ────────────────────────────────────────────────

export async function deleteEvent(id: string) {
    const supabase = await createClient()

    // 1. Ambil event terlebih dahulu untuk mengecek apakah ada poster
    const { data: event, error: fetchError } = await supabase
        .from('events')
        .select('src')
        .eq('id', id)
        .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching event for deletion:', fetchError)
    }

    // 2. Hapus file poster dari Supabase Storage jika ada
    if (event?.src) {
        await deleteEventPosterFromStorage(event.src)
    }

    // 3. Hapus baris event dari database
    const { error: deleteError } = await supabase
        .from('events')
        .delete()
        .eq('id', id)

    if (deleteError) {
        console.error('Error deleting event:', deleteError)
        return { success: false, error: deleteError.message || 'Gagal menghapus event' }
    }

    revalidatePath('/admin/events')
    revalidatePath('/admin/gallery')
    revalidatePath('/gallery')
    revalidatePath('/')
    return { success: true }
}

// ─── TOGGLE FEATURED ───────────────────────────────────────

export async function toggleFeaturedEvent(id: string, isFeatured: boolean) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('events')
        .update({
            is_featured: isFeatured,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)

    if (error) {
        console.error('Error toggling featured event status:', error)
        return { success: false, error: error.message || 'Gagal mengubah status featured' }
    }

    revalidatePath('/admin/events')
    revalidatePath('/gallery')
    revalidatePath('/')
    return { success: true }
}

// ─── STORAGE: UPLOAD POSTER ────────────────────────────────

export async function uploadEventPoster(formData: FormData) {
    const supabase = await createClient()

    const file = formData.get('file') as File
    if (!file) {
        return { success: false, error: 'File poster tidak ditemukan' }
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
        return { success: false, error: 'Format file tidak didukung. Gunakan JPG, PNG, atau WebP.' }
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        return { success: false, error: 'Ukuran file melebihi batas 5MB.' }
    }

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'webp'
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`

    const { error: uploadError } = await supabase.storage
        .from('event-posters')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
        })

    if (uploadError) {
        console.error('Error uploading event poster:', uploadError)
        return { success: false, error: uploadError.message || 'Gagal mengupload poster ke storage' }
    }

    const { data: urlData } = supabase.storage
        .from('event-posters')
        .getPublicUrl(fileName)

    return { success: true, url: urlData.publicUrl }
}

// ─── STORAGE: DELETE POSTER ────────────────────────────────

export async function deleteEventPosterFromStorage(imageUrl: string) {
    const supabase = await createClient()

    try {
        const url = new URL(imageUrl)
        const pathSegments = url.pathname.split('/')
        const bucketIndex = pathSegments.indexOf('event-posters')
        if (bucketIndex !== -1) {
            const filePath = pathSegments.slice(bucketIndex + 1).join('/')
            if (filePath) {
                const { error } = await supabase.storage
                    .from('event-posters')
                    .remove([filePath])

                if (error) {
                    console.error('Error deleting poster from storage:', error)
                    return { success: false, error: 'Gagal menghapus gambar poster dari storage' }
                }
            }
        }
    } catch (e) {
        console.error('Invalid poster URL format for deletion:', e)
        return { success: false, error: 'Format URL poster tidak valid' }
    }

    return { success: true }
}
