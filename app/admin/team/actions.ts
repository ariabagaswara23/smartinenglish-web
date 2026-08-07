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

    const teamData = { ...parsed.data }

    // Hitung jumlah tim berdasarkan tipe (teacher/staff) untuk mendapatkan order_index di posisi paling akhir
    const { count, error: countError } = await supabase
        .from('team')
        .select('*', { count: 'exact', head: true })
        .eq('type', teamData.type)

    if (countError) {
        console.error('Error counting team members:', countError)
        return { success: false, error: 'Gagal menghitung urutan tim' }
    }

    teamData.order_index = count || 0

    const { data, error } = await supabase
        .from('team')
        .insert(teamData)
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

export async function updateTeamOrder(items: { id: string; order_index: number }[]) {
    const supabase = await createClient()

    // Menggunakan perulangan dengan Promise.all untuk mencegah isu upsert 
    // jika kita tidak mengirimkan semua required field (seperti yang pengguna khawatirkan)
    const promises = items.map(item => 
        supabase
            .from('team')
            .update({ order_index: item.order_index })
            .eq('id', item.id)
    )

    try {
        const results = await Promise.all(promises)
        const hasError = results.some(res => res.error)
        
        if (hasError) {
            console.error('Error updating team order for some items:', results.filter(r => r.error))
            return { success: false, error: 'Gagal memperbarui urutan beberapa item' }
        }

        return { success: true }
    } catch (error) {
        console.error('Error in updateTeamOrder:', error)
        return { success: false, error: 'Terjadi kesalahan sistem saat memperbarui urutan' }
    }
}
