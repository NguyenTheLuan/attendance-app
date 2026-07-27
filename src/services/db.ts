import { supabase } from "~/services/supabase";
import { generateMockDataArray } from "~/utils/mockData";
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

export async function addMultipleRecords(
  dataList: Omit<AttendanceRecord, "id" | "createdAt">[]
) {
  const insertData = dataList.map((d) => ({
    ...d,
    createdAt: Date.now(),
  }));

  const { error } = await supabase.from(TABLE).insert(insertData);
  if (error) throw error;
}

export async function getAllRecords(): Promise<AttendanceRecord[]> {
  const isTestMode = localStorage.getItem("attendance_test_mode") === "true";
  if (isTestMode) {
    // Generate mock data on the fly (it's deterministic-ish or generated once per reload)
    // Wait, generating every time will change it constantly. 
    // We should cache it in memory.
    if (!(window as any).__MOCK_DATA__) {
      (window as any).__MOCK_DATA__ = generateMockDataArray();
    }
    return (window as any).__MOCK_DATA__;
  }

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

export interface Member {
  id: string;
  name: string;
}

export async function getMembers(): Promise<Member[]> {
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("name", { ascending: true });
    
  if (error) {
    console.error("Error fetching members:", error);
    return []; // Return empty if error or RLS fails (so the app doesn't crash)
  }
  return data as Member[];
}

export async function addMember(name: string): Promise<Member | null> {
  const { data, error } = await supabase
    .from("members")
    .insert([{ name }])
    .select()
    .single();
    
  if (error) {
    console.error("Error adding member:", error);
    throw error;
  }
  return data as Member;
}
