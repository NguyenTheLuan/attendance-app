import { supabase } from "~/services/supabase";
import type { AttendanceRecord } from "~/types";

const TABLE = "records";

export async function addRecord(
  data: Omit<AttendanceRecord, "id" | "createdAt">
) {
  const { data: inserted, error } = await supabase
    .from(TABLE)
    .insert([
      {
        ...data,
        createdAt: Date.now(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return inserted.id;
}

export async function getAllRecords(): Promise<AttendanceRecord[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) throw error;
  return data as AttendanceRecord[];
}

export async function deleteRecordById(id: string) {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
}

export async function updateRecordById(
  id: string,
  data: { name: string; date: string; imageUrl?: string; note?: string }
) {
  const { error } = await supabase.from(TABLE).update(data).eq("id", id);
  if (error) throw error;
}
