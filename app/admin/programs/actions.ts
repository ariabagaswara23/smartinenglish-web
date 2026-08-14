"use server";

import { createClient } from "@/utils/supabase/server";
import { Program, SubProgram } from "@/types/program";
import { revalidatePath } from "next/cache";

export async function getAdminPrograms() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("programs")
    .select("*, sub_programs(*)")
    .order("order_index", { ascending: true })
    .order("order_index", { referencedTable: "sub_programs", ascending: true });

  if (error) {
    console.error("Error fetching programs:", error);
    return [];
  }
  return data;
}

export async function getPublicPrograms() {
  const supabase = await createClient();
  
  // Ambil program yang aktif beserta sub_program yang aktif
  const { data, error } = await supabase
    .from("programs")
    .select("*, sub_programs(*)")
    .eq("is_active", true)
    .eq("sub_programs.is_active", true)
    .order("order_index", { ascending: true })
    .order("order_index", { referencedTable: "sub_programs", ascending: true });

  if (error) {
    console.error("Error fetching public programs:", error);
    return [];
  }
  
  // Karena eq("sub_programs.is_active", true) bisa saja mengembalikan program yang sub_programs-nya kosong jika tidak ada yang aktif (atau memfilter programnya)
  // Cara paling aman adalah fetch semua relasi lalu difilter di server:
  
  /* Alternatif filtering aman:
  const filteredData = data.map(prog => ({
    ...prog,
    sub_programs: prog.sub_programs.filter((sp: any) => sp.is_active)
  }));
  return filteredData;
  */
  
  return data;
}

export async function toggleProgramActive(id: string, table: "programs" | "sub_programs", isActive: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from(table)
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) {
    console.error(`Error updating ${table}:`, error);
    return { success: false, error: error.message };
  }
  revalidatePath("/admin/programs");
  revalidatePath("/programs");
  return { success: true };
}

export async function upsertProgram(program: Partial<Program>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("programs")
    .upsert(program)
    .select()
    .single();

  if (error) {
    console.error("Error upserting program:", error);
    return { success: false, error: error.message };
  }
  revalidatePath("/admin/programs");
  revalidatePath("/programs");
  return { success: true, data };
}

export async function deleteProgram(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("programs")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting program:", error);
    return { success: false, error: error.message };
  }
  revalidatePath("/admin/programs");
  revalidatePath("/programs");
  return { success: true };
}

export async function upsertSubProgram(subProgram: Partial<SubProgram>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sub_programs")
    .upsert(subProgram)
    .select()
    .single();

  if (error) {
    console.error("Error upserting sub_program:", error);
    return { success: false, error: error.message };
  }
  revalidatePath("/admin/programs");
  revalidatePath("/programs");
  return { success: true, data };
}

export async function deleteSubProgram(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("sub_programs")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting sub_program:", error);
    return { success: false, error: error.message };
  }
  revalidatePath("/admin/programs");
  revalidatePath("/programs");
  return { success: true };
}
