import { Metadata } from 'next'
import { SiteSettingsForm } from '@/components/admin/settings/SiteSettingsForm'

export const metadata: Metadata = {
    title: 'Pengaturan Situs - Admin',
    description: 'Kelola konfigurasi WhatsApp, email kontak, dan tautan media sosial',
}

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight">Pengaturan Situs</h1>
                <p className="text-slate-500 text-sm">
                    Kelola konfigurasi WhatsApp, email kontak, dan tautan media sosial.
                </p>
            </div>

            <SiteSettingsForm />
        </div>
    )
}
