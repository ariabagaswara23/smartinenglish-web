'use client'

import { useState, useTransition } from 'react'
import { login } from './actions'
import { Eye, EyeOff, Loader2, LogIn, AlertCircle } from 'lucide-react'
import Image from "next/image";

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    async function handleSubmit(formData: FormData) {
        setError(null)
        startTransition(async () => {
            const result = await login(formData)
            if (result?.error) {
                setError(result.error)
            }
        })
    }

    return (
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-slate-100 p-8 sm:p-10">
            {/* Logo & Title */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center mb-5">
                    <Image
                            src="/logo.png"
                            alt="Smart in English Logo"
                            width={80}
                            height={20}
                            className="object-contain"
                        />
                </div>
                <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight">
                    SMART in ENGLISH
                </h1>
                <p className="text-sm text-slate-500 mt-1.5">
                    Masuk ke panel admin
                </p>
            </div>

            {/* Divider */}
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[#2546a1]/40 to-transparent mx-auto mb-8 rounded-full" />

            {/* Error alert */}
            {error && (
                <div className="mb-5 flex items-start gap-3 px-4 py-3.5 rounded-xl bg-red-50 border border-red-100 text-red-700">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p className="text-sm font-medium leading-relaxed">
                        {error === 'Invalid login credentials'
                            ? 'Email atau password salah. Silakan coba lagi.'
                            : error}
                    </p>
                </div>
            )}

            {/* Form */}
            <form action={handleSubmit} className="space-y-5">
                {/* Email */}
                <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-sm font-semibold text-[#0f172a]">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        disabled={isPending}
                        placeholder="admin@smartinenglish.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-[#0f172a] text-sm placeholder:text-slate-400 outline-none transition-all focus:border-[#2546a1] focus:bg-white focus:ring-3 focus:ring-[#2546a1]/10 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                    <label htmlFor="password" className="block text-sm font-semibold text-[#0f172a]">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            required
                            disabled={isPending}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 bg-slate-50 text-[#0f172a] text-sm placeholder:text-slate-400 outline-none transition-all focus:border-[#2546a1] focus:bg-white focus:ring-3 focus:ring-[#2546a1]/10 disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(v => !v)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            tabIndex={-1}
                            aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                        >
                            {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                        </button>
                    </div>
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#2546a1] text-white font-bold text-sm hover:bg-[#1a347d] active:scale-[0.98] transition-all shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100 mt-2"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Memproses...
                        </>
                    ) : (
                        <>
                            <LogIn className="w-4 h-4" />
                            Masuk
                        </>
                    )}
                </button>
            </form>

            {/* Footer note */}
            <p className="text-center text-xs text-slate-400 mt-8">
                Akses terbatas untuk admin{' '}
                <span className="font-semibold text-[#2546a1]">SMART in ENGLISH</span>
            </p>
        </div>
    )
}
