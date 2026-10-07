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
    const scrollRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        if (isOpen) {
            if (scrollRef.current) {
                scrollRef.current.scrollTop = 0
            }
            const timer = setTimeout(() => {
                if (scrollRef.current) {
                    scrollRef.current.scrollTop = 0
                }
            }, 10)
            return () => clearTimeout(timer)
        }
    }, [isOpen, member])

    if (!member) return null

    const isTeacher = member.type === 'teacher'
    const educations = Array.isArray(member.education)
        ? member.education.filter(Boolean)
        : (typeof member.education === 'string' && member.education.trim())
            ? [member.education.trim()]
            : []
    const hasEducation = educations.length > 0

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent 
                ref={scrollRef}
                initialFocus={false}
                className="sm:max-w-xl md:max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-3xl bg-white border border-slate-100 shadow-2xl"
            >
                {/* Header Banner */}
                <div className={`h-28 sm:h-32 w-full relative overflow-hidden ${isTeacher ? 'bg-gradient-to-r from-[#2546a1] via-[#1e3a8a] to-[#172554]' : 'bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800'}`}>
                    {/* Subtle dot pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                    {/* Vision Mission SVG Background Accent */}
                    <div 
                        className="absolute inset-y-0 right-0 w-full sm:w-2/3 h-full opacity-20 pointer-events-none select-none"
                        style={{
                            maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 15%, transparent 90%)',
                            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 15%, transparent 90%)'
                        }}
                    >
                        <Image
                            src="/bg/visionmission-bg.svg"
                            alt="Banner Decorative Pattern"
                            fill
                            className="object-cover object-right scale-x-[-1]"
                            priority={false}
                        />
                    </div>

                    {/* Soft Ambient Light Glow */}
                    <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
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
                            <div className="inline-flex items-center gap-1.5 mb-3">
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

                    {/* Quick Info: Education & Experience */}
                    {(hasEducation || member.experience_years) && (
                        <div className="space-y-3.5 mb-6">
                            {/* Experience Row */}
                            {member.experience_years && (
                                <div className="rounded-2xl border p-4 bg-gradient-to-br from-amber-50/70 via-white to-amber-50/30 border-amber-200/60 shadow-xs flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3.5">
                                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 shadow-xs">
                                            <Briefcase className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                                                Pengalaman
                                            </p>
                                            <p className="text-base font-bold text-slate-900 mt-0.5">
                                                {member.experience_years.toLowerCase().includes('tahun') || member.experience_years.toLowerCase().includes('thn')
                                                    ? member.experience_years
                                                    : `${member.experience_years} Tahun`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Education Row */}
                            {hasEducation && (
                                <div className={`rounded-2xl border p-4 bg-gradient-to-br ${
                                    isTeacher 
                                        ? 'from-blue-50/60 via-white to-slate-50/40 border-blue-100' 
                                        : 'from-emerald-50/60 via-white to-slate-50/40 border-emerald-100'
                                } shadow-xs`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2.5">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                                isTeacher ? 'bg-blue-100 text-[#2546a1]' : 'bg-emerald-100 text-emerald-700'
                                            }`}>
                                                <GraduationCap className="w-4 h-4" />
                                            </div>
                                            <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                                {educations.length > 1 ? 'Riwayat Pendidikan' : 'Pendidikan Terakhir'}
                                            </p>
                                        </div>
                                        {educations.length > 1 && (
                                            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                                                isTeacher 
                                                    ? 'text-[#2546a1] bg-blue-50 border-blue-200/70' 
                                                    : 'text-emerald-700 bg-emerald-50 border-emerald-200/70'
                                            }`}>
                                                {educations.length} Jenjang
                                            </span>
                                        )}
                                    </div>

                                    {educations.length === 1 ? (
                                        <p className="text-sm font-normal text-slate-800 pl-0.5">
                                            {educations[0]}
                                        </p>
                                    ) : (
                                        <div className="space-y-2">
                                            {educations.map((edu, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/90 border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors"
                                                >
                                                    <span className={`w-5 h-5 rounded-md text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                                                        isTeacher ? 'bg-blue-50 text-[#2546a1]' : 'bg-emerald-50 text-emerald-700'
                                                    }`}>
                                                        {idx + 1}
                                                    </span>
                                                    <p className="text-sm font-normal text-slate-800 leading-snug">
                                                        {edu}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
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
