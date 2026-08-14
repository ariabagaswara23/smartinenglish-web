"use client";

import { useState } from "react";
import { SubProgram } from "@/types/program";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { upsertSubProgram } from "@/app/admin/programs/actions";
import { createClient } from "@/utils/supabase/client";

interface SubProgramFormDialogProps {
  programId: string;
  subProgram?: SubProgram | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function SubProgramFormDialog({ programId, subProgram, open, onOpenChange, onSuccess }: SubProgramFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [isDiscountActive, setIsDiscountActive] = useState(subProgram?.is_discount_active ?? false);
  const [materi, setMateri] = useState<string[]>(subProgram?.materi || []);
  const [materiInput, setMateriInput] = useState("");
  
  const [moduleImages, setModuleImages] = useState<string[]>(subProgram?.module_images || []);
  const [uploadingImage, setUploadingImage] = useState(false);

  const supabase = createClient();

  const handleAddMateri = () => {
    if (materiInput.trim()) {
      setMateri([...materi, materiInput.trim()]);
      setMateriInput("");
    }
  };

  const handleRemoveMateri = (index: number) => {
    setMateri(materi.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("program-modules")
      .upload(filePath, file);

    if (uploadError) {
      alert("Error uploading image: " + uploadError.message);
      setUploadingImage(false);
      return;
    }

    const { data } = supabase.storage.from("program-modules").getPublicUrl(filePath);
    
    if (data?.publicUrl) {
      setModuleImages([...moduleImages, data.publicUrl]);
    }
    setUploadingImage(false);
    
    // reset input
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setModuleImages(moduleImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: Partial<SubProgram> = {
      id: subProgram?.id, // Will be generated if undefined
      program_id: programId,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      badge: formData.get("badge") as string || null,
      jadwal: formData.get("jadwal") as string,
      
      harga_daftar: formData.get("harga_daftar") as string,
      spp_bulanan: formData.get("spp_bulanan") as string,
      spp_label: formData.get("spp_label") as string || null,
      spp_note: formData.get("spp_note") as string || null,
      harga_modul: formData.get("harga_modul") as string || null,
      harga_ujian: formData.get("harga_ujian") as string || null,
      
      is_discount_active: isDiscountActive,
      discount_percentage: parseInt(formData.get("discount_percentage") as string) || null,
      harga_daftar_discount: formData.get("harga_daftar_discount") as string || null,
      spp_bulanan_discount: formData.get("spp_bulanan_discount") as string || null,
      
      order_index: parseInt(formData.get("order_index") as string) || 0,
      is_active: subProgram?.is_active ?? true,
      
      materi,
      module_images: moduleImages,
    };

    const res = await upsertSubProgram(data);
    setLoading(false);

    if (res.success) {
      alert("Sub Program saved successfully");
      onSuccess();
      onOpenChange(false);
    } else {
      alert("Failed to save: " + res.error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{subProgram ? "Edit Sub-Program" : "Add Sub-Program"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={subProgram?.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="badge">Badge (Optional)</Label>
              <Input id="badge" name="badge" defaultValue={subProgram?.badge || ""} placeholder="e.g. Best Seller" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={subProgram?.description} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jadwal">Jadwal</Label>
              <Input id="jadwal" name="jadwal" defaultValue={subProgram?.jadwal} required placeholder="e.g. Senin & Rabu, 15:00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order_index">Order Index</Label>
              <Input id="order_index" name="order_index" type="number" defaultValue={subProgram?.order_index || 0} required />
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold mb-4">Biaya Normal</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="harga_daftar">Biaya Pendaftaran</Label>
                <Input id="harga_daftar" name="harga_daftar" defaultValue={subProgram?.harga_daftar} required placeholder="Rp 150.000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spp_bulanan">SPP Bulanan</Label>
                <Input id="spp_bulanan" name="spp_bulanan" defaultValue={subProgram?.spp_bulanan} required placeholder="Rp 350.000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spp_label">Label SPP (Optional)</Label>
                <Input id="spp_label" name="spp_label" defaultValue={subProgram?.spp_label || ""} placeholder="e.g. Harga Paket" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spp_note">Catatan SPP (Optional)</Label>
                <Input id="spp_note" name="spp_note" defaultValue={subProgram?.spp_note || ""} placeholder="e.g. Dibayar di awal" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="harga_modul">Harga Modul (Optional)</Label>
                <Input id="harga_modul" name="harga_modul" defaultValue={subProgram?.harga_modul || ""} placeholder="Rp 100.000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="harga_ujian">Harga Ujian (Optional)</Label>
                <Input id="harga_ujian" name="harga_ujian" defaultValue={subProgram?.harga_ujian || ""} placeholder="Rp 50.000" />
              </div>
            </div>
          </div>

          <div className="border-t pt-4 bg-muted/30 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Promo / Diskon</h4>
              <div className="flex items-center gap-2">
                <Label htmlFor="is_discount_active">Aktifkan Promo</Label>
                <Switch 
                  id="is_discount_active" 
                  checked={isDiscountActive} 
                  onCheckedChange={setIsDiscountActive} 
                />
              </div>
            </div>
            
            {isDiscountActive && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount_percentage">Persentase Diskon (%)</Label>
                  <Input id="discount_percentage" name="discount_percentage" type="number" defaultValue={subProgram?.discount_percentage || ""} placeholder="e.g. 20" />
                </div>
                <div className="space-y-2"></div>
                <div className="space-y-2">
                  <Label htmlFor="harga_daftar_discount">Promo Biaya Pendaftaran</Label>
                  <Input id="harga_daftar_discount" name="harga_daftar_discount" defaultValue={subProgram?.harga_daftar_discount || ""} placeholder="Rp 0 (GRATIS)" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spp_bulanan_discount">Promo SPP</Label>
                  <Input id="spp_bulanan_discount" name="spp_bulanan_discount" defaultValue={subProgram?.spp_bulanan_discount || ""} placeholder="Rp 250.000" />
                </div>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold mb-4">Materi Pembelajaran</h4>
            <div className="flex gap-2 mb-2">
              <Input 
                value={materiInput} 
                onChange={(e) => setMateriInput(e.target.value)} 
                placeholder="Tambahkan materi..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddMateri();
                  }
                }}
              />
              <Button type="button" onClick={handleAddMateri} variant="secondary">Tambah</Button>
            </div>
            <ul className="list-disc pl-5 space-y-1">
              {materi.map((m, idx) => (
                <li key={idx} className="flex items-center justify-between group">
                  <span className="text-sm">{m}</span>
                  <button type="button" onClick={() => handleRemoveMateri(idx)} className="text-red-500 text-xs opacity-0 group-hover:opacity-100">
                    Hapus
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold mb-4">Galeri Modul / Buku</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploadingImage} />
                {uploadingImage && <span className="text-sm text-muted-foreground">Uploading...</span>}
              </div>
              
              <div className="flex flex-wrap gap-4">
                {moduleImages.map((img, idx) => (
                  <div key={idx} className="relative w-24 h-24 border rounded overflow-hidden group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`Module ${idx}`} className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 mt-8">
            <Button type="button" variant="outline" className="mr-2" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Sub-Program"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
