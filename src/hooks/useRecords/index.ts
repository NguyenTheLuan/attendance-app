import { useState, useEffect, useCallback } from "react";
import { getAllRecords, addRecord, deleteRecordById } from "../../db";
import type { AttendanceRecord } from "../../types";

export function useRecords() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      setLoading(true);
      const data = await getAllRecords();
      setRecords(data);
    } catch {
      setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = useCallback(
    async (data: Omit<AttendanceRecord, "id" | "createdAt">) => {
      await addRecord(data);
      await load();
    },
    [load]
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteRecordById(id);
      await load();
    },
    [load]
  );

  const groupByDate = useCallback(() => {
    return records.reduce<Record<string, AttendanceRecord[]>>((acc, r) => {
      (acc[r.date] ??= []).push(r);
      return acc;
    }, {});
  }, [records]);

  return { records, loading, error, load, add, remove, groupByDate };
}
