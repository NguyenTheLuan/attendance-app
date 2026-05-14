/**
 * Seed April 2026 attendance records into Firestore.
 * Run: node scripts/seed-april.mjs
 */

const API_KEY = "AIzaSyDzQdLWaL9igZ3YYSzCkt0ANWkvUEYWKnM";
const BASE =
  "https://firestore.googleapis.com/v1/projects/attendance-app-d215e/databases/(default)/documents/records";

const records = [
  // 01/04 -> empty
  // 02/04 -> empty
  // 03/04 -> empty
  { date: "2026-04-04", name: "Đỗ Ngọc Trọng" },
  { date: "2026-04-05", name: "Nguyễn Thế Luân" },
  { date: "2026-04-06", name: "Trần Phạm Long Vũ" },
  { date: "2026-04-07", name: "Võ Minh Phi" },
  { date: "2026-04-08", name: "Phan Đỗ Gia Huy" },
  { date: "2026-04-08", name: "Đỗ Ngọc Trọng" },
  { date: "2026-04-09", name: "Đỗ Ngọc Trọng" },
  { date: "2026-04-09", name: "Huỳnh Ngọc Cẩn" },
  { date: "2026-04-10", name: "Trần Phạm Long Vũ" },
  { date: "2026-04-10", name: "Nguyễn Thế Luân" },
  { date: "2026-04-11", name: "Võ Minh Phi" },
  { date: "2026-04-12", name: "Trần Phạm Long Vũ" },
  { date: "2026-04-12", name: "Nguyễn Thế Luân" },
  { date: "2026-04-13", name: "Đỗ Ngọc Trọng" },
  { date: "2026-04-13", name: "Phan Đỗ Gia Huy" },
  { date: "2026-04-14", name: "Huỳnh Ngọc Cẩn" },
  { date: "2026-04-15", name: "Phan Đỗ Gia Huy" },
  { date: "2026-04-15", name: "Võ Minh Phi" },
  // 16/04 -> empty
  { date: "2026-04-17", name: "Đỗ Ngọc Trọng" },
  { date: "2026-04-18", name: "Nguyễn Thế Luân" },
  {
    date: "2026-04-19",
    name: "Trần Phạm Long Vũ",
    note: "hỗ trợ nhảy cầu Tăng Long",
  },
  {
    date: "2026-04-20",
    name: "Huỳnh Ngọc Cẩn",
    note: "đi tuần (Nguyễn Thế Luân)",
  },
  {
    date: "2026-04-20",
    name: "Phan Đỗ Gia Huy",
    note: "đi tuần (Nguyễn Thế Luân)",
  },
  { date: "2026-04-21", name: "Đỗ Ngọc Trọng" },
  { date: "2026-04-21", name: "Võ Minh Phi" },
  { date: "2026-04-22", name: "Đỗ Ngọc Trọng" },
  { date: "2026-04-22", name: "Phan Đỗ Gia Huy" },
  // 23/04 -> empty
  { date: "2026-04-24", name: "Võ Minh Phi" },
  { date: "2026-04-24", name: "Huỳnh Ngọc Cẩn" },
  { date: "2026-04-25", name: "Trần Phạm Long Vũ" },
  { date: "2026-04-26", name: "Nguyễn Thế Luân" },
  { date: "2026-04-27", name: "Trần Phạm Long Vũ" },
  { date: "2026-04-27", name: "Đỗ Ngọc Trọng" },
  { date: "2026-04-28", name: "Trần Phạm Long Vũ" },
  {
    date: "2026-04-29",
    name: "Đỗ Ngọc Trọng",
    note: "trực chiến ~ 19h-23h30",
  },
  {
    date: "2026-04-29",
    name: "Huỳnh Ngọc Cẩn",
    note: "trực chiến ~ 19h-23h30",
  },
  {
    date: "2026-04-30",
    name: "Nguyễn Thế Luân",
    note: "Khu Phó - trực chiến ~ 19h-1h",
  },
  {
    date: "2026-04-30",
    name: "Võ Minh Phi",
    note: "Khu Phó - trực chiến ~ 19h-1h",
  },
  {
    date: "2026-04-30",
    name: "Trần Phạm Long Vũ",
    note: "Phường 6h30-21h - trực chiến ~ 19h-1h",
  },
  {
    date: "2026-04-30",
    name: "Đỗ Ngọc Trọng",
    note: "Phường 6h30-21h - trực chiến ~ 19h-1h",
  },
];

const now = Date.now();

async function main() {
  console.log(`Seeding ${records.length} April records...\n`);

  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    const body = {
      fields: {
        name: { stringValue: r.name },
        date: { stringValue: r.date },
        imageUrl: { stringValue: "" },
        note: { stringValue: r.note ?? "" },
        createdAt: { integerValue: String(now + i) },
      },
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

  console.log("\n✅ Done! All April records seeded.");
}

main().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
