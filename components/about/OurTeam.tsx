import { GraduationCap, Users } from "lucide-react";
import { getPublicTeamMembers } from "@/app/admin/team/actions";
import { TeamMember } from "@/types/team";
import { TeamGrid } from "./TeamGrid";

interface OurTeamProps {
  members?: TeamMember[];
}

export default async function OurTeam({ members }: OurTeamProps) {
  const teamData = members ?? (await getPublicTeamMembers());

  const teachers = teamData
    .filter((m) => m.type === "teacher")
    .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));

  const staff = teamData
    .filter((m) => m.type === "staff")
    .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));

  const hasNoMembers = teachers.length === 0 && staff.length === 0;

  return (
    <section className="py-20 lg:py-28 bg-slate-50/50" id="our-team">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Main Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center space-x-2 px-4 py-1.5 rounded-full border border-blue-100 bg-blue-50/50 mb-6 shadow-sm">
            <span className="text-[12px] font-bold tracking-[0.15em] text-primary uppercase">
              Keluarga Besar SMILE
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0f172a] leading-tight mb-6 tracking-tight">
            Sosok di Balik <span className="italic text-primary font-serif">SMART in ENGLISH</span>
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
            Dipandu oleh para pengajar berpengalaman dan didukung tim manajemen yang berdedikasi tinggi untuk kesuksesan belajar Anda.
          </p>
        </div>

        {hasNoMembers && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-xl mx-auto">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Informasi tim sedang dalam proses pembaruan.</p>
          </div>
        )}

        {staff.length > 0 && (
          <div className="space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200/80 pb-6 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-100">
                  <Users className="w-3.5 h-3.5" />
                  Manajemen & Operasional
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                  Tim Staff & Manajemen
                </h3>
              </div>
              <p className="text-slate-500 text-sm sm:max-w-md text-left sm:text-right">
                Sosok di balik layar yang memastikan proses pembelajaran, pelayanan, dan administrasi berjalan optimal.
              </p>
            </div>

            <TeamGrid members={staff} />
          </div>
        )}

        {/* Section 2: Tim Pengajar */}
        {teachers.length > 0 && (
          <div className="space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200/80 pb-6 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-primary text-xs font-semibold uppercase tracking-wider mb-2 border border-blue-100">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Instruktur & Pengajar
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                  Tim Pengajar Kami
                </h3>
              </div>
              <p className="text-slate-500 text-sm sm:max-w-md text-left sm:text-right">
                Pendidik berpengalaman dan tersertifikasi yang siap membimbing Anda dengan metode interaktif.
              </p>
            </div>

            <TeamGrid members={teachers} />
          </div>
        )}

      </div>
    </section>
  );
}
