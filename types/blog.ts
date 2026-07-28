export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    author: string;
    image_url: string | null;
    status?: 'draft' | 'published';
    published_at: string;
    created_at?: string;
    updated_at?: string;
}