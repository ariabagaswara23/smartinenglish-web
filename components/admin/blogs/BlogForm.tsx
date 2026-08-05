'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/utils/supabase/client'
import { blogFormSchema, BlogFormValues } from '@/schemas/blog'
import { createBlog, updateBlog } from '@/app/admin/blogs/actions'
import { toast } from '@/components/ui/toast'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { ImageIcon, Upload, X, ArrowLeft, Loader2, Lock, Unlock } from 'lucide-react'
import { BlogPost } from '@/types/blog'
import { RichTextEditor } from './RichTextEditor'

function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

interface BlogFormProps {
    initialData?: BlogPost
}

export function BlogForm({ initialData }: BlogFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [isUploading, setIsUploading] = React.useState(false)
    const [uploadProgress, setUploadProgress] = React.useState(0)
    
    const form = useForm<BlogFormValues>({
        resolver: zodResolver(blogFormSchema),
        defaultValues: {
            title: initialData?.title || '',
            slug: initialData?.slug || '',
            excerpt: initialData?.excerpt || '',
            content: initialData?.content || '',
            category: initialData?.category || '',
            author: initialData?.author || '',
            image_url: initialData?.image_url || '',
            status: initialData?.status || 'draft',
            published_at: initialData?.published_at || '',
        }
    })

    const title = form.watch('title')
    const imageUrl = form.watch('image_url')

    const [isSlugEditedManually, setIsSlugEditedManually] = React.useState(false)
    const [isSlugUnlocked, setIsSlugUnlocked] = React.useState(false)

    // Auto-generate slug when title changes (only if it's a new post and slug is not manually edited)
    React.useEffect(() => {
        if (!initialData && title && !isSlugEditedManually) {
            form.setValue('slug', slugify(title), { shouldValidate: true })
        }
    }, [title, initialData, form, isSlugEditedManually])

    const { onChange: onSlugChange, ...slugRegister } = form.register('slug')

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            toast.add({ title: 'Gagal', description: 'File harus berupa gambar', type: 'error' })
            return
        }

        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            toast.add({ title: 'Gagal', description: 'Ukuran gambar maksimal 2MB', type: 'error' })
            return
        }

        try {
            setIsUploading(true)
            const supabase = createClient()
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('blog-images')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (uploadError) throw uploadError

            const { data } = supabase.storage
                .from('blog-images')
                .getPublicUrl(filePath)

            form.setValue('image_url', data.publicUrl, { shouldValidate: true })
            toast.add({ title: 'Berhasil', description: 'Gambar berhasil diunggah', type: 'success' })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Upload error:', error)
            toast.add({ title: 'Gagal', description: 'Gagal mengunggah gambar', type: 'error' })
        } finally {
            setIsUploading(false)
        }
    }

    const removeImage = () => {
        form.setValue('image_url', '', { shouldValidate: true })
    }

    const onSubmit = async (values: BlogFormValues) => {
        setIsSubmitting(true)
        try {
            const result = initialData 
                ? await updateBlog(initialData.id, values)
                : await createBlog(values)

            if (result.success) {
                toast.add({ 
                    title: 'Berhasil', 
                    description: `Artikel berhasil ${initialData ? 'diperbarui' : 'ditambahkan'}`, 
                    type: 'success' 
                })
                router.push('/admin/blogs')
                router.refresh()
            } else {
                toast.add({ title: 'Gagal', description: result.error || 'Terjadi kesalahan', type: 'error' })
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.add({ title: 'Error', description: error.message, type: 'error' })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <Button type="button" variant="outline" size="icon" onClick={() => router.push('/admin/blogs')} className="h-10 w-10 shrink-0 rounded-xl">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                            {initialData ? 'Edit Artikel' : 'Tambah Artikel Baru'}
                        </h1>
                        <p className="text-sm text-slate-500">
                            {initialData ? 'Perbarui informasi artikel blog Anda di sini.' : 'Buat artikel blog baru dengan mengisi form di bawah ini.'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button type="button" variant="outline" onClick={() => router.push('/admin/blogs')} className="flex-1 sm:flex-none" disabled={isSubmitting}>
                        Batal
                    </Button>
                    <Button type="submit" className="flex-1 sm:flex-none bg-[#2546a1] hover:bg-[#1a347d] text-white min-w-[120px]" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan</>
                        ) : (
                            'Simpan Artikel'
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Kolom Kiri: Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Judul Artikel <span className="text-red-500">*</span></label>
                            <Input
                                placeholder="Masukkan judul artikel"
                                {...form.register('title')}
                                className={form.formState.errors.title ? 'border-red-500 focus-visible:ring-red-500' : ''}
                            />
                            {form.formState.errors.title && (
                                <p className="text-xs text-red-500">{form.formState.errors.title.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">URL Slug <span className="text-red-500">*</span></label>
                            <div className="flex gap-2 items-start">
                                <div className="flex-1 space-y-1">
                                    <Input
                                        placeholder="judul-artikel-anda"
                                        disabled={!!initialData && !isSlugUnlocked}
                                        {...slugRegister}
                                        onChange={(e) => {
                                            if (!initialData) setIsSlugEditedManually(true)
                                            onSlugChange(e)
                                        }}
                                        className={form.formState.errors.slug ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                    />
                                    {form.formState.errors.slug ? (
                                        <p className="text-xs text-red-500 mt-1">{form.formState.errors.slug.message}</p>
                                    ) : (
                                        <p className="text-xs text-slate-500 mt-1">
                                            {!initialData 
                                                ? "Slug terisi otomatis dari judul, kamu bisa menyesuaikannya secara manual." 
                                                : "Mengubah slug dapat menyebabkan link lama menjadi tidak dapat diakses (404)."}
                                        </p>
                                    )}
                                </div>
                                {!!initialData && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="shrink-0"
                                        onClick={() => setIsSlugUnlocked(!isSlugUnlocked)}
                                        title={isSlugUnlocked ? "Kunci Slug" : "Ubah Slug"}
                                    >
                                        {isSlugUnlocked ? <Unlock className="h-4 w-4 text-slate-600" /> : <Lock className="h-4 w-4 text-slate-600" />}
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Ringkasan (Excerpt)</label>
                            <Textarea
                                placeholder="Tuliskan ringkasan singkat artikel..."
                                rows={3}
                                {...form.register('excerpt')}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Konten Utama <span className="text-red-500">*</span></label>
                            <RichTextEditor 
                                value={form.watch('content')}
                                onChange={(val) => form.setValue('content', val, { shouldValidate: true })}
                                isError={!!form.formState.errors.content}
                            />
                            {form.formState.errors.content && (
                                <p className="text-xs text-red-500">{form.formState.errors.content.message}</p>
                            )}
                            <p className="text-xs text-slate-500">Gunakan toolbar untuk merapikan teks, list, dan menyisipkan link.</p>
                        </div>
                    </div>
                </div>

                {/* Kolom Kanan: Meta & Settings */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                        <h3 className="font-semibold text-slate-900 border-b pb-3">Pengaturan Artikel</h3>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Status <span className="text-red-500">*</span></label>
                            <Select 
                                value={form.watch('status')} 
                                onValueChange={(val) => {
                                    if (val) form.setValue('status', val as 'draft' | 'published')
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue>
                                        {form.watch('status') === 'draft' ? 'Draft' : 'Published'}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Kategori <span className="text-red-500">*</span></label>
                            <Input
                                placeholder="Contoh: Tips & Trik, News"
                                {...form.register('category')}
                                className={form.formState.errors.category ? 'border-red-500 focus-visible:ring-red-500' : ''}
                            />
                            {form.formState.errors.category && (
                                <p className="text-xs text-red-500">{form.formState.errors.category.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Penulis (Author) <span className="text-red-500">*</span></label>
                            <Input
                                placeholder="Nama penulis"
                                {...form.register('author')}
                                className={form.formState.errors.author ? 'border-red-500 focus-visible:ring-red-500' : ''}
                            />
                            {form.formState.errors.author && (
                                <p className="text-xs text-red-500">{form.formState.errors.author.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                        <h3 className="font-semibold text-slate-900 border-b pb-3">Cover Image</h3>
                        <div className="space-y-4">
                            {imageUrl ? (
                                <div className="relative rounded-xl overflow-hidden aspect-video border border-slate-200 group">
                                    <Image src={imageUrl} alt="Cover Preview" fill className="object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button type="button" variant="destructive" size="sm" onClick={removeImage} className="gap-2">
                                            <X className="w-4 h-4" /> Hapus Gambar
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        {isUploading ? (
                                            <Loader2 className="w-8 h-8 text-slate-400 animate-spin mb-3" />
                                        ) : (
                                            <Upload className="w-8 h-8 text-slate-400 mb-3" />
                                        )}
                                        <p className="mb-2 text-sm text-slate-500 font-medium">
                                            {isUploading ? 'Mengunggah...' : 'Klik untuk unggah gambar'}
                                        </p>
                                        <p className="text-xs text-slate-400">SVG, PNG, JPG (Max 2MB)</p>
                                    </div>
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*" 
                                        onChange={handleImageUpload} 
                                        disabled={isUploading} 
                                    />
                                </label>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}
