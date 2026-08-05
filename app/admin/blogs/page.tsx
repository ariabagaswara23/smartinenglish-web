import { getBlogs } from '@/app/admin/blogs/actions'
import { BlogTable } from '@/components/admin/blogs/BlogTable'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'
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
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Manajemen Artikel & Blog</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Kelola seluruh artikel, berita, dan blog post pada website Anda.
                    </p>
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
