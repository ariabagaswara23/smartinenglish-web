'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export function AdminBreadcrumbs() {
    const pathname = usePathname()
    
    const segments = pathname.split('/').filter((segment) => segment !== '')
    
    // Hanya tampilkan breadcrumbs untuk rute di bawah /admin
    if (segments[0] !== 'admin') return null
    if (segments.length <= 1) return null
    
    return (
        <Breadcrumb className="mb-6">
            <BreadcrumbList>
                {/* Selalu tambahkan Dashboard sebagai item pertama */}
                <BreadcrumbItem>
                    {segments.length === 2 && segments[1] === 'dashboard' ? (
                        <BreadcrumbPage>Dashboard</BreadcrumbPage>
                    ) : (
                        <BreadcrumbLink render={<Link href="/admin/dashboard" />}>
                            Dashboard
                        </BreadcrumbLink>
                    )}
                </BreadcrumbItem>
                
                {segments.length > 2 || (segments.length === 2 && segments[1] !== 'dashboard') ? (
                    <BreadcrumbSeparator />
                ) : null}

                {segments.slice(1).map((segment, index) => {
                    // Dashboard sudah ditangani di atas
                    if (segment === 'dashboard') return null
                    
                    const isLast = index === segments.slice(1).length - 1
                    
                    // Rekonstruksi URL path
                    const href = `/admin/${segments.slice(1, index + 2).join('/')}`
                    
                    // Format nama segment agar lebih rapi (hilangkan dash, huruf kapital di awal)
                    let formattedSegment = segment.replace(/-/g, ' ')
                    formattedSegment = formattedSegment.charAt(0).toUpperCase() + formattedSegment.slice(1)
                    
                    // Custom formatting untuk ID atau segment tertentu
                    if (segment === 'create') formattedSegment = 'Tambah Baru'
                    else if (segment.length === 36 && segment.includes('-')) formattedSegment = 'Edit' // UUID asusmption
                    
                    return (
                        <React.Fragment key={href}>
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage>{formattedSegment}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink render={<Link href={href} />}>
                                        {formattedSegment}
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            {!isLast && <BreadcrumbSeparator />}
                        </React.Fragment>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
