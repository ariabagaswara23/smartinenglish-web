'use client'

import { Menu, LogOut } from 'lucide-react'
import { logout } from '@/app/admin/actions'
import { useTransition } from 'react'

interface AdminHeaderProps {
    onMenuOpen: () => void
    user: {
        email?: string
        full_name?: string | null
    }
}

export default function AdminHeader({ onMenuOpen, user }: AdminHeaderProps) {
    const [isPending, startTransition] = useTransition()

    const displayName = user.full_name || user.email?.split('@')[0] || 'Admin'
    const initials = displayName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()

    function handleLogout() {
        startTransition(async () => {
            await logout()
        })
    }

    return (
        <header className="h-16 bg-white border-b border-slate-100 flex items-center px-4 sm:px-6 gap-4 sticky top-0 z-30">
            {/* Hamburger (mobile) */}
            <button
                onClick={onMenuOpen}
                className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                aria-label="Buka menu"
                id="admin-menu-toggle"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Page title area (mobile logo fill) */}
            <div className="flex-1">
                <p className="text-sm font-semibold text-slate-500 lg:hidden">Admin Panel</p>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-3">
                {/* User info */}
                <div className="hidden sm:flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#2546a1] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {initials}
                    </div>
                    <div className="text-right leading-none">
                        <p className="text-sm font-semibold text-[#0f172a]">{displayName}</p>
                        {user.full_name && (
                            <p className="text-[11px] text-slate-400 mt-0.5">{user.email}</p>
                        )}
                    </div>
                </div>

                {/* Mobile avatar only */}
                <div className="sm:hidden w-8 h-8 rounded-full bg-[#2546a1] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {initials}
                </div>

                {/* Divider */}
                <div className="w-px h-6 bg-slate-200 hidden sm:block" />

                {/* Logout button */}
                <button
                    onClick={handleLogout}
                    disabled={isPending}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    aria-label="Keluar"
                    id="admin-logout-btn"
                >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Keluar</span>
                </button>
            </div>
        </header>
    )
}
