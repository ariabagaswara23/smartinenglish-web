'use client'

import * as React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTeamMembers, deleteTeamMember, toggleTeamStatus } from '@/app/admin/team/actions'
import { TeamMember } from '@/types/team'
import { TeamFormModal } from './TeamFormModal'
import { toast } from '@/components/ui/toast'
import Image from 'next/image'
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
    MoreVertical,
    Edit,
    Trash2,
    Image as ImageIcon,
    Check,
    X,
    Plus
} from 'lucide-react'

type FilterTab = 'all' | 'teacher' | 'staff'

export function TeamTable() {
    const queryClient = useQueryClient()
    const [filter, setFilter] = React.useState<FilterTab>('all')
    const [isModalOpen, setIsModalOpen] = React.useState(false)
    const [memberToEdit, setMemberToEdit] = React.useState<TeamMember | null>(null)

    const { data: teamMembers, isLoading } = useQuery({
        queryKey: ['team'],
        queryFn: getTeamMembers,
    })

    const deleteMutation = useMutation({
        mutationFn: async ({ id, imageUrl }: { id: string, imageUrl?: string | null }) => {
            const res = await deleteTeamMember(id, imageUrl)
            if (!res.success) throw new Error(res.error)
            return res
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['team'] })
            toast.add({ title: 'Berhasil', description: 'Anggota tim dihapus', type: 'success' })
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
            toast.add({ title: 'Gagal', description: error.message, type: 'error' })
        }
    })

    const toggleStatusMutation = useMutation({
        mutationFn: async ({ id, currentStatus }: { id: string, currentStatus: boolean }) => {
            const res = await toggleTeamStatus(id, currentStatus)
            if (!res.success) throw new Error(res.error)
            return res
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['team'] })
            toast.add({ title: 'Berhasil', description: 'Status berhasil diubah', type: 'success' })
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
            toast.add({ title: 'Gagal', description: error.message, type: 'error' })
        }
    })

    const filteredData = React.useMemo(() => {
        if (!teamMembers) return [] as TeamMember[]
        const members = teamMembers as TeamMember[]
        if (filter === 'teacher') return members.filter((m: TeamMember) => m.type === 'teacher')
        if (filter === 'staff') return members.filter((m: TeamMember) => m.type === 'staff')
        return members
    }, [teamMembers, filter])

    const handleEdit = (member: TeamMember) => {
        setMemberToEdit(member)
        setIsModalOpen(true)
    }

    const handleCreate = () => {
        setMemberToEdit(null)
        setIsModalOpen(true)
    }

    const handleDelete = (id: string, imageUrl?: string | null) => {
        if (window.confirm('Yakin ingin menghapus anggota tim ini?')) {
            deleteMutation.mutate({ id, imageUrl })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'all' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Semua
                    </button>
                    <button
                        onClick={() => setFilter('teacher')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'teacher' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Pengajar
                    </button>
                    <button
                        onClick={() => setFilter('staff')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'staff' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Staf
                    </button>
                </div>

                <Button onClick={handleCreate} className="bg-[#2546a1] hover:bg-[#1a347d] text-white gap-2">
                    <Plus className="w-4 h-4" /> Tambah Tim
                </Button>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                            <TableHead className="w-[80px] text-center">Foto</TableHead>
                            <TableHead>Info Tim</TableHead>
                            <TableHead>Tipe & Role</TableHead>
                            <TableHead>Materi (Pengajar)</TableHead>
                            <TableHead className="text-center w-[100px]">Order</TableHead>
                            <TableHead className="w-[120px]">Status</TableHead>
                            <TableHead className="text-right w-[80px]">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                                    Memuat data...
                                </TableCell>
                            </TableRow>
                        ) : filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                                    Belum ada data anggota tim.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData.map((member: TeamMember) => (
                                <TableRow key={member.id} className="group">
                                    <TableCell className="text-center">
                                        <div className="relative w-12 h-12 rounded-full overflow-hidden mx-auto bg-slate-100 border border-slate-200 flex items-center justify-center">
                                            {member.image_url ? (
                                                <Image src={member.image_url} alt={member.name} fill className="object-cover" />
                                            ) : (
                                                <ImageIcon className="w-5 h-5 text-slate-400" />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="font-semibold text-slate-900">{member.name}</p>
                                        {member.description && (
                                            <p className="text-xs text-slate-500 line-clamp-1 max-w-[250px]" title={member.description}>
                                                {member.description}
                                            </p>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col items-start gap-1">
                                            <Badge variant="outline" className={member.type === 'teacher' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}>
                                                {member.type === 'teacher' ? 'Pengajar' : 'Staf'}
                                            </Badge>
                                            <span className="text-sm text-slate-600 font-medium">{member.role}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {member.type === 'teacher' && member.subject_category && member.subject_category.length > 0 ? (
                                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                {member.subject_category.map(subject => (
                                                    <Badge key={subject} variant="secondary" className="text-xs font-normal bg-slate-100 text-slate-600">
                                                        {subject}
                                                    </Badge>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 text-sm italic">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center font-medium text-slate-700">
                                        {member.order_index}
                                    </TableCell>
                                    <TableCell>
                                        <Badge 
                                            variant={member.is_active ? 'default' : 'secondary'}
                                            className={member.is_active ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 cursor-pointer' : 'cursor-pointer'}
                                            onClick={() => toggleStatusMutation.mutate({ id: member.id, currentStatus: !!member.is_active })}
                                        >
                                            {member.is_active ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                                            {member.is_active ? 'Aktif' : 'Nonaktif'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md hover:bg-slate-100 outline-none">
                                                <MoreVertical className="h-4 w-4 text-slate-500" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(member)} className="cursor-pointer">
                                                    <Edit className="w-4 h-4 mr-2 text-slate-500" /> Edit Data
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    onClick={() => toggleStatusMutation.mutate({ id: member.id, currentStatus: !!member.is_active })}
                                                    className="cursor-pointer"
                                                >
                                                    {member.is_active ? (
                                                        <><X className="w-4 h-4 mr-2 text-slate-500" /> Sembunyikan</>
                                                    ) : (
                                                        <><Check className="w-4 h-4 mr-2 text-slate-500" /> Tampilkan</>
                                                    )}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleDelete(member.id, member.image_url)} variant="destructive" className="cursor-pointer">
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

            <TeamFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                memberToEdit={memberToEdit}
            />
        </div>
    )
}
