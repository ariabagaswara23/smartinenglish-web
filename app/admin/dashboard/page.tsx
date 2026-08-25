import { createClient } from '@/utils/supabase/server'
import { Metadata } from 'next'
import {
    BookOpen,
    Users,
    Layers,
    FileText,
    Image,
    Settings,
    ArrowRight,
    Sparkles,
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Dashboard — Admin SMART in ENGLISH',
}

const quickActions = [
    { href: '/admin/programs', label: 'Kelola Program', icon: BookOpen, desc: 'Tambah atau edit program belajar' },
    { href: '/admin/team', label: 'Kelola Tim', icon: Users, desc: 'Atur data tim' },
    // { href: '/admin/events', label: 'Kelola Events', icon: Calendar, desc: 'Buat dan kelola event' },
    { href: '/admin/gallery', label: 'Kelola Gallery', icon: Image, desc: 'Upload foto dan galeri' },
    { href: '/admin/blogs', label: 'Kelola Blog', icon: FileText, desc: 'Tulis dan publikasi artikel' },
    { href: '/admin/settings', label: 'Pengaturan', icon: Settings, desc: 'Konfigurasi website' },
]

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const [
        { data: profile },
        { count: programsCount },
        { count: subProgramsCount },
        { count: teamCount },
        { count: blogsCount },
    ] = await Promise.all([
        supabase.from('profiles').select('full_name').eq('id', user?.id || '').single(),
        supabase.from('programs').select('*', { count: 'exact', head: true }),
        supabase.from('sub_programs').select('*', { count: 'exact', head: true }),
        supabase.from('team').select('*', { count: 'exact', head: true }),
        supabase.from('blogs').select('*', { count: 'exact', head: true }),
    ])

    const statCards = [
        {
            label: 'Total Program',
            value: programsCount ?? 0,
            icon: BookOpen,
            color: 'bg-blue-50',
            iconColor: 'text-[#2546a1]',
            description: 'Program terdaftar',
        },
        {
            label: 'Total Sub Program',
            value: subProgramsCount ?? 0,
            icon: Layers,
            color: 'bg-sky-50',
            iconColor: 'text-sky-600',
            description: 'Sub program terdaftar',
        },
        {
            label: 'Total Tim',
            value: teamCount ?? 0,
            icon: Users,
            color: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
            description: 'Anggota tim',
        },
        {
            label: 'Blog & Artikel',
            value: blogsCount ?? 0,
            icon: FileText,
            color: 'bg-purple-50',
            iconColor: 'text-purple-600',
            description: 'Artikel dipublish',
        },
    ]

    const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Admin'
    const now = new Date()
    const hour = now.getHours()
    const greeting = hour < 11 ? 'Selamat pagi' : hour < 15 ? 'Selamat siang' : hour < 18 ? 'Selamat sore' : 'Selamat malam'

    return (
        <div className="space-y-8 max-w-6xl">
            {/* Welcome banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2546a1] via-[#2d53ba] to-[#1a347d] px-6 py-7 sm:px-8 sm:py-8 text-white shadow-xl shadow-blue-500/20">
                {/* Dot pattern */}
                <div
                    className="absolute inset-0 opacity-[0.07]"
                    style={{
                        backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                    }}
                />
                {/* Glow */}
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

                <div className="relative z-10 flex items-start justify-between flex-wrap gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-[#facc15]" />
                            <span className="text-sm font-semibold text-blue-200">{greeting}</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                            Hello, {displayName}! 👋
                        </h1>
                        <p className="text-blue-200 text-sm mt-1.5 max-w-md">
                            Selamat datang di panel admin SMART in ENGLISH. Kelola konten website kamu dari sini.
                        </p>
                    </div>
                    <div className="text-right text-blue-200 text-sm hidden sm:block">
                        <p className="font-semibold text-white">
                            {now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats cards */}
            <div>
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-[0.1em] mb-4">Ringkasan</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map(({ label, value, icon: Icon, color, iconColor, description }) => (
                        <div
                            key={label}
                            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-4`}>
                                <Icon className={`w-5 h-5 ${iconColor}`} />
                            </div>
                            <p className="text-2xl font-bold text-[#0f172a]">{value}</p>
                            <p className="text-sm font-semibold text-slate-700 mt-0.5">{label}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick actions */}
            <div>
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-[0.1em] mb-4">Aksi Cepat</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quickActions.map(({ href, label, icon: Icon, desc }) => (
                        <Link
                            key={href}
                            href={href}
                            className="group bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-[#2546a1]/20 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-4"
                        >
                            <div className="w-11 h-11 rounded-xl bg-slate-50 group-hover:bg-[#2546a1]/5 flex items-center justify-center flex-shrink-0 transition-colors border border-slate-100 group-hover:border-[#2546a1]/10">
                                <Icon className="w-5 h-5 text-slate-500 group-hover:text-[#2546a1] transition-colors" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-[#0f172a] group-hover:text-[#2546a1] transition-colors">{label}</p>
                                <p className="text-xs text-slate-400 mt-0.5 truncate">{desc}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#2546a1] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
