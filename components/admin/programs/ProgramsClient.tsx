"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Program, SubProgram } from "@/types/program";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, ChevronUp, ChevronDown, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  toggleProgramActive, 
  deleteProgram, 
  deleteSubProgram, 
  moveSubProgram 
} from "@/app/admin/programs/actions";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatRupiah } from "@/lib/utils";
import { toast } from "@/components/ui/toast";

import ProgramFormDialog from "./ProgramFormDialog";
import SubProgramFormDialog from "./SubProgramFormDialog";

export default function ProgramsClient({ initialPrograms }: { initialPrograms: Program[] }) {
  const router = useRouter();
  const [programs, setPrograms] = useState(initialPrograms);
  const [activeTab, setActiveTab] = useState(programs[0]?.id || "");
  const [programDialogOpen, setProgramDialogOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  
  const [subProgramDialogOpen, setSubProgramDialogOpen] = useState(false);
  const [selectedSubProgram, setSelectedSubProgram] = useState<SubProgram | null>(null);
  const [movingId, setMovingId] = useState<string | null>(null);

  const [programToDelete, setProgramToDelete] = useState<Program | null>(null);
  const [subProgramToDelete, setSubProgramToDelete] = useState<SubProgram | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleActive = async (id: string, table: "programs" | "sub_programs", currentStatus: boolean) => {
    const res = await toggleProgramActive(id, table, !currentStatus);
    if (res.success) {
      toast.add({
        title: "Status Diperbarui",
        description: `Status ${table === "programs" ? "program" : "sub-program"} berhasil diubah.`,
        type: "success",
      });
      router.refresh();
      window.location.reload();
    } else {
      toast.add({
        title: "Gagal Mengubah Status",
        description: res.error || "Terjadi kesalahan.",
        type: "error",
      });
    }
  };

  const handleDeleteProgramConfirm = async () => {
    if (!programToDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteProgram(programToDelete.id);
      if (res.success) {
        toast.add({
          title: "Berhasil",
          description: "Program berhasil dihapus.",
          type: "success",
        });
        router.refresh();
        window.location.reload();
      } else {
        toast.add({
          title: "Gagal Menghapus",
          description: res.error || "Terjadi kesalahan saat menghapus program.",
          type: "error",
        });
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.add({
        title: "Error",
        description: error.message || "Terjadi kesalahan.",
        type: "error",
      });
    } finally {
      setIsDeleting(false);
      setProgramToDelete(null);
    }
  };

  const handleDeleteSubProgramConfirm = async () => {
    if (!subProgramToDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteSubProgram(subProgramToDelete.id);
      if (res.success) {
        toast.add({
          title: "Berhasil",
          description: "Sub-program berhasil dihapus dan urutan dinormalkan.",
          type: "success",
        });
        router.refresh();
        window.location.reload();
      } else {
        toast.add({
          title: "Gagal Menghapus",
          description: res.error || "Terjadi kesalahan saat menghapus sub-program.",
          type: "error",
        });
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.add({
        title: "Error",
        description: error.message || "Terjadi kesalahan.",
        type: "error",
      });
    } finally {
      setIsDeleting(false);
      setSubProgramToDelete(null);
    }
  };

  const handleMoveSubProgram = async (
    programId: string,
    subProgramId: string,
    direction: "up" | "down"
  ) => {
    const currentProgram = programs.find((p) => p.id === programId);
    if (!currentProgram || !currentProgram.sub_programs) return;

    const subList = [...currentProgram.sub_programs];
    const currentIndex = subList.findIndex((s) => s.id === subProgramId);
    if (currentIndex === -1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= subList.length) return;

    // Optimistic UI update
    const reordered = [...subList];
    const [moved] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    const normalizedInMemory = reordered.map((item, idx) => ({
      ...item,
      order_index: idx,
    }));

    const previousPrograms = [...programs];
    setPrograms((prev) =>
      prev.map((p) => (p.id === programId ? { ...p, sub_programs: normalizedInMemory } : p))
    );

    setMovingId(subProgramId);
    const res = await moveSubProgram(programId, subProgramId, direction);
    setMovingId(null);

    if (res.success) {
      toast.add({
        title: "Urutan Diperbarui",
        description: `Posisi sub-program berhasil dipindahkan ke ${direction === "up" ? "atas" : "bawah"}.`,
        type: "success",
      });
      router.refresh();
    } else {
      // Revert optimistic update on failure
      setPrograms(previousPrograms);
      toast.add({
        title: "Gagal Mengubah Urutan",
        description: res.error || "Terjadi kesalahan saat memindahkan posisi.",
        type: "error",
      });
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
        <Button onClick={() => { setSelectedProgram(null); setProgramDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Program
        </Button>
      </div>

      {programs.length === 0 ? (
        <div className="text-center p-12 border border-dashed rounded-lg text-muted-foreground">
          No programs found. Start by adding one.
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            {programs.map((p) => (
              <TabsTrigger key={p.id} value={p.id} className="text-base px-3 h-9">
                {p.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {programs.map((program) => (
            <TabsContent key={program.id} value={program.id}>
              <Card className="mb-6">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="font-semibold">{program.title}</CardTitle>
                    <CardDescription>{program.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Active</span>
                      <Switch 
                        checked={program.is_active} 
                        onCheckedChange={() => handleToggleActive(program.id, "programs", program.is_active)} 
                      />
                    </div>
                    <Button variant="outline" size="sm" onClick={() => { setSelectedProgram(program); setProgramDialogOpen(true); }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => setProgramToDelete(program)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-semibold">Sub Programs</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Gunakan tombol panah ↑ dan ↓ untuk mengatur urutan tampil di website publik.
                  </p>
                </div>
                <Button size="sm" onClick={() => { setSelectedSubProgram(null); setSubProgramDialogOpen(true); }}>
                  <Plus className="mr-2 h-4 w-4" /> Add Sub-Program
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {program.sub_programs?.map((sub: SubProgram, index: number) => (
                  <Card key={sub.id} className="flex flex-col relative group transition-all hover:shadow-md border-slate-200">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-2.5">
                          <span 
                            className="inline-flex items-center justify-center text-xs font-bold w-6 h-6 rounded-md bg-slate-100 text-slate-700 border border-slate-200 shrink-0"
                            title={`Urutan ke-${index + 1}`}
                          >
                            #{index + 1}
                          </span>
                          <CardTitle className="text-lg font-semibold leading-tight">{sub.name}</CardTitle>
                        </div>
                        
                        <div className="flex items-center gap-1.5 shrink-0">
                          {sub.is_discount_active && <Badge variant="destructive" className="text-[11px] px-1.5 py-0">Promo</Badge>}
                          
                          {/* Order Buttons */}
                          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 shadow-xs">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 rounded-sm p-0 text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-25 transition-colors cursor-pointer disabled:cursor-not-allowed"
                              disabled={index === 0 || movingId === sub.id}
                              onClick={() => handleMoveSubProgram(program.id, sub.id, "up")}
                              title="Pindah ke atas"
                            >
                              {movingId === sub.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-500" />
                              ) : (
                                <ChevronUp className="h-3.5 w-3.5" />
                              )}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 rounded-sm p-0 text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-25 transition-colors cursor-pointer disabled:cursor-not-allowed"
                              disabled={index === (program.sub_programs?.length || 1) - 1 || movingId === sub.id}
                              onClick={() => handleMoveSubProgram(program.id, sub.id, "down")}
                              title="Pindah ke bawah"
                            >
                              {movingId === sub.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-500" />
                              ) : (
                                <ChevronDown className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                      <CardDescription className="line-clamp-2 mt-1.5">{sub.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col justify-between pt-0">
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex justify-between">
                          <span>Pendaftaran:</span>
                          <span className={sub.is_discount_active && sub.harga_daftar_discount !== null ? "line-through text-muted-foreground" : ""}>
                            {formatRupiah(sub.harga_daftar)}
                          </span>
                        </div>
                        {sub.is_discount_active && sub.harga_daftar_discount !== null && (
                          <div className="flex justify-between text-red-600 font-bold">
                            <span>Promo Pendaftaran:</span>
                            <span>{sub.harga_daftar_discount === 0 ? "GRATIS (Rp 0)" : formatRupiah(sub.harga_daftar_discount)}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between mt-2">
                          <span>SPP:</span>
                          <span className={sub.is_discount_active && sub.spp_bulanan_discount !== null ? "line-through text-muted-foreground" : ""}>
                            {formatRupiah(sub.spp_bulanan)}
                          </span>
                        </div>
                        {sub.is_discount_active && sub.spp_bulanan_discount !== null && (
                          <div className="flex justify-between text-red-600 font-bold">
                            <span>Promo SPP:</span>
                            <span>{formatRupiah(sub.spp_bulanan_discount)}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Active</span>
                          <Switch 
                            checked={sub.is_active} 
                            onCheckedChange={() => handleToggleActive(sub.id, "sub_programs", sub.is_active)} 
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => { setSelectedSubProgram(sub); setSubProgramDialogOpen(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => setSubProgramToDelete(sub)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {(!program.sub_programs || program.sub_programs.length === 0) && (
                  <div className="col-span-full text-center p-8 border border-dashed rounded-lg text-muted-foreground">
                    No sub-programs found.
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}

      <ProgramFormDialog 
        open={programDialogOpen} 
        onOpenChange={setProgramDialogOpen} 
        program={selectedProgram} 
        onSuccess={() => window.location.reload()} 
      />

      {activeTab && (
        <SubProgramFormDialog 
          open={subProgramDialogOpen} 
          onOpenChange={setSubProgramDialogOpen} 
          programId={activeTab} 
          subProgram={selectedSubProgram} 
          onSuccess={() => window.location.reload()} 
        />
      )}

      {/* Alert Dialog for Program Delete Confirmation */}
      <AlertDialog open={!!programToDelete} onOpenChange={(open) => !open && !isDeleting && setProgramToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Program <span className="font-semibold text-slate-900">{programToDelete?.title}</span> beserta seluruh sub-program di dalamnya akan dihapus secara permanen dari server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <Button variant="destructive" onClick={handleDeleteProgramConfirm} disabled={isDeleting}>
              {isDeleting ? "Menghapus..." : "Hapus Program"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert Dialog for Sub-Program Delete Confirmation */}
      <AlertDialog open={!!subProgramToDelete} onOpenChange={(open) => !open && !isDeleting && setSubProgramToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Sub-program <span className="font-semibold text-slate-900">{subProgramToDelete?.name}</span> akan dihapus secara permanen dari server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <Button variant="destructive" onClick={handleDeleteSubProgramConfirm} disabled={isDeleting}>
              {isDeleting ? "Menghapus..." : "Hapus Sub-Program"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
