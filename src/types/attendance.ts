export interface AttendanceRecord {
  id: string;
  name: string;
  imageUrl?: string;
  date: string; // YYYY-MM-DD
  note?: string;
  createdAt: number;
}
