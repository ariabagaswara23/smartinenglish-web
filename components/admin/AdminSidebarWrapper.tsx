'use client'

import { useState } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import { AdminBreadcrumbs } from './AdminBreadcrumbs'

interface AdminSidebarWrapperProps {
    user: {
        email?: string
        full_name?: string | null
    }
    children: React.ReactNode
}

export default function AdminSidebarWrapper({ user, children }: AdminSidebarWrapperProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <>
            <AdminSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0 min-h-screen">
                <AdminHeader
                    user={user}
                    onMenuOpen={() => setSidebarOpen(true)}
                />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
                    <AdminBreadcrumbs />
                    {children}
                </main>
            </div>
        </>
    )
}
