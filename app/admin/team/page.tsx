import { Metadata } from 'next'
import { TeamTable } from '@/components/admin/team/TeamTable'
import { Users } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Kelola Tim — Admin SMART in ENGLISH',
}

export default function TeamAdminPage() {
    return (
        <div className="space-y-8 max-w-6xl">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                        <Users className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Kelola Tim</h1>
                        <p className="text-sm text-slate-500">
                            Atur data tim pengajar dan staff SMART in ENGLISH
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <TeamTable />
        </div>
    )
}
