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
  const payload = { ...program };

  // If new program (no order_index specified or undefined), auto assign highest order_index + 1
  if (payload.id && payload.order_index === undefined) {
    const { data: existing } = await supabase
      .from("programs")
      .select("id")
      .eq("id", payload.id)
      .maybeSingle();

    if (!existing) {
      const { data: highestOrder } = await supabase
        .from("programs")
        .select("order_index")
        .order("order_index", { ascending: false })
        .limit(1);

      const maxOrder = highestOrder && highestOrder.length > 0 ? (highestOrder[0].order_index ?? -1) : -1;
      payload.order_index = maxOrder + 1;
    }
  }

  const { data, error } = await supabase
    .from("programs")
    .upsert(payload)
    .select()
    .single();

  if (error) {
    console.error("Error upserting program:", error);
    return { success: false, error: error.message };
  }
  revalidatePath("/admin/programs");
  revalidatePath("/programs");
  revalidatePath("/");
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

export async function normalizeSubProgramOrders(programId: string) {
  const supabase = await createClient();
  const { data: subPrograms, error } = await supabase
    .from("sub_programs")
    .select("id, order_index")
    .eq("program_id", programId)
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: true });

  if (error || !subPrograms) {
    console.error("Error fetching sub_programs for normalization:", error);
    return { success: false, error: error?.message };
  }

  // Update sequential order_index (0, 1, 2, ...)
  const updates = subPrograms.map((item, index) => {
    return supabase
      .from("sub_programs")
      .update({ order_index: index })
      .eq("id", item.id);
  });

  await Promise.all(updates);
  return { success: true };
}

export async function moveSubProgram(
  programId: string,
  subProgramId: string,
  direction: "up" | "down"
) {
  const supabase = await createClient();
  
  // Get all sub-programs sorted by order_index
  const { data: subPrograms, error } = await supabase
    .from("sub_programs")
    .select("id, order_index")
    .eq("program_id", programId)
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: true });

  if (error || !subPrograms || subPrograms.length === 0) {
    return { success: false, error: error?.message || "Sub-programs not found" };
  }

  const currentIndex = subPrograms.findIndex((sp) => sp.id === subProgramId);
  if (currentIndex === -1) {
    return { success: false, error: "Sub-program not found" };
  }

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= subPrograms.length) {
    // Already at top or bottom boundary
    return { success: true };
  }

  // Swap positions in list
  const reordered = [...subPrograms];
  const [movedItem] = reordered.splice(currentIndex, 1);
  reordered.splice(targetIndex, 0, movedItem);

  // Update order_index sequentially for all items
  const updatePromises = reordered.map((item, idx) =>
    supabase
      .from("sub_programs")
      .update({ order_index: idx })
      .eq("id", item.id)
  );

  await Promise.all(updatePromises);

  revalidatePath("/admin/programs");
  revalidatePath("/programs");
  revalidatePath("/");
  return { success: true };
}

export async function upsertSubProgram(subProgram: Partial<SubProgram>) {
  const supabase = await createClient();
  
  const payload = { ...subProgram };

  // If new sub-program (no id), auto assign highest order_index + 1
  if (!payload.id && payload.program_id) {
    const { data: existing } = await supabase
      .from("sub_programs")
      .select("order_index")
      .eq("program_id", payload.program_id)
      .order("order_index", { ascending: false })
      .limit(1);

    const maxOrder = existing && existing.length > 0 ? (existing[0].order_index ?? -1) : -1;
    payload.order_index = maxOrder + 1;
  }

  const { data, error } = await supabase
    .from("sub_programs")
    .upsert(payload)
    .select()
    .single();

  if (error) {
    console.error("Error upserting sub_program:", error);
    return { success: false, error: error.message };
  }

  if (payload.program_id) {
    await normalizeSubProgramOrders(payload.program_id);
  }

  revalidatePath("/admin/programs");
  revalidatePath("/programs");
  revalidatePath("/");
  return { success: true, data };
}

export async function deleteSubProgram(id: string) {
  const supabase = await createClient();

  // Find program_id before deletion to normalize remaining items
  const { data: targetItem } = await supabase
    .from("sub_programs")
    .select("program_id")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("sub_programs")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting sub_program:", error);
    return { success: false, error: error.message };
  }

  if (targetItem?.program_id) {
    await normalizeSubProgramOrders(targetItem.program_id);
  }

  revalidatePath("/admin/programs");
  revalidatePath("/programs");
  revalidatePath("/");
  return { success: true };
}
