# 📋 Attendance App — Điểm Danh Trực Nhật

Ứng dụng quản lý điểm danh trực nhật cho lớp học, với đầy đủ tính năng **nhập điểm danh**, **chụp ảnh camera**, **xem lịch trực**, và **thống kê trực quan**. Hỗ trợ đa giao diện (Military, Dark OLED, Glassmorphism...).

🌐 **Demo**: [https://nguyentheluan.github.io/attendance-app](https://nguyentheluan.github.io/attendance-app)

---

## ✨ Tính năng

| Trang                            | Mô tả                                                                                     |
| -------------------------------- | ----------------------------------------------------------------------------------------- |
| 👁️ **Xem lịch trực** (`/view`)   | Xem danh sách trực nhật theo ngày, có ảnh và tên, giao diện avatar xếp chồng hiện đại.    |
| ✏️ **Nhập điểm danh** (`/admin`) | Thêm người trực mới, tích hợp **chụp ảnh trực tiếp từ Camera thiết bị** (cần đăng nhập).  |
| 📊 **Thống kê** (`/stats`)       | Biểu đồ xu hướng, bar chart phân bố người, so sánh theo tháng/tuần, xem chi tiết vắng mặt.|
| ⚙️ **Cài đặt** (`/settings`)     | Chọn 5 chế độ giao diện màu (Themes), đổi ngôn ngữ và bật/tắt **Dữ liệu mẫu (Demo)**.     |

### 🔐 Đăng nhập

- Tài khoản: `ntluan`
- Mật khẩu: `123`

---

## 🛠️ Công nghệ

- **React 19** + **TypeScript**
- **Vite** — Build tool
- **Recharts** — Biểu đồ thống kê
- **Cloudinary** — Lưu trữ ảnh
- **Supabase (PostgreSQL)** — Database backend
- **GitHub Pages & Actions** — Deploy web tự động
- **CodeRabbit AI** — Trợ lý AI tự động review code trên các Pull Request

---

## 🔧 Cấu hình môi trường

Tạo file `.env.local` ở thư mục gốc:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

*(Chi tiết xem hướng dẫn cấu hình database tại [docs/guides/supabase-setup.md](./docs/guides/supabase-setup.md))*

### GitHub Secrets (Dành cho CI/CD)

Khi deploy qua GitHub Actions, các biến trên cần được đặt trong **Settings > Secrets and variables > Actions** của repository:

| Secret                              | Tương ứng                           |
| ----------------------------------- | ----------------------------------- |
| `VITE_SUPABASE_URL`                 | `VITE_SUPABASE_URL`                 |
| `VITE_SUPABASE_ANON_KEY`            | `VITE_SUPABASE_ANON_KEY`            |

---

## 🚀 Chạy local

```bash
git clone https://github.com/NguyenTheLuan/attendance-app.git
cd attendance-app
npm install
# Tạo file .env.local và điền config Supabase
npm run dev
```

---

## 📦 Quy trình CI/CD & AI Review

### 1. CodeRabbit AI Reviewer
- Dự án đã cài đặt **CodeRabbit App**. 
- Bất cứ khi nào có một Pull Request mới, CodeRabbit sẽ tự động quét code, tóm tắt PR, tìm bug và comment góp ý cách sửa lỗi.

### 2. Tự động Deploy (GitHub Pages)
**Tự động** khi push vào nhánh `main` — workflow sẽ:
1. Bump version (tạo tag mới)
2. Cập nhật `CHANGELOG.md` với các commit mới
3. Tạo GitHub Release
4. Build và deploy web lên GitHub Pages

> ⚠️ Cần set **2 GitHub Secrets** của Supabase (ở trên) để bản build có thể kết nối database.

---

## 📜 Quy trình commit

Tuân thủ định dạng chuẩn (Conventional Commits) có chứa Emoji:
```bash
git add .
git commit -m "✨ feat(auth): thêm đăng nhập"
git push origin main
```

---

## 📜 Lịch sử thay đổi

Xem [CHANGELOG.md](./CHANGELOG.md).
