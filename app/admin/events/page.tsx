import { Metadata } from 'next'
import { EventsTable } from '@/components/admin/events/EventsTable'
import { Calendar } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Kelola Events — Admin SMART in ENGLISH',
    description: 'Manajemen data event dan kegiatan SMART in ENGLISH',
}

export default function EventsAdminPage() {
    return (
        <div className="space-y-8 max-w-7xl">
            {/* Page Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                        <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Kelola Events
                        </h1>
                        <p className="text-sm text-slate-500">
                            Atur data event, poster kegiatan, dan status unggulan SMART in ENGLISH
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <EventsTable />
        </div>
    )
}
