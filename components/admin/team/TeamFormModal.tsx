'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm as useReactHookForm } from 'react-hook-form'
import { teamFormSchema, TeamFormValues } from '@/schemas/team'
import { createTeamMember, updateTeamMember } from '@/app/admin/team/actions'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TeamMember } from '@/types/team'
import { toast } from '@/components/ui/toast'
import { createClient } from '@/utils/supabase/client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Image as ImageIcon, UploadCloud, X, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface TeamFormModalProps {
    isOpen: boolean
    onClose: () => void
    memberToEdit?: TeamMember | null
}

const SUBJECT_OPTIONS = ['English', 'Calistung', 'Bimbel', 'Matematika', 'Mengaji']

export function TeamFormModal({ isOpen, onClose, memberToEdit }: TeamFormModalProps) {
    const queryClient = useQueryClient()
    const supabase = createClient()
    
    const [imageFile, setImageFile] = React.useState<File | null>(null)
    const [imagePreview, setImagePreview] = React.useState<string | null>(null)
    const [isUploading, setIsUploading] = React.useState(false)

    const isEditMode = !!memberToEdit

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useReactHookForm<TeamFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(teamFormSchema) as any,
        defaultValues: {
            name: '',
            type: 'teacher',
            role: '',
            subject_category: [],
            description: '',
            order_index: 0,
            is_active: true,
            image_url: '',
        },
    })

    const typeValue = watch('type')
    const subjectCategoryValue = watch('subject_category') || []
    const isActiveValue = watch('is_active')

    React.useEffect(() => {
        if (isOpen) {
            if (memberToEdit) {
                reset({
                    name: memberToEdit.name,
                    type: memberToEdit.type,
                    role: memberToEdit.role,
                    subject_category: memberToEdit.subject_category || [],
                    description: memberToEdit.description || '',
                    order_index: memberToEdit.order_index || 0,
                    is_active: memberToEdit.is_active ?? true,
                    image_url: memberToEdit.image_url || '',
                })
                setImagePreview(memberToEdit.image_url || null)
            } else {
                reset({
                    name: '',
                    type: 'teacher',
                    role: '',
                    subject_category: [],
                    description: '',
                    order_index: 0,
                    is_active: true,
                    image_url: '',
                })
                setImagePreview(null)
            }
            setImageFile(null)
        }
    }, [isOpen, memberToEdit, reset])

    const mutation = useMutation({
        mutationFn: async (data: TeamFormValues) => {
            let finalImageUrl = data.image_url

            // Handle image upload if there's a new file
            if (imageFile) {
                setIsUploading(true)
                try {
                    const fileExt = imageFile.name.split('.').pop()
                    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`
                    
                    const { error: uploadError, data: uploadData } = await supabase.storage
                        .from('team-photos')
                        .upload(fileName, imageFile, {
                            cacheControl: '3600',
                            upsert: false
                        })

                    if (uploadError) {
                        throw new Error(`Failed to upload image: ${uploadError.message}`)
                    }

                    const { data: publicUrlData } = supabase.storage
                        .from('team-photos')
                        .getPublicUrl(uploadData.path)

                    finalImageUrl = publicUrlData.publicUrl
                } finally {
                    setIsUploading(false)
                }
            }

            const payload = { ...data, image_url: finalImageUrl }

            if (isEditMode && memberToEdit) {
                const res = await updateTeamMember(memberToEdit.id, payload)
                if (!res.success) throw new Error(res.error)
                return res
            } else {
                const res = await createTeamMember(payload)
                if (!res.success) throw new Error(res.error)
                return res
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['team'] })
            toast.add({
                title: isEditMode ? 'Berhasil diperbarui' : 'Berhasil ditambahkan',
                description: `Data ${isEditMode ? 'diperbarui' : 'ditambahkan'} ke dalam tim.`,
                type: 'success',
            })
            onClose()
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
            toast.add({
                title: 'Terjadi kesalahan',
                description: error.message || 'Gagal menyimpan data',
                type: 'error',
            })
        }
    })

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validations
        if (file.size > 2 * 1024 * 1024) {
            toast.add({ title: 'File terlalu besar', description: 'Maksimal ukuran file adalah 2MB', type: 'warning' })
            return
        }
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            toast.add({ title: 'Format tidak didukung', description: 'Hanya menerima JPG, PNG, dan WEBP', type: 'warning' })
            return
        }

        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
    }

    const removeImage = () => {
        setImageFile(null)
        setImagePreview(null)
        setValue('image_url', '')
    }

    const onSubmit = (data: TeamFormValues) => {
        if (data.type !== 'teacher') {
            data.subject_category = []
        }
        mutation.mutate(data)
    }

    const toggleSubject = (subject: string) => {
        const current = [...subjectCategoryValue]
        if (current.includes(subject)) {
            setValue('subject_category', current.filter(s => s !== subject), { shouldValidate: true })
        } else {
            setValue('subject_category', [...current, subject], { shouldValidate: true })
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] lg:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="font-bold text-2xl">{isEditMode ? 'Edit Anggota Tim' : 'Tambah Anggota Tim'}</DialogTitle>
                    <hr />
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
                    
                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-black">Foto (Opsional)</label>
                        <div className="flex items-start gap-4">
                            {imagePreview ? (
                                <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 group">
                                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                    <button 
                                        type="button" 
                                        onClick={removeImage}
                                        className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center transition-all"
                                    >
                                        <X className="w-6 h-6 text-white" />
                                    </button>
                                </div>
                            ) : (
                                <div className="w-24 h-24 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center">
                                    <ImageIcon className="w-8 h-8 text-slate-300" />
                                </div>
                            )}
                            
                            <div className="flex-1">
                                <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                    <UploadCloud className="w-4 h-4 text-slate-500" />
                                    Pilih File
                                    <input type="file" className="hidden" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} />
                                </label>
                                <p className="text-xs text-slate-500 mt-2">Format: JPG, PNG, WEBP. Maks: 2MB.</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-black">Nama Lengkap</label>
                            <Input placeholder="John Doe" {...register('name')} aria-invalid={!!errors.name} />
                            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-black">Tipe Tim</label>
                            <Select 
                                value={typeValue}
                                onValueChange={(val) => {
                                    if (val) setValue('type', val as 'teacher' | 'staff', { shouldValidate: true });
                                }}
                            >
                                <SelectTrigger className="w-full" aria-invalid={!!errors.type}>
                                    <SelectValue placeholder="Pilih Tipe">
                                        {typeValue === 'teacher' ? 'Pengajar' : typeValue === 'staff' ? 'Staff/Manajemen' : ''}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="teacher">Pengajar</SelectItem>
                                    <SelectItem value="staff">Staff/Manajemen</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-black">Role / Jabatan</label>
                        <Input placeholder="Senior English Teacher" {...register('role')} aria-invalid={!!errors.role} />
                        {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
                    </div>

                    {typeValue === 'teacher' && (
                        <div className="space-y-3 p-4 rounded-xl border border-slate-100 bg-slate-50">
                            <label className="text-sm font-semibold text-black">Mata Pelajaran (Wajib)</label>
                            <div className="grid grid-cols-2 gap-3 mt-2">
                                {SUBJECT_OPTIONS.map(subject => (
                                    <label key={subject} className="flex items-center gap-2 cursor-pointer">
                                        <Checkbox 
                                            checked={subjectCategoryValue.includes(subject)}
                                            onCheckedChange={() => toggleSubject(subject)}
                                        />
                                        <span className="text-sm text-slate-600">{subject}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.subject_category && <p className="text-xs text-destructive">{errors.subject_category.message}</p>}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-black">Deskripsi (Opsional)</label>
                        <Textarea placeholder="Tuliskan pengalaman atau motto pengajar..." className="resize-none h-24" {...register('description')} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-black">Urutan Tampil (Order)</label>
                            <Input type="number" {...register('order_index')} />
                            {errors.order_index && <p className="text-xs text-destructive">{errors.order_index.message}</p>}
                        </div>

                        <div className="space-y-2 flex flex-col justify-center">
                            <label className="text-sm font-semibold text-black mb-1">Status</label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <Checkbox 
                                    checked={isActiveValue} 
                                    onCheckedChange={(checked) => setValue('is_active', !!checked)} 
                                />
                                <span className="text-sm text-slate-600">Aktif (Tampil di website)</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                        <Button type="button" variant="outline" onClick={onClose} disabled={mutation.isPending || isUploading}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={mutation.isPending || isUploading} className="bg-[#2546a1] hover:bg-[#1a347d] text-white">
                            {(mutation.isPending || isUploading) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {isEditMode ? 'Simpan Perubahan' : 'Tambah Tim'}
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    )
}
