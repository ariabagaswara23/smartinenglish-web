'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BlogPost } from '@/types/blog'
import { deleteBlog } from '@/app/admin/blogs/actions'
import { toast } from '@/components/ui/toast'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    MoreHorizontal,
    Edit,
    Trash2,
    Search,
    FileText,
    Eye
} from 'lucide-react'

interface BlogTableProps {
    initialData: BlogPost[]
}

export function BlogTable({ initialData }: BlogTableProps) {
    const [searchQuery, setSearchQuery] = React.useState('')
    const [statusFilter, setStatusFilter] = React.useState<string>('all')
    const [categoryFilter, setCategoryFilter] = React.useState<string>('all')
    const [isDeleting, setIsDeleting] = React.useState(false)
    const [blogToDelete, setBlogToDelete] = React.useState<BlogPost | null>(null)
    
    // Extract unique categories for filter
    const categories = React.useMemo(() => {
        const cats = new Set(initialData.map(blog => blog.category))
        return Array.from(cats)
    }, [initialData])

    const filteredData = React.useMemo(() => {
        return initialData.filter(blog => {
            const matchesSearch = 
                blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                blog.author.toLowerCase().includes(searchQuery.toLowerCase())
            
            const matchesStatus = statusFilter === 'all' || blog.status === statusFilter
            const matchesCategory = categoryFilter === 'all' || blog.category === categoryFilter

            return matchesSearch && matchesStatus && matchesCategory
        })
    }, [initialData, searchQuery, statusFilter, categoryFilter])

    const handleDeleteConfirm = async () => {
        if (!blogToDelete) return
        
        setIsDeleting(true)
        try {
            const result = await deleteBlog(blogToDelete.id, blogToDelete.image_url)
            if (result.success) {
                toast.add({ title: 'Berhasil', description: 'Artikel berhasil dihapus', type: 'success' })
            } else {
                toast.add({ title: 'Gagal', description: result.error || 'Gagal menghapus artikel', type: 'error' })
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.add({ title: 'Error', description: error.message, type: 'error' })
        } finally {
            setIsDeleting(false)
            setBlogToDelete(null)
        }
    }

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return '-'
        const date = new Date(dateString)
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }).format(date)
    }

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Cari judul atau penulis..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-white"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || 'all')}>
                        <SelectTrigger className="w-full sm:w-36 bg-white">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={categoryFilter} onValueChange={(val) => setCategoryFilter(val || 'all')}>
                        <SelectTrigger className="w-full sm:w-40 bg-white">
                            <SelectValue placeholder="Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Kategori</SelectItem>
                            {categories.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                            <TableHead className="font-semibold">Artikel</TableHead>
                            <TableHead className="font-semibold">Kategori</TableHead>
                            <TableHead className="font-semibold">Penulis</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                            <TableHead className="font-semibold">Tanggal Rilis</TableHead>
                            <TableHead className="text-right font-semibold w-20">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-48 text-center">
                                    <div className="flex flex-col items-center justify-center text-slate-500">
                                        <FileText className="h-10 w-10 text-slate-300 mb-2" />
                                        <p>Tidak ada artikel ditemukan</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData.map((blog) => (
                                <TableRow key={blog.id} className="group">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center">
                                                {blog.image_url ? (
                                                    <Image src={blog.image_url} alt={blog.title} fill className="object-cover" />
                                                ) : (
                                                    <FileText className="w-5 h-5 text-slate-400" />
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-900 line-clamp-1" title={blog.title}>
                                                    {blog.title}
                                                </span>
                                                <span className="text-xs text-slate-500 line-clamp-1">
                                                    /{blog.slug}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-normal">
                                            {blog.category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm font-medium text-slate-700">{blog.author}</span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge 
                                            variant="outline" 
                                            className={blog.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}
                                        >
                                            {blog.status === 'published' ? 'Published' : 'Draft'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-slate-600">
                                            {formatDate(blog.published_at || blog.created_at)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center justify-center rounded-md hover:bg-slate-100 outline-none">
                                                <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem className="cursor-pointer p-0">
                                                    <Link href={`/admin/blogs/${blog.id}/edit`} className="flex items-center w-full px-2 py-1.5">
                                                        <Edit className="w-4 h-4 mr-2 text-slate-500" /> Edit
                                                    </Link>
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem className="cursor-pointer p-0">
                                                    <Link href={`/blog/${blog.slug}`} target="_blank" className="flex items-center w-full px-2 py-1.5">
                                                        <Eye className="w-4 h-4 mr-2 text-slate-500" /> Preview
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => setBlogToDelete(blog)} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                                                    <Trash2 className="w-4 h-4 mr-2" /> Hapus
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Alert Dialog for Delete Confirmation */}
            <AlertDialog open={!!blogToDelete} onOpenChange={(open) => !open && setBlogToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Artikel <span className="font-semibold text-slate-900">{blogToDelete?.title}</span> akan dihapus secara permanen dari server.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                        <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isDeleting}>
                            {isDeleting ? 'Menghapus...' : 'Hapus Artikel'}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
