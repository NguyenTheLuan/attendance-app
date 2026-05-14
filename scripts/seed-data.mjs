/**
 * Seed attendance records for May 2026 into Firestore.
 * Run: node scripts/seed-data.mjs
 *
 * After seeding, you can update image URLs manually via the app's edit modal.
 */
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDzQdLWaL9igZ3YYSzCkt0ANWkvUEYWKnM",
  authDomain: "attendance-app-d215e.firebaseapp.com",
  projectId: "attendance-app-d215e",
  storageBucket: "attendance-app-d215e.firebasestorage.app",
  messagingSenderId: "31107838129",
  appId: "1:31107838129:web:905a38215ab9bc9fe53290",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const COLLECTION = "records";

// Format: { date: "YYYY-MM-DD", name: "...", note?: "..." }
const records = [
  // 01/05 — Thứ 6
  { date: "2026-05-01", name: "Trần Phạm Long Vũ", note: "Khu Phó" },
  { date: "2026-05-01", name: "Huỳnh Ngọc Cẩn", note: "Phường" },
  // 02/05 — Thứ 7
  { date: "2026-05-02", name: "Nguyễn Thế Luân" },
  // 03/05 — CN
  { date: "2026-05-03", name: "Nguyễn Thế Luân" },
  // 04/05 — Thứ 2
  { date: "2026-05-04", name: "Võ Minh Phi" },
  // 05/05 — Thứ 3
  { date: "2026-05-05", name: "Võ Minh Phi" },
  // 06/05 — Thứ 4
  { date: "2026-05-06", name: "Đỗ Ngọc Trọng" },
  { date: "2026-05-06", name: "Huỳnh Ngọc Cẩn" },
  // 07/05 — Thứ 5
  { date: "2026-05-07", name: "Đỗ Ngọc Trọng" },
  { date: "2026-05-07", name: "Huỳnh Ngọc Cẩn", note: "vắng" },
  // 08/05 — Thứ 6
  { date: "2026-05-08", name: "Võ Minh Phi" },
  // 09/05 — Thứ 7
  { date: "2026-05-09", name: "Trần Phạm Long Vũ" },
  // 10/05 — CN
  { date: "2026-05-10", name: "Nguyễn Thế Luân" },
  // 11/05 — Thứ 2
  { date: "2026-05-11", name: "Đỗ Ngọc Trọng" },
  // 12/05 — Thứ 3
  { date: "2026-05-12", name: "Đỗ Ngọc Trọng" },
  { date: "2026-05-12", name: "Huỳnh Ngọc Cẩn", note: "vắng" },
  // 13/05 — Thứ 4
  { date: "2026-05-13", name: "Võ Minh Phi" },
  // 14/05 — Thứ 5
  { date: "2026-05-14", name: "Huỳnh Ngọc Cẩn", note: "vắng" },
  { date: "2026-05-14", name: "Trần Phạm Long Vũ" },
  // 15/05 — Thứ 6
  { date: "2026-05-15", name: "Nguyễn Thế Luân" },
  // 16/05 — Thứ 7
  { date: "2026-05-16", name: "Võ Minh Phi" },
  // 17/05 — CN
  { date: "2026-05-17", name: "Trần Phạm Long Vũ" },
];

async function seed() {
  console.log(`Seeding ${records.length} records...\n`);

  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    const docData = {
      name: r.name,
      date: r.date,
      imageUrl: "",
      note: r.note ?? "",
      createdAt: Date.now() + i, // preserve insertion order
    };
    const id = await addDoc(collection(db, COLLECTION), docData);
    console.log(
      `  [${i + 1}/${records.length}] ✓ ${r.date} — ${r.name}${
        r.note ? ` (${r.note})` : ""
      } → ${id.id}`
    );
  }

  console.log("\n✅ Done! All records seeded. Update image URLs via the app.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
