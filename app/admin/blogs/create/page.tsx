import { BlogForm } from '@/components/admin/blogs/BlogForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Tambah Artikel Baru - Admin',
}

export default function CreateBlogPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <BlogForm />
        </div>
    )
}
