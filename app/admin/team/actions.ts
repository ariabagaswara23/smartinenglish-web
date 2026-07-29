'use server'

import { createClient } from '@/utils/supabase/server'
import { teamFormSchema } from '@/schemas/team'

export async function getTeamMembers() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('team')
        .select('*')
        .order('order_index', { ascending: true })

    if (error) {
        console.error('Error fetching team members:', error)
        throw new Error('Gagal mengambil data tim')
    }

    return data
}

export async function createTeamMember(payload: unknown) {
    const supabase = await createClient()

    const parsed = teamFormSchema.safeParse(payload)
    if (!parsed.success) {
        return { success: false, error: 'Data tidak valid' }
    }

    const { data, error } = await supabase
        .from('team')
        .insert(parsed.data)
        .select()
        .single()

    if (error) {
        console.error('Error creating team member:', error)
        return { success: false, error: 'Gagal menambahkan anggota tim' }
    }

    return { success: true, data }
}

export async function updateTeamMember(id: string, payload: unknown) {
    const supabase = await createClient()

    const parsed = teamFormSchema.safeParse(payload)
    if (!parsed.success) {
        return { success: false, error: 'Data tidak valid' }
    }

    const { data, error } = await supabase
        .from('team')
        .update(parsed.data)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error updating team member:', error)
        return { success: false, error: 'Gagal memperbarui anggota tim' }
    }

    return { success: true, data }
}

export async function deleteTeamMember(id: string, imageUrl?: string | null) {
    const supabase = await createClient()

    // Jika ada image, hapus dari storage terlebih dahulu
    if (imageUrl) {
        try {
            const url = new URL(imageUrl)
            const pathSegments = url.pathname.split('/')
            // Misal: https://[project].supabase.co/storage/v1/object/public/team-photos/fileName.jpg
            const teamPhotosIndex = pathSegments.indexOf('team-photos')
            if (teamPhotosIndex !== -1) {
                const filePath = pathSegments.slice(teamPhotosIndex + 1).join('/')
                if (filePath) {
                    const { error: storageError } = await supabase.storage
                        .from('team-photos')
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
        .from('team')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting team member:', error)
        return { success: false, error: 'Gagal menghapus anggota tim' }
    }

    return { success: true }
}

export async function toggleTeamStatus(id: string, currentStatus: boolean) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('team')
        .update({ is_active: !currentStatus })
        .eq('id', id)

    if (error) {
        console.error('Error toggling team status:', error)
        return { success: false, error: 'Gagal mengubah status' }
    }

    return { success: true }
}
