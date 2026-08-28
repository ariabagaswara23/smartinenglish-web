"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubProgram } from "@/types/program";
import { subProgramFormSchema, SubProgramFormValues } from "@/schemas/program";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import { upsertSubProgram } from "@/app/admin/programs/actions";
import { createClient } from "@/utils/supabase/client";
import { BookOpen, Loader2, X } from "lucide-react";

interface SubProgramFormDialogProps {
  programId: string;
  subProgram?: SubProgram | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function SubProgramFormDialog({
  programId,
  subProgram,
  open,
  onOpenChange,
  onSuccess,
}: SubProgramFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [isDiscountActive, setIsDiscountActive] = useState(subProgram?.is_discount_active ?? false);
  const [materi, setMateri] = useState<string[]>(subProgram?.materi || []);
  const [materiInput, setMateriInput] = useState("");
  
  const [moduleImages, setModuleImages] = useState<string[]>(subProgram?.module_images || []);
  const [uploadingImage, setUploadingImage] = useState(false);

  const supabase = createClient();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SubProgramFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(subProgramFormSchema) as any,
    defaultValues: {
      name: "",
      badge: "",
      description: "",
      jadwal: "",
      order_index: 0,
      harga_daftar: undefined,
      spp_bulanan: undefined,
      spp_label: "",
      spp_note: "",
      harga_modul: null,
      harga_ujian: null,
      is_discount_active: false,
      discount_percentage: null,
      harga_daftar_discount: null,
      spp_bulanan_discount: null,
      is_active: true,
      materi: [],
      module_images: [],
    },
  });

  useEffect(() => {
    if (open) {
      if (subProgram) {
        reset({
          name: subProgram.name,
          badge: subProgram.badge || "",
          description: subProgram.description,
          jadwal: subProgram.jadwal,
          order_index: subProgram.order_index ?? 0,
          harga_daftar: subProgram.harga_daftar,
          spp_bulanan: subProgram.spp_bulanan,
          spp_label: subProgram.spp_label || "",
          spp_note: subProgram.spp_note || "",
          harga_modul: subProgram.harga_modul ?? null,
          harga_ujian: subProgram.harga_ujian ?? null,
          is_discount_active: subProgram.is_discount_active,
          discount_percentage: subProgram.discount_percentage ?? null,
          harga_daftar_discount: subProgram.harga_daftar_discount ?? null,
          spp_bulanan_discount: subProgram.spp_bulanan_discount ?? null,
          is_active: subProgram.is_active ?? true,
          materi: subProgram.materi || [],
          module_images: subProgram.module_images || [],
        });
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsDiscountActive(subProgram.is_discount_active);
        setMateri(subProgram.materi || []);
        setModuleImages(subProgram.module_images || []);
      } else {
        reset({
          name: "",
          badge: "",
          description: "",
          jadwal: "",
          order_index: 0,
          harga_daftar: undefined,
          spp_bulanan: undefined,
          spp_label: "",
          spp_note: "",
          harga_modul: null,
          harga_ujian: null,
          is_discount_active: false,
          discount_percentage: null,
          harga_daftar_discount: null,
          spp_bulanan_discount: null,
          is_active: true,
          materi: [],
          module_images: [],
        });
        setIsDiscountActive(false);
        setMateri([]);
        setModuleImages([]);
      }
      setMateriInput("");
    }
  }, [open, subProgram, reset]);

  const handleAddMateri = () => {
    if (materiInput.trim()) {
      const updated = [...materi, materiInput.trim()];
      setMateri(updated);
      setValue("materi", updated, { shouldValidate: true });
      setMateriInput("");
    }
  };

  const handleRemoveMateri = (index: number) => {
    const updated = materi.filter((_, i) => i !== index);
    setMateri(updated);
    setValue("materi", updated, { shouldValidate: true });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("program-modules")
      .upload(filePath, file);

    if (uploadError) {
      toast.add({
        title: "Gagal Upload Gambar",
        description: uploadError.message,
        type: "error",
      });
      setUploadingImage(false);
      return;
    }

    const { data } = supabase.storage.from("program-modules").getPublicUrl(filePath);
    
    if (data?.publicUrl) {
      const updated = [...moduleImages, data.publicUrl];
      setModuleImages(updated);
      setValue("module_images", updated, { shouldValidate: true });
    }
    setUploadingImage(false);
    
    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    const updated = moduleImages.filter((_, i) => i !== index);
    setModuleImages(updated);
    setValue("module_images", updated, { shouldValidate: true });
  };

  const onSubmit = async (values: SubProgramFormValues) => {
    setLoading(true);

    const payload: Partial<SubProgram> = {
      id: subProgram?.id,
      program_id: programId,
      name: values.name,
      description: values.description,
      badge: values.badge ? values.badge.trim() : null,
      jadwal: values.jadwal,
      
      // Numeric price values (BIGINT)
      harga_daftar: values.harga_daftar,
      spp_bulanan: values.spp_bulanan,
      spp_label: values.spp_label ? values.spp_label.trim() : null,
      spp_note: values.spp_note ? values.spp_note.trim() : null,
      harga_modul: values.harga_modul !== undefined ? values.harga_modul : null,
      harga_ujian: values.harga_ujian !== undefined ? values.harga_ujian : null,
      
      is_discount_active: isDiscountActive,
      discount_percentage: isDiscountActive ? (values.discount_percentage ?? null) : null,
      harga_daftar_discount: isDiscountActive ? (values.harga_daftar_discount ?? null) : null,
      spp_bulanan_discount: isDiscountActive ? (values.spp_bulanan_discount ?? null) : null,
      
      order_index: subProgram?.order_index !== undefined ? subProgram.order_index : undefined,
      is_active: subProgram?.is_active ?? true,
      
      materi,
      module_images: moduleImages,
    };

    const res = await upsertSubProgram(payload);
    setLoading(false);

    if (res.success) {
      toast.add({
        title: subProgram ? "Sub-Program Diperbarui" : "Sub-Program Ditambahkan",
        description: `Data sub-program "${values.name}" berhasil disimpan.`,
        type: "success",
      });
      onSuccess();
      onOpenChange(false);
    } else {
      toast.add({
        title: "Gagal Menyimpan",
        description: res.error || "Terjadi kesalahan saat menyimpan data.",
        type: "error",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">{subProgram ? "Edit Sub-Program" : "Tambah Sub-Program"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Sub-Program *</Label>
              <Input
                id="name"
                placeholder="e.g. English for Kids"
                {...register("name")}
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="badge">Badge Jenjang (Opsional)</Label>
              <Input
                id="badge"
                placeholder="e.g. SD / SMP / SMA"
                {...register("badge")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi *</Label>
            <Textarea
              id="description"
              placeholder="Deskripsi singkat program belajar..."
              rows={3}
              {...register("description")}
              aria-invalid={!!errors.description}
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="jadwal">Jadwal Pertemuan *</Label>
            <Input
              id="jadwal"
              placeholder="2× seminggu, 60 menit per pertemuan"
              {...register("jadwal")}
              aria-invalid={!!errors.jadwal}
            />
            {errors.jadwal && <p className="text-xs text-destructive">{errors.jadwal.message}</p>}
          </div>

          {/* Biaya Normal */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-base mb-1">Biaya Program</h4>
            <p className="text-xs text-muted-foreground mb-4">
              Masukkan angka murni tanpa titik atau tanda mata uang (contoh: 150000).
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="harga_daftar">Biaya Pendaftaran *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium select-none pointer-events-none">
                    Rp
                  </span>
                  <Input
                    id="harga_daftar"
                    type="number"
                    min={0}
                    step={1000}
                    className="pl-10"
                    placeholder="150000"
                    {...register("harga_daftar")}
                    aria-invalid={!!errors.harga_daftar}
                  />
                </div>
                {errors.harga_daftar && <p className="text-xs text-destructive">{errors.harga_daftar.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="spp_bulanan">SPP Bulanan / Paket *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium select-none pointer-events-none">
                    Rp
                  </span>
                  <Input
                    id="spp_bulanan"
                    type="number"
                    min={0}
                    step={1000}
                    className="pl-10"
                    placeholder="350000"
                    {...register("spp_bulanan")}
                    aria-invalid={!!errors.spp_bulanan}
                  />
                </div>
                {errors.spp_bulanan && <p className="text-xs text-destructive">{errors.spp_bulanan.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="spp_label">Label SPP (Opsional)</Label>
                <Input
                  id="spp_label"
                  placeholder="e.g. Harga Paket / SPP Bulanan"
                  {...register("spp_label")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="spp_note">Catatan SPP (Opsional)</Label>
                <Input
                  id="spp_note"
                  placeholder="e.g. Dibayar di awal per paket"
                  {...register("spp_note")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="harga_modul">Harga Modul (Opsional)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium select-none pointer-events-none">
                    Rp
                  </span>
                  <Input
                    id="harga_modul"
                    type="number"
                    min={0}
                    step={1000}
                    className="pl-10"
                    placeholder="100000"
                    {...register("harga_modul")}
                    aria-invalid={!!errors.harga_modul}
                  />
                </div>
                {errors.harga_modul && <p className="text-xs text-destructive">{errors.harga_modul.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="harga_ujian">Harga Ujian (Opsional)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium select-none pointer-events-none">
                    Rp
                  </span>
                  <Input
                    id="harga_ujian"
                    type="number"
                    min={0}
                    step={1000}
                    className="pl-10"
                    placeholder="50000"
                    {...register("harga_ujian")}
                    aria-invalid={!!errors.harga_ujian}
                  />
                </div>
                {errors.harga_ujian && <p className="text-xs text-destructive">{errors.harga_ujian.message}</p>}
              </div>
            </div>
          </div>

          {/* Promo / Diskon */}
          <div className="border-t pt-4 bg-muted/40 p-4 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-sm">Promo / Diskon Khusus</h4>
                <p className="text-xs text-muted-foreground">Aktifkan untuk memberikan harga promo tercoret</p>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="is_discount_active" className="text-xs cursor-pointer">
                  {isDiscountActive ? "Promo Aktif" : "Non-Aktif"}
                </Label>
                <Switch 
                  id="is_discount_active" 
                  checked={isDiscountActive} 
                  onCheckedChange={(checked) => {
                    setIsDiscountActive(checked);
                    setValue("is_discount_active", checked, { shouldValidate: true });
                  }} 
                />
              </div>
            </div>
            
            {isDiscountActive && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="discount_percentage">Persentase Diskon (%)</Label>
                  <div className="relative">
                    <Input
                      id="discount_percentage"
                      type="number"
                      min={0}
                      max={100}
                      className="pr-8"
                      placeholder="20"
                      {...register("discount_percentage")}
                      aria-invalid={!!errors.discount_percentage}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium select-none pointer-events-none">
                      %
                    </span>
                  </div>
                  {errors.discount_percentage && <p className="text-xs text-destructive">{errors.discount_percentage.message}</p>}
                </div>
                
                <div className="hidden sm:block"></div>

                <div className="space-y-2">
                  <Label htmlFor="harga_daftar_discount">Promo Biaya Pendaftaran</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium select-none pointer-events-none">
                      Rp
                    </span>
                    <Input
                      id="harga_daftar_discount"
                      type="number"
                      min={0}
                      step={1000}
                      className="pl-10"
                      placeholder="0"
                      {...register("harga_daftar_discount")}
                      aria-invalid={!!errors.harga_daftar_discount}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">Isi 0 jika gratis pendaftaran</p>
                  {errors.harga_daftar_discount && <p className="text-xs text-destructive">{errors.harga_daftar_discount.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="spp_bulanan_discount">Promo SPP</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium select-none pointer-events-none">
                      Rp
                    </span>
                    <Input
                      id="spp_bulanan_discount"
                      type="number"
                      min={0}
                      step={1000}
                      className="pl-10"
                      placeholder="250000"
                      {...register("spp_bulanan_discount")}
                      aria-invalid={!!errors.spp_bulanan_discount}
                    />
                  </div>
                  {errors.spp_bulanan_discount && <p className="text-xs text-destructive">{errors.spp_bulanan_discount.message}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Materi Pembelajaran */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-sm mb-2">Materi Pembelajaran</h4>
            <div className="flex gap-2 mb-2">
              <Input 
                value={materiInput} 
                onChange={(e) => setMateriInput(e.target.value)} 
                placeholder="Ketik poin materi lalu klik Tambah..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddMateri();
                  }
                }}
              />
              <Button type="button" onClick={handleAddMateri} variant="secondary">Tambah</Button>
            </div>
            {materi.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-3">
                {materi.map((m, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 border border-slate-200/60 text-xs font-medium text-slate-700 transition-all group"
                  >
                    <span>{m}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMateri(idx)}
                      className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-0.5 rounded-full transition-colors ml-0.5"
                      title="Hapus materi"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 mt-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-slate-400">
                <BookOpen className="w-4 h-4 text-slate-300 shrink-0" />
                <p className="text-xs">Belum ada materi pembelajaran yang ditambahkan.</p>
              </div>
            )}
          </div>

          {/* Galeri Modul / Buku */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-sm mb-2">Galeri Modul / Buku</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  disabled={uploadingImage}
                />
                {uploadingImage && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Mengupload...
                  </span>
                )}
              </div>
              
              {moduleImages.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {moduleImages.map((img, idx) => (
                    <div key={idx} className="relative w-24 h-24 border rounded-xl overflow-hidden group shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={`Module ${idx + 1}`} className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-90 group-hover:opacity-100 shadow transition-opacity"
                        aria-label="Hapus gambar"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t mt-8">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Batal
            </Button>
            <Button type="submit" disabled={loading} className="bg-[#2546a1] hover:bg-[#1a347d] text-white">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {subProgram ? "Simpan Perubahan" : "Simpan Sub-Program"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
