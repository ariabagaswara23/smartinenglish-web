'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getSiteSettings(): Promise<Record<string, string>> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')

    if (error) {
        console.error('Error fetching site settings:', error)
        throw new Error('Gagal mengambil pengaturan situs')
    }

    const settings: Record<string, string> = {}
    if (data) {
        data.forEach((item) => {
            settings[item.key] = item.value
        })
    }

    return settings
}

export async function updateSiteSettings(payload: Record<string, string>) {
    const supabase = await createClient()

    const updates = Object.entries(payload).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString()
    }))

    const { error } = await supabase
        .from('site_settings')
        .upsert(updates, { onConflict: 'key' })

    if (error) {
        console.error('Error updating site settings:', error)
        return { success: false, error: 'Gagal memperbarui pengaturan situs' }
    }

    revalidatePath('/admin/settings')
    revalidatePath('/', 'layout')

    return { success: true }
}
