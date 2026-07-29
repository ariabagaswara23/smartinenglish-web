import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebarWrapper from '@/components/admin/AdminSidebarWrapper'
import { Toaster } from '@/components/ui/toast'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Ambil profile dari tabel profiles jika ada
    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single()

    const userInfo = {
        email: user.email,
        full_name: profile?.full_name ?? null,
    }

    return (
        <div className="min-h-screen bg-[#f8f9fb] flex">
            <AdminSidebarWrapper user={userInfo}>
                {children}
            </AdminSidebarWrapper>
            <Toaster />
        </div>
    )
}
