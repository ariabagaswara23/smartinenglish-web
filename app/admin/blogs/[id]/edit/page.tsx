import { getBlogById } from '@/app/admin/blogs/actions'
import { BlogForm } from '@/components/admin/blogs/BlogForm'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Edit Artikel - Admin',
}

interface EditBlogPageProps {
    params: Promise<{ id: string }>
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
    const { id } = await params
    const blog = await getBlogById(id)

    if (!blog) {
        notFound()
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <BlogForm initialData={blog} />
        </div>
    )
}
