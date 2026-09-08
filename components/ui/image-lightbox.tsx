'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'

export interface LightboxItem {
    src: string
    alt?: string | null
    title?: string | null
    badge?: string | null
    isFeatured?: boolean
}

export interface ImageLightboxProps {
    isOpen: boolean
    onClose: () => void
    items: LightboxItem[]
    currentIndex?: number
}

export function ImageLightbox({
    isOpen,
    onClose,
    items,
    currentIndex = 0,
}: ImageLightboxProps) {
    const [mounted, setMounted] = React.useState(false)
    const [activeIndex, setActiveIndex] = React.useState(currentIndex)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    React.useEffect(() => {
        if (isOpen) {
            setActiveIndex(currentIndex)
        }
    }, [isOpen, currentIndex])

    const total = items.length
    const currentItem = items[activeIndex]

    const handleNext = React.useCallback(() => {
        if (total > 0) {
            setActiveIndex((prev) => (prev + 1) % total)
        }
    }, [total])

    const handlePrev = React.useCallback(() => {
        if (total > 0) {
            setActiveIndex((prev) => (prev === 0 ? total - 1 : prev - 1))
        }
    }, [total])

    // Body scroll lock & Keyboard events
    React.useEffect(() => {
        if (!isOpen) return

        const originalOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose()
            } else if (e.key === 'ArrowRight') {
                handleNext()
            } else if (e.key === 'ArrowLeft') {
                handlePrev()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = originalOverflow
        }
    }, [isOpen, onClose, handleNext, handlePrev])

    if (!mounted || !isOpen || !currentItem || !currentItem.src) {
        return null
    }

    const content = (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Close Button */}
            <button
                type="button"
                onClick={onClose}
                className="absolute top-6 right-6 z-50 p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer"
                aria-label="Close Lightbox"
                title="Tutup (Esc)"
            >
                <X className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            {/* Navigation Prev */}
            {total > 1 && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation()
                        handlePrev()
                    }}
                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 p-3 md:p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer"
                    aria-label="Previous Image"
                    title="Sebelumnya (Arrow Left)"
                >
                    <ChevronLeft className="w-6 h-6 md:w-10 md:h-10" />
                </button>
            )}

            {/* Navigation Next */}
            {total > 1 && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation()
                        handleNext()
                    }}
                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 p-3 md:p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer"
                    aria-label="Next Image"
                    title="Selanjutnya (Arrow Right)"
                >
                    <ChevronRight className="w-6 h-6 md:w-10 md:h-10" />
                </button>
            )}

            {/* Main Image Container */}
            <div
                className="relative w-full max-w-6xl h-full max-h-[85vh] px-4 md:px-20 flex flex-col items-center justify-center"
                onClick={onClose} // Click outside to close
            >
                <div
                    className="relative w-full h-full cursor-auto"
                    onClick={(e) => e.stopPropagation()} // Prevent close when clicking image
                >
                    <Image
                        src={currentItem.src}
                        alt={currentItem.alt || currentItem.title || 'Image preview'}
                        fill
                        className="object-contain"
                        sizes="100vw"
                        priority
                    />
                </div>

                {/* Caption + Badges in Lightbox */}
                {(currentItem.title || currentItem.badge || currentItem.isFeatured) && (
                    <div className="absolute bottom-6 left-0 w-full text-center pointer-events-none px-4">
                        <div className="inline-flex flex-col items-center gap-2">
                            {currentItem.title && (
                                <p className="text-white text-lg md:text-xl font-bold bg-black/60 inline-block px-6 py-2 rounded-full backdrop-blur-md shadow-lg border border-white/10">
                                    {currentItem.title}
                                </p>
                            )}
                            <div className="flex items-center gap-2">
                                {currentItem.badge && (
                                    <span className="text-white text-xs md:text-sm font-semibold bg-primary/80 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm">
                                        {currentItem.badge}
                                    </span>
                                )}
                                {currentItem.isFeatured && (
                                    <span className="inline-flex items-center gap-1 text-amber-300 text-xs md:text-sm font-semibold bg-amber-500/30 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-400/40 shadow-sm">
                                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                        Featured
                                    </span>
                                )}
                                {total > 1 && (
                                    <span className="text-slate-300 text-xs bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full font-mono">
                                        {activeIndex + 1} / {total}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )

    return createPortal(content, document.body)
}
