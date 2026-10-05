'use client'

import * as React from 'react'
import Image from 'next/image'
import { GraduationCap, User, Briefcase, ArrowUpRight } from 'lucide-react'
import { TeamMember } from '@/types/team'
import { TeamDetailModal } from './TeamDetailModal'

interface TeamGridProps {
    members: TeamMember[]
}

export function TeamGrid({ members }: TeamGridProps) {
    const [selectedMember, setSelectedMember] = React.useState<TeamMember | null>(null)

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {members.map((member) => {
                    const isTeacher = member.type === 'teacher'

                    return (
                        <div
                            key={member.id}
                            onClick={() => setSelectedMember(member)}
                            className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer text-left"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault()
                                    setSelectedMember(member)
                                }
                            }}
                        >
                            {/* Photo Container */}
                            <div className="relative aspect-[4/5] w-full bg-slate-100 overflow-hidden">
                                {member.image_url ? (
                                    <Image
                                        src={member.image_url}
                                        alt={`Foto ${member.name}`}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 text-slate-400 p-4 text-center">
                                        <div className="w-16 h-16 rounded-2xl bg-white/90 border border-slate-200 flex items-center justify-center mb-2 shadow-sm text-slate-400">
                                            {isTeacher ? (
                                                <GraduationCap className="w-8 h-8 text-[#2546a1]" />
                                            ) : (
                                                <User className="w-8 h-8 text-emerald-500" />
                                            )}
                                        </div>
                                        <span className="text-xs font-semibold text-slate-600 line-clamp-1">{member.name}</span>
                                    </div>
                                )}

                                {/* Hover Overlay indicator */}
                                <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-xs font-semibold text-slate-900 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                        Lihat Profil
                                        <ArrowUpRight className="w-3.5 h-3.5 text-[#2546a1]" />
                                    </span>
                                </div>
                            </div>

                            {/* Info Container */}
                            <div className="p-5 flex flex-col flex-1 text-center justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#2546a1] transition-colors leading-snug line-clamp-1">
                                        {member.name}
                                    </h3>
                                    <p className={`text-xs font-semibold mt-1 mb-2.5 ${isTeacher ? 'text-[#2546a1]' : 'text-emerald-700'}`}>
                                        {member.role}
                                    </p>

                                    {/* Education & Experience info */}
                                    {(member.education || member.experience_years) && (
                                        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-2.5">
                                            {member.education && (
                                                <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100/90 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200/80 max-w-full truncate" title={member.education}>
                                                    <GraduationCap className="w-3 h-3 text-slate-500 shrink-0" />
                                                    <span className="truncate">{member.education}</span>
                                                </span>
                                            )}
                                            {member.experience_years && (
                                                <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200/70 shrink-0">
                                                    <Briefcase className="w-3 h-3 text-amber-600" />
                                                    {member.experience_years.toLowerCase().includes('tahun') || member.experience_years.toLowerCase().includes('thn')
                                                        ? member.experience_years
                                                        : `${member.experience_years} Thn`}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Subject Categories for Teachers */}
                                    {isTeacher && member.subject_category && member.subject_category.length > 0 && (
                                        <div className="flex flex-wrap justify-center gap-1">
                                            {member.subject_category.slice(0, 3).map((subject, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-block text-[10px] font-medium bg-blue-50 text-[#2546a1] px-2 py-0.5 rounded-full border border-blue-100/80"
                                                >
                                                    {subject}
                                                </span>
                                            ))}
                                            {member.subject_category.length > 3 && (
                                                <span className="inline-block text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">
                                                    +{member.subject_category.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-center text-xs font-semibold text-[#2546a1] group-hover:text-[#1a347d] transition-colors">
                                    <span>Lihat Profil Lengkap</span>
                                    <ArrowUpRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <TeamDetailModal
                member={selectedMember}
                isOpen={!!selectedMember}
                onClose={() => setSelectedMember(null)}
            />
        </>
    )
}
