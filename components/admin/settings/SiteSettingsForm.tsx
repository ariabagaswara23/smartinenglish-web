'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { siteSettingsSchema, SiteSettingsValues } from '@/schemas/site-settings-schema'
import { getSiteSettings, updateSiteSettings } from '@/app/admin/settings/actions'
import { toast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2 } from 'lucide-react'

export function SiteSettingsForm() {
    const [isLoading, setIsLoading] = React.useState(true)

    const form = useForm<SiteSettingsValues>({
        resolver: zodResolver(siteSettingsSchema),
        defaultValues: {
            whatsapp_number: '',
            whatsapp_template_default: '',
            whatsapp_template_program: '',
            contact_email: '',
            social_instagram: '',
            social_tiktok: '',
        },
    })

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = form

    React.useEffect(() => {
        let mounted = true
        
        async function loadSettings() {
            try {
                const data = await getSiteSettings()
                if (mounted) {
                    reset({
                        whatsapp_number: data['whatsapp_number'] || '',
                        whatsapp_template_default: data['whatsapp_template_default'] || '',
                        whatsapp_template_program: data['whatsapp_template_program'] || '',
                        contact_email: data['contact_email'] || '',
                        social_instagram: data['social_instagram'] || '',
                        social_tiktok: data['social_tiktok'] || '',
                    })
                }
            } catch (error) {
                console.error(error)
                toast.add({ title: 'Gagal memuat pengaturan', type: 'error' })
            } finally {
                if (mounted) {
                    setIsLoading(false)
                }
            }
        }

        loadSettings()

        return () => {
            mounted = false
        }
    }, [reset])

    const onSubmit = async (data: SiteSettingsValues) => {
        try {
            const res = await updateSiteSettings(data as Record<string, string>)
            if (!res.success) {
                throw new Error(res.error)
            }
            toast.add({ title: 'Berhasil', description: 'Pengaturan berhasil disimpan', type: 'success' })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.add({ title: 'Gagal', description: error.message || 'Terjadi kesalahan sistem', type: 'error' })
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-6 max-w-4xl">
                {[1, 2, 3].map((i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-1/3 mb-2" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-24 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
            {/* Card 1: Pengaturan WhatsApp */}
            <Card>
                <CardHeader>
                    <CardTitle>Pengaturan WhatsApp</CardTitle>
                    <CardDescription>Konfigurasi nomor kontak dan template pesan untuk Customer Service.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-black">Nomor WhatsApp CS Admin</label>
                        <Input 
                            placeholder="6282129183000" 
                            {...register('whatsapp_number')} 
                            aria-invalid={!!errors.whatsapp_number}
                        />
                        <p className="text-xs text-slate-500">Format diawali kode negara, contoh: 6282129183000</p>
                        {errors.whatsapp_number && <p className="text-xs text-destructive">{errors.whatsapp_number.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-black">Template Pesan Umum / Navbar CTA</label>
                        <Textarea 
                            rows={3} 
                            placeholder="Halo admin, saya ingin bertanya..."
                            {...register('whatsapp_template_default')} 
                        />
                        {errors.whatsapp_template_default && <p className="text-xs text-destructive">{errors.whatsapp_template_default.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-black">Template Pesan Detail Program</label>
                        <Textarea 
                            rows={3} 
                            placeholder="Halo admin, saya tertarik dengan program..."
                            {...register('whatsapp_template_program')} 
                        />
                        <p className="text-xs text-slate-500">Pesan ini akan otomatis ditempelkan nama program di halaman detail.</p>
                        {errors.whatsapp_template_program && <p className="text-xs text-destructive">{errors.whatsapp_template_program.message}</p>}
                    </div>
                </CardContent>
            </Card>

            {/* Card 2: Informasi Kontak */}
            <Card>
                <CardHeader>
                    <CardTitle>Informasi Kontak</CardTitle>
                    <CardDescription>Email utama untuk pertanyaan publik dan bisnis.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-black">Email Kontak</label>
                        <Input 
                            type="email"
                            placeholder="smartinenglish.smile56@gmail.com" 
                            {...register('contact_email')} 
                        />
                        {errors.contact_email && <p className="text-xs text-destructive">{errors.contact_email.message}</p>}
                    </div>
                </CardContent>
            </Card>

            {/* Card 3: Tautan Media Sosial */}
            <Card>
                <CardHeader>
                    <CardTitle>Tautan Media Sosial</CardTitle>
                    <CardDescription>Link ke akun sosial media resmi.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-black">Instagram URL</label>
                        <Input 
                            placeholder="https://www.instagram.com/..." 
                            {...register('social_instagram')} 
                        />
                        {errors.social_instagram && <p className="text-xs text-destructive">{errors.social_instagram.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-black">TikTok URL</label>
                        <Input 
                            placeholder="https://www.tiktok.com/@..." 
                            {...register('social_tiktok')} 
                        />
                        {errors.social_tiktok && <p className="text-xs text-destructive">{errors.social_tiktok.message}</p>}
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end pb-10">
                <Button type="submit" disabled={isSubmitting} className="bg-[#2546a1] hover:bg-[#1a347d] text-white min-w-32">
                    {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Simpan Perubahan
                </Button>
            </div>
        </form>
    )
}
