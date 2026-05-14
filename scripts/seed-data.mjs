/**
 * Seed attendance records for May 2026 into Firestore via REST API.
 * Run: node scripts/seed-data.mjs
 *
 * After seeding, update image URLs via the app's edit modal (click avatar).
 */

const API_KEY = "AIzaSyDzQdLWaL9igZ3YYSzCkt0ANWkvUEYWKnM";
const BASE =
  "https://firestore.googleapis.com/v1/projects/attendance-app-d215e/databases/(default)/documents/records";

const records = [
  { date: "2026-05-01", name: "Trần Phạm Long Vũ", note: "Khu Phó" },
  { date: "2026-05-01", name: "Huỳnh Ngọc Cẩn", note: "Phường" },
  { date: "2026-05-02", name: "Nguyễn Thế Luân" },
  { date: "2026-05-03", name: "Nguyễn Thế Luân" },
  { date: "2026-05-04", name: "Võ Minh Phi" },
  { date: "2026-05-05", name: "Võ Minh Phi" },
  { date: "2026-05-06", name: "Đỗ Ngọc Trọng" },
  { date: "2026-05-06", name: "Huỳnh Ngọc Cẩn" },
  { date: "2026-05-07", name: "Đỗ Ngọc Trọng" },
  { date: "2026-05-07", name: "Huỳnh Ngọc Cẩn", note: "vắng" },
  { date: "2026-05-08", name: "Võ Minh Phi" },
  { date: "2026-05-09", name: "Trần Phạm Long Vũ" },
  { date: "2026-05-10", name: "Nguyễn Thế Luân" },
  { date: "2026-05-11", name: "Đỗ Ngọc Trọng" },
  { date: "2026-05-12", name: "Đỗ Ngọc Trọng" },
  { date: "2026-05-12", name: "Huỳnh Ngọc Cẩn", note: "vắng" },
  { date: "2026-05-13", name: "Võ Minh Phi" },
  { date: "2026-05-14", name: "Huỳnh Ngọc Cẩn", note: "vắng" },
  { date: "2026-05-14", name: "Trần Phạm Long Vũ" },
  { date: "2026-05-15", name: "Nguyễn Thế Luân" },
  { date: "2026-05-16", name: "Võ Minh Phi" },
  { date: "2026-05-17", name: "Trần Phạm Long Vũ" },
];

function toFields(data) {
  return Object.fromEntries(
    Object.entries(data).map(([k, v]) => {
      if (typeof v === "number") return [k, { integerValue: String(v) }];
      return [k, { stringValue: String(v) }];
    })
  );
}

async function main() {
  console.log(`Seeding ${records.length} records...\n`);
  const now = Date.now();

  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    const body = {
      fields: toFields({
        name: r.name,
        date: r.date,
        imageUrl: "",
        note: r.note ?? "",
        createdAt: now + i,
      }),
    };

    const res = await fetch(`${BASE}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(
        `  ❌ [${i + 1}/${records.length}] ${r.date} — ${r.name}: ${
          res.status
        } ${text}`
      );
    } else {
      const data = await res.json();
      const docId = data.name.split("/").pop();
      console.log(
        `  ✓ [${i + 1}/${records.length}] ${r.date} — ${r.name}${
          r.note ? ` (${r.note})` : ""
        } → ${docId}`
      );
    }
  }

  console.log("\n✅ Done! All 22 records seeded.");
  console.log("Update image URLs via the app's edit modal (click avatar).");
}

main().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
