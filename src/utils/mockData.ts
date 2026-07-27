import type { AttendanceRecord } from "~/types";

const MOCK_NAMES = [
  "Nguyễn Văn A", "Trần Thị B", "Lê Hoàng C", "Phạm Văn D", 
  "Hoàng Thị E", "Đặng Minh F", "Vũ Xuân G", "Phan Thanh H",
  "Bùi Quang I", "Đỗ Thị K", "Hồ Văn L", "Ngô Thị M",
  "Lý Công N", "Trịnh Xuân O"
];

const MOCK_NOTES = [
  "", "", "", "", 
  "hỗ trợ", "trực thay", "ca sáng", "ca tối", "vắng", "có việc bận"
];

export function generateMockDataArray(): AttendanceRecord[] {
  const startDate = new Date("2025-09-01");
  const endDate = new Date();
  
  const dataList: AttendanceRecord[] = [];
  
  let currentDate = new Date(startDate);
  let idCounter = 1;
  
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split("T")[0];
    
    // Random 0 to 4 records per day
    const recordsCount = Math.floor(Math.random() * 5);
    
    // To avoid duplicates on the same day
    const usedNames = new Set<string>();
    
    for (let i = 0; i < recordsCount; i++) {
      let name;
      do {
        name = MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)];
      } while (usedNames.has(name));
      usedNames.add(name);
      
      const note = MOCK_NOTES[Math.floor(Math.random() * MOCK_NOTES.length)];
      
      dataList.push({
        id: `mock-${idCounter++}`,
        name,
        date: dateStr,
        note,
        imageUrl: note === "vắng" || note === "có việc bận" ? "" : "https://res.cloudinary.com/demo/image/upload/sample.jpg",
        createdAt: currentDate.getTime()
      });
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dataList.sort((a, b) => b.createdAt - a.createdAt);
}
