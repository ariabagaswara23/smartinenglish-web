export interface TeamMember {
    id: string;
    name: string;
    role: string;
    type: 'teacher' | 'staff';
    subject_category: string[] | null;
    description: string | null;
    image_url: string | null;
    order_index?: number;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
}