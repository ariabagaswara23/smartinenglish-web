import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
    title: 'Login Admin — SMART in ENGLISH',
    description: 'Halaman login untuk admin CMS SMART in ENGLISH.',
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#fafafc] flex flex-col items-center justify-center relative overflow-hidden px-4 py-8">
            {/* Dot pattern background */}
            <div
                className="absolute inset-0 z-0 opacity-[0.3]"
                style={{
                    backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }}
            />

            {/* Gradient blobs */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#2546a1]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 z-0" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#facc15]/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 z-0" />

            {/* Login card */}
            <div className="relative z-10 w-full max-w-md">
                <div className="mb-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#2546a1] transition-all group"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        <span>Kembali ke Website</span>
                    </Link>
                </div>
                <LoginForm />
            </div>
        </div>
    )
}
