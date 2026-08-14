"use client";

import { useState, useEffect } from "react";
import { Program } from "@/types/program";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { upsertProgram } from "@/app/admin/programs/actions";
import { 
  Edit2, Search, ChevronDown,
  Languages, Percent, Pencil, HeartHandshake, Target, UserCheck, 
  BookOpen, GraduationCap, Award, Calculator, Computer, Brain, 
  Compass, Microscope, Music, Palette, School, Book
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const CURATED_ICONS = [
  { name: 'Languages', icon: Languages },
  { name: 'Percent', icon: Percent },
  { name: 'Pencil', icon: Pencil },
  { name: 'HeartHandshake', icon: HeartHandshake },
  { name: 'Target', icon: Target },
  { name: 'UserCheck', icon: UserCheck },
  { name: 'BookOpen', icon: BookOpen },
  { name: 'GraduationCap', icon: GraduationCap },
  { name: 'Award', icon: Award },
  { name: 'Calculator', icon: Calculator },
  { name: 'Computer', icon: Computer },
  { name: 'Brain', icon: Brain },
  { name: 'Compass', icon: Compass },
  { name: 'Microscope', icon: Microscope },
  { name: 'Music', icon: Music },
  { name: 'Palette', icon: Palette },
  { name: 'School', icon: School },
  { name: 'Book', icon: Book },
];

// --- PRESET COLORS ---
export const PROGRAM_COLOR_PRESETS = [
  // --- PRIMARY & NEUTRAL CLASSICS ---
  { name: 'Blue Ocean', value: 'blue', color: 'bg-blue-600', accentClass: 'text-blue-700', badgeBg: 'bg-blue-50', borderAccent: 'border-blue-200', previewHex: '#2563eb' },
  { name: 'Sky Blue', value: 'sky', color: 'bg-sky-500', accentClass: 'text-sky-700', badgeBg: 'bg-sky-50', borderAccent: 'border-sky-200', previewHex: '#0ea5e9' },
  { name: 'Indigo Deep', value: 'indigo', color: 'bg-indigo-600', accentClass: 'text-indigo-700', badgeBg: 'bg-indigo-50', borderAccent: 'border-indigo-200', previewHex: '#4f46e5' },
  { name: 'Slate Modern', value: 'slate', color: 'bg-slate-700', accentClass: 'text-slate-800', badgeBg: 'bg-slate-100', borderAccent: 'border-slate-300', previewHex: '#334155' },
  // --- GREENS & NATURE ---
  { name: 'Emerald Green', value: 'emerald', color: 'bg-emerald-600', accentClass: 'text-emerald-700', badgeBg: 'bg-emerald-50', borderAccent: 'border-emerald-200', previewHex: '#059669' },
  { name: 'Teal Fresh', value: 'teal', color: 'bg-teal-600', accentClass: 'text-teal-700', badgeBg: 'bg-teal-50', borderAccent: 'border-teal-200', previewHex: '#0d9488' },
  { name: 'Cyan Tropical', value: 'cyan', color: 'bg-cyan-600', accentClass: 'text-cyan-700', badgeBg: 'bg-cyan-50', borderAccent: 'border-cyan-200', previewHex: '#0891b2' },
  { name: 'Lime Bright', value: 'lime', color: 'bg-lime-600', accentClass: 'text-lime-800', badgeBg: 'bg-lime-50', borderAccent: 'border-lime-200', previewHex: '#65a30d' },
  // --- WARMS & ENERGETIC ---
  { name: 'Orange Warm', value: 'orange', color: 'bg-orange-500', accentClass: 'text-orange-700', badgeBg: 'bg-orange-50', borderAccent: 'border-orange-200', previewHex: '#f97316' },
  { name: 'Amber Gold', value: 'amber', color: 'bg-amber-500', accentClass: 'text-amber-700', badgeBg: 'bg-amber-50', borderAccent: 'border-amber-200', previewHex: '#f59e0b' },
  { name: 'Yellow Sun', value: 'yellow', color: 'bg-yellow-500', accentClass: 'text-yellow-800', badgeBg: 'bg-yellow-50', borderAccent: 'border-yellow-200', previewHex: '#eab308' },
  // --- PURPLE, PINK & REDS ---
  { name: 'Rose Red', value: 'rose', color: 'bg-rose-600', accentClass: 'text-rose-700', badgeBg: 'bg-rose-50', borderAccent: 'border-rose-200', previewHex: '#e11d48' },
  { name: 'Red Crimson', value: 'red', color: 'bg-red-600', accentClass: 'text-red-700', badgeBg: 'bg-red-50', borderAccent: 'border-red-200', previewHex: '#dc2626' },
  { name: 'Pink Blossom', value: 'pink', color: 'bg-pink-500', accentClass: 'text-pink-700', badgeBg: 'bg-pink-50', borderAccent: 'border-pink-200', previewHex: '#ec4899' },
  { name: 'Fuchsia Neon', value: 'fuchsia', color: 'bg-fuchsia-600', accentClass: 'text-fuchsia-700', badgeBg: 'bg-fuchsia-50', borderAccent: 'border-fuchsia-200', previewHex: '#c026d3' },
  { name: 'Violet Purple', value: 'violet', color: 'bg-violet-600', accentClass: 'text-violet-700', badgeBg: 'bg-violet-50', borderAccent: 'border-violet-200', previewHex: '#7c3aed' },
  { name: 'Purple Royal', value: 'purple', color: 'bg-purple-600', accentClass: 'text-purple-700', badgeBg: 'bg-purple-50', borderAccent: 'border-purple-200', previewHex: '#9333ea' },
];

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-');    // Replace multiple - with single -
}

interface ProgramFormDialogProps {
  program?: Program | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function ProgramFormDialog({ program, open, onOpenChange, onSuccess }: ProgramFormDialogProps) {
  const [loading, setLoading] = useState(false);

  // Form states
  const [title, setTitle] = useState(program?.title || "");
  const [id, setId] = useState(program?.id || "");
  const [isIdManual, setIsIdManual] = useState(!!program); // If editing, ID is manual by default (already exists)
  const [iconName, setIconName] = useState(program?.icon_name || "Book");
  const [iconSearchQuery, setIconSearchQuery] = useState("");
  const [isIconPopoverOpen, setIsIconPopoverOpen] = useState(false);
  
  // Selected preset state
  const getInitialPreset = () => {
    if (!program) return PROGRAM_COLOR_PRESETS[0]; // Default
    return PROGRAM_COLOR_PRESETS.find(p => p.color === program.color) || PROGRAM_COLOR_PRESETS[0];
  };
  const [selectedPreset, setSelectedPreset] = useState(getInitialPreset());

  // Auto slugify
  useEffect(() => {
    if (!isIdManual && !program) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setId(slugify(title));
    }
  }, [title, isIdManual, program]);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle(program?.title || "");
      setId(program?.id || "");
      setIsIdManual(!!program);
      setIconName(program?.icon_name || "Book");
      setSelectedPreset(getInitialPreset());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, program]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: Partial<Program> = {
      id: program?.id || id, // use state ID
      title: formData.get("title") as string,
      icon_name: formData.get("icon_name") as string,
      color: selectedPreset.color,
      accent_class: selectedPreset.accentClass,
      badge_bg: selectedPreset.badgeBg,
      border_accent: selectedPreset.borderAccent,
      description: formData.get("description") as string,
      order_index: parseInt(formData.get("order_index") as string) || 0,
      is_active: program?.is_active ?? true,
    };

    const res = await upsertProgram(data);
    setLoading(false);

    if (res.success) {
      alert("Program saved successfully");
      onSuccess();
      onOpenChange(false);
    } else {
      alert("Failed to save program: " + res.error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-bold text-slate-900">{program ? "Edit Program" : "Add Program"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="font-semibold">Judul Program</Label>
              <Input 
                id="title" 
                name="title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Bahasa Inggris" 
                required 
              />
            </div>

            {!program && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="id" className="font-semibold">Program ID (Slug)</Label>
                  <button
                    type="button"
                    onClick={() => setIsIdManual(!isIdManual)}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    {isIdManual ? "Auto Generate" : "Edit ID"}
                  </button>
                </div>
                <Input 
                  id="id" 
                  name="id" 
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="e.g. bahasa-inggris" 
                  readOnly={!isIdManual}
                  className={cn(!isIdManual && "bg-slate-100 text-slate-500 cursor-not-allowed")}
                  required 
                />
                {!isIdManual && <p className="text-xs text-slate-500">Otomatis digenerate dari Judul Program.</p>}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="description" className="font-semibold">Deskripsi</Label>
              <Textarea 
                id="description" 
                name="description" 
                defaultValue={program?.description} 
                placeholder="Penjelasan singkat program..."
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="icon_name" className="font-semibold">Icon Name (Lucide)</Label>
                <input type="hidden" name="icon_name" value={iconName} />
                <Popover open={isIconPopoverOpen} onOpenChange={setIsIconPopoverOpen}>
                  <PopoverTrigger render={
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={isIconPopoverOpen}
                      className="w-full justify-between"
                    />
                  }>
                      <div className="flex items-center gap-2">
                        {(() => {
                          const SelectedIcon = CURATED_ICONS.find(i => i.name === iconName)?.icon || Book;
                          return <SelectedIcon className="w-4 h-4 text-slate-500" />;
                        })()}
                        <span>{iconName}</span>
                      </div>
                      <ChevronDown className="w-4 h-4 opacity-50" />
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <div className="p-2 border-b border-slate-100 flex items-center gap-2">
                      <Search className="w-4 h-4 text-slate-400" />
                      <input
                        className="flex-1 bg-transparent border-none focus:outline-none text-sm placeholder:text-slate-400"
                        placeholder="Cari icon..."
                        value={iconSearchQuery}
                        onChange={(e) => setIconSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key !== 'Escape') {
                            e.stopPropagation();
                          }
                        }}
                      />
                    </div>
                    <div className="p-2 max-h-[200px] overflow-y-auto">
                      <div className="grid grid-cols-4 gap-2">
                        {CURATED_ICONS.filter(i => i.name.toLowerCase().includes(iconSearchQuery.toLowerCase())).length > 0 ? (
                          CURATED_ICONS.filter(i => i.name.toLowerCase().includes(iconSearchQuery.toLowerCase())).map((icon) => {
                            const IconComp = icon.icon;
                            return (
                              <button
                                key={icon.name}
                                type="button"
                                onClick={() => {
                                  setIconName(icon.name);
                                  setIsIconPopoverOpen(false);
                                }}
                                className={cn(
                                  "flex flex-col items-center justify-center p-2 rounded-lg transition-colors hover:bg-slate-100 group",
                                  iconName === icon.name && "bg-primary/10 text-primary ring-1 ring-primary"
                                )}
                                title={icon.name}
                              >
                                <IconComp className={cn(
                                  "w-6 h-6 text-slate-500 group-hover:text-slate-900 transition-colors",
                                  iconName === icon.name && "text-primary"
                                )} />
                              </button>
                            );
                          })
                        ) : (
                          <div className="col-span-4 p-4 text-center text-sm text-slate-500">
                            Icon tidak ditemukan.
                          </div>
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <p className="text-[10px] text-slate-500">Lihat icon lain di <Link href="https://lucide.dev/icons" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">lucide.dev/icons</Link></p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="order_index" className="font-semibold">Urutan Tampil (Order Index)</Label>
                <Input id="order_index" name="order_index" type="number" defaultValue={program?.order_index || 0} required />
              </div>
            </div>
          </div>

          {/* Color Palette Section */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div>
              <Label className="font-semibold">Tema Warna Program</Label>
              <p className="text-xs text-slate-500 mt-1">Pilih kombinasi warna yang akan digunakan untuk tampilan program ini.</p>
            </div>
            
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-3">
              {PROGRAM_COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setSelectedPreset(preset)}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                    selectedPreset.value === preset.value 
                      ? "ring-2 ring-offset-2 ring-primary scale-110 shadow-md" 
                      : "hover:scale-105 hover:shadow"
                  )}
                  style={{ backgroundColor: preset.previewHex }}
                  title={preset.name}
                >
                  {selectedPreset.value === preset.value && (
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            
            {/* Selected Color Preview */}
            <div className="mt-4 p-4 rounded-xl border border-slate-100 flex items-center gap-4 bg-white">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shadow-sm", selectedPreset.color)}>
                {(() => {
                  const SelectedIconPreview = CURATED_ICONS.find(i => i.name === iconName)?.icon || Book;
                  return <SelectedIconPreview className="w-6 h-6 text-white" />;
                })()}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{selectedPreset.name}</p>
                <div className="flex gap-2 mt-1">
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", selectedPreset.badgeBg, selectedPreset.accentClass)}>Badge</span>
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full border bg-white font-medium", selectedPreset.borderAccent, selectedPreset.accentClass)}>Border Outline</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-slate-100">
            <Button type="button" variant="outline" className="mr-2" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-white">
              {loading ? "Menyimpan..." : "Simpan Program"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
