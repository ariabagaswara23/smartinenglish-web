"use client";

import { useState } from "react";
import { Program, SubProgram } from "@/types/program";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toggleProgramActive, deleteProgram, deleteSubProgram } from "@/app/admin/programs/actions";

import ProgramFormDialog from "./ProgramFormDialog";
import SubProgramFormDialog from "./SubProgramFormDialog";

export default function ProgramsClient({ initialPrograms }: { initialPrograms: Program[] }) {
  const [programs, setPrograms] = useState(initialPrograms);
  const [activeTab, setActiveTab] = useState(programs[0]?.id || "");
  const [programDialogOpen, setProgramDialogOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  
  const [subProgramDialogOpen, setSubProgramDialogOpen] = useState(false);
  const [selectedSubProgram, setSelectedSubProgram] = useState<SubProgram | null>(null);

  const handleToggleActive = async (id: string, table: "programs" | "sub_programs", currentStatus: boolean) => {
    const res = await toggleProgramActive(id, table, !currentStatus);
    if (res.success) {
      alert("Status updated successfully");
      window.location.reload(); // Simple refresh for now
    } else {
      alert("Failed to update status: " + res.error);
    }
  };

  const handleDeleteProgram = async (id: string) => {
    if (!confirm("Are you sure you want to delete this program?")) return;
    const res = await deleteProgram(id);
    if (res.success) {
      alert("Program deleted");
      window.location.reload();
    } else {
      alert("Error deleting program: " + res.error);
    }
  };

  const handleDeleteSubProgram = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sub-program?")) return;
    const res = await deleteSubProgram(id);
    if (res.success) {
      alert("Sub-program deleted");
      window.location.reload();
    } else {
      alert("Error deleting sub-program: " + res.error);
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
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteProgram(program.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Sub Programs</h3>
                <Button size="sm" onClick={() => { setSelectedSubProgram(null); setSubProgramDialogOpen(true); }}>
                  <Plus className="mr-2 h-4 w-4" /> Add Sub-Program
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {program.sub_programs?.map((sub: SubProgram) => (
                  <Card key={sub.id} className="flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-semibold">{sub.name}</CardTitle>
                        {sub.is_discount_active && <Badge variant="destructive">Promo</Badge>}
                      </div>
                      <CardDescription>{sub.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex justify-between">
                          <span>Pendaftaran:</span>
                          <span className={sub.is_discount_active ? "line-through text-muted-foreground" : ""}>
                            {sub.harga_daftar}
                          </span>
                        </div>
                        {sub.is_discount_active && (
                          <div className="flex justify-between text-red-600 font-bold">
                            <span>Promo Pendaftaran:</span>
                            <span>{sub.harga_daftar_discount}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between mt-2">
                          <span>SPP:</span>
                          <span className={sub.is_discount_active ? "line-through text-muted-foreground" : ""}>
                            {sub.spp_bulanan}
                          </span>
                        </div>
                        {sub.is_discount_active && (
                          <div className="flex justify-between text-red-600 font-bold">
                            <span>Promo SPP:</span>
                            <span>{sub.spp_bulanan_discount}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t">
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
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteSubProgram(sub.id)}>
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
    </div>
  );
}
