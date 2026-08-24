'use server'

import { createClient } from '@/utils/supabase/server'
import { blogFormSchema } from '@/schemas/blog'
import { revalidatePath } from 'next/cache'
import { BlogPost } from '@/types/blog'

export async function getBlogs() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching blogs:', error)
        throw new Error('Gagal mengambil data blog')
    }

    return data as BlogPost[]
}

export async function getPublicBlogs(): Promise<BlogPost[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching public blogs:', error)
        return []
    }

    return (data as BlogPost[]) || []
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .single()

    if (error) {
        console.error('Error fetching blog by slug:', error)
        return null
    }

    return data as BlogPost
}

export async function getRecentBlogs(currentSlug?: string, limit: number = 3): Promise<BlogPost[]> {
    const supabase = await createClient()

    let query = supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })
        .limit(limit + 1)

    if (currentSlug) {
        query = query.neq('slug', currentSlug)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching recent blogs:', error)
        return []
    }

    return ((data as BlogPost[]) || []).slice(0, limit)
}

export async function getBlogById(id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching blog by id:', error)
        return null
    }

    return data as BlogPost
}

export async function createBlog(payload: unknown) {
    const supabase = await createClient()

    const parsed = blogFormSchema.safeParse(payload)
    if (!parsed.success) {
        return { success: false, error: 'Data tidak valid' }
    }

    const blogData = { ...parsed.data }
    
    if (blogData.status === 'published' && !blogData.published_at) {
        blogData.published_at = new Date().toISOString()
    } else if (!blogData.published_at) {
        blogData.published_at = null
    }

    const { data, error } = await supabase
        .from('blogs')
        .insert(blogData)
        .select()
        .single()

    if (error) {
        console.error('Error creating blog:', error)
        return { success: false, error: error.message || 'Gagal menambahkan artikel' }
    }

    revalidatePath('/blog')
    revalidatePath('/admin/blogs')
    return { success: true, data }
}

export async function updateBlog(id: string, payload: unknown) {
    const supabase = await createClient()

    const parsed = blogFormSchema.safeParse(payload)
    if (!parsed.success) {
        return { success: false, error: 'Data tidak valid' }
    }
    
    const blogData = { ...parsed.data }
    
    // Auto populate published_at if status changes to published and it's empty
    if (blogData.status === 'published' && !blogData.published_at) {
        blogData.published_at = new Date().toISOString()
    } else if (!blogData.published_at) {
        blogData.published_at = null
    }

    const { data, error } = await supabase
        .from('blogs')
        .update(blogData)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error updating blog:', error)
        return { success: false, error: error.message || 'Gagal memperbarui artikel' }
    }

    revalidatePath('/blog')
    if (blogData.slug) {
        revalidatePath(`/blog/${blogData.slug}`)
    }
    revalidatePath('/admin/blogs')
    return { success: true, data }
}

export async function deleteBlog(id: string, imageUrl?: string | null) {
    const supabase = await createClient()

    // Jika ada image, hapus dari storage terlebih dahulu
    if (imageUrl) {
        try {
            const url = new URL(imageUrl)
            const pathSegments = url.pathname.split('/')
            // Misal: https://[project].supabase.co/storage/v1/object/public/blog-images/fileName.jpg
            const blogImagesIndex = pathSegments.indexOf('blog-images')
            if (blogImagesIndex !== -1) {
                const filePath = pathSegments.slice(blogImagesIndex + 1).join('/')
                if (filePath) {
                    const { error: storageError } = await supabase.storage
                        .from('blog-images')
                        .remove([filePath])

                    if (storageError) {
                        console.error('Error deleting image from storage:', storageError)
                    }
                }
            }
        } catch (e) {
            console.error('Invalid image URL format', e)
        }
    }

    const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting blog:', error)
        return { success: false, error: 'Gagal menghapus artikel' }
    }

    revalidatePath('/blog')
    revalidatePath('/admin/blogs')
    return { success: true }
}
