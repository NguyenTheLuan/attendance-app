# 📋 Attendance App — Điểm Danh Trực Nhật

Ứng dụng quản lý điểm danh trực nhật cho lớp học, với đầy đủ tính năng **nhập điểm danh**, **xem lịch trực**, và **thống kê trực quan**.

🌐 **Demo**: [https://nguyentheluan.github.io/attendance-app](https://nguyentheluan.github.io/attendance-app)

---

## ✨ Tính năng

| Trang                            | Mô tả                                                                                     |
| -------------------------------- | ----------------------------------------------------------------------------------------- |
| 👁️ **Xem lịch trực** (`/view`)   | Xem danh sách trực nhật theo ngày, có ảnh và tên                                          |
| ✏️ **Nhập điểm danh** (`/admin`) | Thêm người trực mới (cần đăng nhập)                                                       |
| 📊 **Thống kê** (`/stats`)       | Biểu đồ xu hướng, bar chart phân bố người, so sánh theo tháng/tuần, xem chi tiết vắng mặt |

### 🔐 Đăng nhập

- Tài khoản: `ntluan`
- Mật khẩu: `123`

---

## 🛠️ Công nghệ

- **React 19** + **TypeScript**
- **Vite** — build tool
- **Recharts** — biểu đồ thống kê
- **Cloudinary** — lưu trữ ảnh
- **Firebase** — database backend
- **GitHub Pages** — deploy

---

## 🚀 Chạy local

```bash
# Clone repo
git clone https://github.com/NguyenTheLuan/attendance-app.git
cd attendance-app

# Cài dependencies
npm install

# Chạy dev server
npm run dev
```

> ⚠️ Cần cấu hình biến môi trường cho Firebase và Cloudinary để chạy đầy đủ tính năng.

---

## 📦 Deploy lên GitHub Pages

```bash
npm run deploy
```

Script deploy sẽ build và push lên branch `gh-pages`.

---

## 📜 Lịch sử thay đổi

Xem file [CHANGELOG.md](./CHANGELOG.md) để biết chi tiết các phiên bản.

> 💡 **Mẹo**: Để GitHub hiển thị CHANGELOG đẹp trên giao diện, bạn vào repo trên GitHub → **Settings** → **General** → kéo xuống mục **Features** → bật **Releases**. Sau đó tạo **Release** với tag version, GitHub sẽ tự động show changelog ở tab **Releases**.
