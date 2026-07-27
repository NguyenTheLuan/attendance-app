# 🏗️ Kiến trúc Tổng thể Hệ thống (Architecture Overview)

Tài liệu này mô tả cấu trúc, công nghệ và luồng dữ liệu (Data Flow) của **Attendance App** (Ứng dụng Quản lý Điểm danh). Hệ thống được thiết kế theo hướng **Feature-Sliced Design (FSD)** thu gọn, kết hợp với các dịch vụ Backend-as-a-Service (BaaS) để tối ưu chi phí và tốc độ phát triển.

---

## 1. 🛠️ Tech Stack (Ngăn xếp Công nghệ)

### Frontend (Giao diện người dùng)
- **Framework:** React 19
- **Ngôn ngữ:** TypeScript (Strict Mode)
- **Build Tool:** Vite (Tối ưu tốc độ HMR và Build production)
- **Styling:** Vanilla CSS kết hợp CSS Variables (Hỗ trợ 5 Theme động không cần reload)
- **Biểu đồ (Charts):** Recharts (Lazy loading)

### Backend & Storage (Dữ liệu & Lưu trữ)
- **Database:** Supabase (PostgreSQL) — Lưu trữ thông tin điểm danh (`records`).
- **Image Storage:** Cloudinary — Lưu trữ và tối ưu hóa ảnh chụp từ Camera, trả về CDN URL (giảm tải cho Supabase).

### CI/CD & DevOps
- **Auto-Review:** CodeRabbit AI (GitHub App) tự động review code.
- **Deployment:** GitHub Actions tự động build và deploy lên GitHub Pages mỗi khi push code lên nhánh `main`.

---

## 2. 📂 Cấu trúc Thư mục (Project Structure)

Dự án tuân theo kiến trúc chia nhỏ chức năng (Component-driven):

```text
src/
├── components/         # Các UI component có thể tái sử dụng (Button, Card, Chart...)
│   └── stats/          # Components đặc thù cho trang Thống kê (Lazy loaded)
├── pages/              # Các trang chính (Admin, View, Stats, Settings...)
├── hooks/              # Custom React Hooks chứa business logic (useRecords, useTheme)
├── services/           # Lớp giao tiếp với bên ngoài (Supabase API, Cloudinary API)
├── utils/              # Các hàm hỗ trợ thuần túy (Pure functions: exportCSV, Date utils)
├── types/              # Định nghĩa các interface TypeScript cho toàn dự án
└── locales/            # File dịch ngôn ngữ (i18n - vi.ts)
```

---

## 3. 🔄 Luồng Dữ liệu (Data Flow)

### 3.1. Luồng Điểm danh (Check-in Flow)
1. **User (Admin):** Mở `/admin`, nhập tên và bấm nút chụp ảnh từ Camera tích hợp.
2. **Frontend:** Bắt ảnh từ luồng video, chuyển thành định dạng Base64.
3. **Cloudinary Service:** Upload Base64 lên Cloudinary thông qua API. Cloudinary trả về một `secure_url`.
4. **Supabase Service:** Gửi `secure_url`, `name`, `date` và `note` lưu vào bảng `records` trong PostgreSQL của Supabase.
5. **UI Update:** App tự động làm mới danh sách (State) mà không cần reload trang.

### 3.2. Luồng Thống kê (Stats Flow)
1. **User:** Truy cập `/stats`.
2. **Frontend:** Kích hoạt `React.lazy` để tải các file chunk của biểu đồ (Recharts) một cách bất đồng bộ.
3. **useRecords Hook:** Fetch toàn bộ dữ liệu từ Supabase (hoặc dùng Mock Data nếu bật chế độ Test).
4. **Data Aggregation:** Các utils (như `getMonthlyDailyData`) sẽ nhóm dữ liệu theo ngày/tuần/tháng.
5. **Biểu đồ:** Render các biểu đồ Line Chart và Bar Chart.

---

## 4. 🎨 Design System (Hệ thống Thiết kế)

Dự án không sử dụng thư viện CSS có sẵn (như Tailwind hay Bootstrap) để giữ cho file bundle siêu nhẹ.
Thay vào đó, toàn bộ quy tắc màu sắc được quản lý bằng **CSS Variables** trong `src/index.css`.

Hệ thống hỗ trợ 5 chế độ hiển thị (Themes) hoạt động dựa trên thuộc tính `data-theme` gắn ở thẻ `<html>`:
- `light-classic`: Sáng cơ bản
- `light-warm`: Sáng ấm (Bảo vệ mắt)
- `dark-premium`: Tối cao cấp (Màu Navy/Gold - Quân đội)
- `dark-oled`: Đen tuyền (Tiết kiệm pin cho màn OLED)
- `glass`: Hiệu ứng kính mờ (Glassmorphism phong cách iOS)

*(Xem chi tiết quy định màu sắc và class ở file `.agents/rules/design-system.md`)*

---

## 5. 🔐 Authentication (Xác thực)

Hệ thống xác thực được thiết kế tối giản dành riêng cho nhóm Admin nội bộ:
- Không dùng JWT hay OAuth để tránh rườm rà.
- Trạng thái đăng nhập được lưu tạm dưới dạng cờ (flag) trong `localStorage`.
- Phân quyền:
  - **Admin:** Có quyền xem `/admin`, `/stats`, Xóa/Sửa/Thêm record, Xuất CSV.
  - **Public (Khách):** Chỉ xem được lịch trực `/view` (và bị ẩn các note vắng mặt nhạy cảm).

---

## 6. 🛣️ Định hướng tương lai (Roadmap)
- [ ] Chuyển đổi trạng thái Auth từ LocalStorage sang Supabase Auth để bảo mật tuyệt đối.
- [ ] Tích hợp Push Notifications (Service Worker) để nhắc nhở người trực.
- [ ] Tính năng cấp quyền đa cấp (Super Admin, Manager, User).
