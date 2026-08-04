'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
    LayoutDashboard,
    BookOpen,
    Users,
    Calendar,
    Image as ImageIcon,
    FileText,
    Settings,
    ChevronLeft,
    X,
} from 'lucide-react'
import Image from "next/image";

const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/programs', label: 'Programs', icon: BookOpen },
    { href: '/admin/team', label: 'Tim Pengajar', icon: Users },
    // { href: '/admin/events', label: 'Events', icon: Calendar },
    { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
    { href: '/admin/blog', label: 'Blog', icon: FileText },
    { href: '/admin/settings', label: 'Pengaturan', icon: Settings },
]

interface AdminSidebarProps {
    isOpen: boolean
    onClose: () => void
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
    const pathname = usePathname()

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-100 z-50
                    flex flex-col shadow-xl shadow-slate-200/40
                    transition-transform duration-300 ease-out
                    lg:translate-x-0 lg:static lg:z-auto lg:shadow-none
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* Logo area */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/logo.png"
                            alt="Smart in English Logo"
                            width={80}
                            height={20}
                            className="object-contain"
                        />
                    </div>

                    {/* Close button (mobile only) */}
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        aria-label="Tutup sidebar"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav section label */}
                <div className="px-6 pt-6 pb-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Menu</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 overflow-y-auto">
                    <ul className="space-y-0.5">
                        {navItems.map(({ href, label, icon: Icon }) => {
                            const isActive = pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href))
                            return (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        onClick={onClose}
                                        className={`
                                            flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150
                                            ${isActive
                                                ? 'bg-[#2546a1] text-white shadow-md shadow-blue-500/20'
                                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                            }
                                        `}
                                    >
                                        <Icon className={`w-4.5 h-4.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                        {label}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>

                {/* Back to site link */}
                <div className="px-3 pb-6 pt-4 border-t border-slate-100 mt-2">
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all"
                    >
                        <ChevronLeft className="w-4 h-4 text-slate-400" />
                        Lihat Website
                    </Link>
                </div>
            </aside>
        </>
    )
}
