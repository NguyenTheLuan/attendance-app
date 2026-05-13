import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "~/services/firebase";
import type { AttendanceRecord } from "~/types";

const COLLECTION = "records";

export async function addRecord(
  data: Omit<AttendanceRecord, "id" | "createdAt">
) {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function getAllRecords(): Promise<AttendanceRecord[]> {
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as AttendanceRecord[];
}

export async function deleteRecordById(id: string) {
  await deleteDoc(doc(db, COLLECTION, id));
}

export async function updateRecordById(
  id: string,
  data: { name: string; date: string; imageUrl: string }
) {
  await updateDoc(doc(db, COLLECTION, id), data);
}
