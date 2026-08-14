import { getBlogs } from '@/app/admin/blogs/actions'
import { BlogTable } from '@/components/admin/blogs/BlogTable'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { FileText, Plus } from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Manajemen Artikel & Blog',
}

export default async function AdminBlogsPage() {
    const blogs = await getBlogs()

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                        <FileText className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manajemen Artikel & Blog</h1>
                        <p className="text-sm text-slate-500">
                            Kelola seluruh artikel, berita, dan blog post pada website Anda.
                        </p>
                    </div>
                </div>
            </div>
                <Link 
                    href="/admin/blogs/create"
                    className={cn(buttonVariants(), "bg-[#2546a1] hover:bg-[#1a347d] text-white gap-2 px-4 py-2 text-base")}
                >
                    <Plus className="w-4 h-4" /> Tambah Artikel Baru
                </Link>
            </div>

            <div className="w-full">
                <BlogTable initialData={blogs} />
            </div>
        </div>
    )
}
