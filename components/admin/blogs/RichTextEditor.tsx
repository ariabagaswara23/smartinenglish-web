'use client'

import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Link as LinkIcon, Unlink } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    isError?: boolean
}

const ToggleButton = ({ 
    isActive, 
    onClick, 
    children 
}: { 
    isActive: boolean
    onClick: () => void
    children: React.ReactNode 
}) => (
    <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onClick}
        className={`h-8 w-8 p-0 ${isActive ? 'bg-slate-200 text-slate-900' : 'text-slate-600'}`}
    >
        {children}
    </Button>
)

export function RichTextEditor({ value, onChange, isError }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-[#2546a1] underline cursor-pointer',
                },
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose prose-slate max-w-none w-full min-h-[350px] p-4 focus:outline-none',
            },
        },
    })

    // To ensure initialData is loaded if editor renders after data is available,
    // though `content: value` usually handles the first render.
    // If value changes externally (not recommended for Tiptap typically), we can update it.
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            // Only update if it's completely different to avoid losing cursor position
            // But since this is for initial data loading, it's fine.
            // Actually, `content: value` is enough if value is present at mount.
        }
    }, [value, editor])

    if (!editor) {
        return null
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        if (url === null) {
            return
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }

    return (
        <div className={`border rounded-xl overflow-hidden bg-white shadow-sm ${isError ? 'border-red-500 focus-within:ring-1 focus-within:ring-red-500' : 'border-slate-200 focus-within:ring-1 focus-within:ring-[#2546a1]'}`}>
            <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2">
                <ToggleButton
                    isActive={editor.isActive('bold')}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <Bold className="h-4 w-4" />
                </ToggleButton>
                <ToggleButton
                    isActive={editor.isActive('italic')}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <Italic className="h-4 w-4" />
                </ToggleButton>
                
                <div className="w-[1px] h-4 bg-slate-300 mx-1" />
                
                <ToggleButton
                    isActive={editor.isActive('heading', { level: 2 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                    <Heading2 className="h-4 w-4" />
                </ToggleButton>
                <ToggleButton
                    isActive={editor.isActive('heading', { level: 3 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                >
                    <Heading3 className="h-4 w-4" />
                </ToggleButton>
                
                <div className="w-[1px] h-4 bg-slate-300 mx-1" />
                
                <ToggleButton
                    isActive={editor.isActive('bulletList')}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                    <List className="h-4 w-4" />
                </ToggleButton>
                <ToggleButton
                    isActive={editor.isActive('orderedList')}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    <ListOrdered className="h-4 w-4" />
                </ToggleButton>
                
                <div className="w-[1px] h-4 bg-slate-300 mx-1" />
                
                <ToggleButton
                    isActive={editor.isActive('link')}
                    onClick={setLink}
                >
                    <LinkIcon className="h-4 w-4" />
                </ToggleButton>
                <ToggleButton
                    isActive={false}
                    onClick={() => editor.chain().focus().unsetLink().run()}
                >
                    <Unlink className="h-4 w-4" />
                </ToggleButton>
            </div>
            <EditorContent editor={editor} className="bg-white" />
        </div>
    )
}
