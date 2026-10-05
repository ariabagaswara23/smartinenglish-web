'use client'

import * as React from 'react'
import Image from 'next/image'
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GraduationCap, Briefcase, User, BookOpen, Sparkles } from 'lucide-react'
import { TeamMember } from '@/types/team'

interface TeamDetailModalProps {
    member: TeamMember | null
    isOpen: boolean
    onClose: () => void
}

export function TeamDetailModal({ member, isOpen, onClose }: TeamDetailModalProps) {
    if (!member) return null

    const isTeacher = member.type === 'teacher'

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-xl md:max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-3xl bg-white border border-slate-100 shadow-2xl">
                {/* Header Banner */}
                <div className={`h-24 sm:h-28 w-full relative ${isTeacher ? 'bg-gradient-to-r from-[#2546a1] via-[#1e3a8a] to-[#172554]' : 'bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800'}`}>
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                </div>

                <div className="px-6 pb-6 pt-0 relative">
                    {/* Avatar & Main Info */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-14 sm:-mt-16 mb-6">
                        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-slate-100 shrink-0">
                            {member.image_url ? (
                                <Image
                                    src={member.image_url}
                                    alt={`Foto ${member.name}`}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                                    {isTeacher ? (
                                        <GraduationCap className="w-12 h-12 text-[#2546a1]" />
                                    ) : (
                                        <User className="w-12 h-12 text-emerald-500" />
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="text-center sm:text-left flex-1 min-w-0">
                            <div className="inline-flex items-center gap-1.5 mb-1.5">
                                <Badge 
                                    variant="outline" 
                                    className={isTeacher ? 'bg-blue-50 text-[#2546a1] border-blue-200 font-semibold' : 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold'}
                                >
                                    {isTeacher ? 'Pengajar' : 'Staff / Manajemen'}
                                </Badge>
                            </div>
                            <DialogTitle className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                                {member.name}
                            </DialogTitle>
                            <DialogDescription className="sr-only">
                                Profil dan informasi detail {member.name}
                            </DialogDescription>
                            <p className={`text-sm font-semibold mt-1 ${isTeacher ? 'text-[#2546a1]' : 'text-emerald-700'}`}>
                                {member.role}
                            </p>
                        </div>
                    </div>

                    {/* Quick Info Badges: Education & Experience */}
                    {(member.education || member.experience_years) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6">
                            {member.education && (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-[#2546a1] flex items-center justify-center shrink-0">
                                        <GraduationCap className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pendidikan Terakhir</p>
                                        <p className="text-sm font-semibold text-slate-800 truncate" title={member.education}>
                                            {member.education}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {member.experience_years && (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center shrink-0">
                                        <Briefcase className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pengalaman</p>
                                        <p className="text-sm font-semibold text-slate-800">
                                            {member.experience_years.toLowerCase().includes('tahun') || member.experience_years.toLowerCase().includes('thn')
                                                ? member.experience_years
                                                : `${member.experience_years} Tahun`}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Subjects for Teachers */}
                    {isTeacher && member.subject_category && member.subject_category.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-[#2546a1]" />
                                Mata Pelajaran / Program
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                                {member.subject_category.map((subject, idx) => (
                                    <span
                                        key={idx}
                                        className="inline-block text-xs font-medium bg-blue-50 text-[#2546a1] px-3 py-1 rounded-full border border-blue-100"
                                    >
                                        {subject}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Bio / Description */}
                    <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            Profil & Deskripsi
                        </h4>
                        <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                            {member.description ? (
                                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                                    {member.description}
                                </p>
                            ) : (
                                <p className="text-sm text-slate-400 italic">
                                    Belum ada deskripsi profil untuk anggota tim ini.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Action */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="text-sm font-medium px-5"
                        >
                            Tutup
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
