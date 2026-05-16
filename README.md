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
- **GitHub Pages** — deploy web
- **Zalo Mini App (ZMA)** — nền tảng Zalo

---

## 🚀 Chạy local

```bash
git clone https://github.com/NguyenTheLuan/attendance-app.git
cd attendance-app
npm install
npm run dev
```

> ⚠️ Cần cấu hình biến môi trường cho Firebase và Cloudinary để chạy đầy đủ tính năng.

---

## 📦 Deploy

### GitHub Pages

```bash
npm run build
npm run deploy
```

### Zalo Mini App (ZMA)

Có 2 cách deploy:

#### Cách 1: VS Code Extension

1. Mở project trong VS Code
2. Mở tab **Zalo Mini App** ở thanh Extension bên trái
3. Đăng nhập → nhấn **Deploy** → chọn môi trường → nhập mô tả → deploy
4. Quét QR để test trên điện thoại

#### Cách 2: Build + Upload (Web Dashboard)

```bash
npm run zip:zma
```

Upload file `scripts/zma-package/attendance-app-zma.zip` lên [mini.zalo.me](https://mini.zalo.me).

---

## 📜 Quy trình commit

```bash
git add .
git commit -m "chore: mô tả thay đổi"
git push origin main
```

Sau đó deploy tuỳ nền tảng:

- **GitHub Pages:** `npm run build && npm run deploy`
- **ZMA:** VS Code Extension hoặc `npm run zip:zma`

---

## 📜 Lịch sử thay đổi

Xem [CHANGELOG.md](./CHANGELOG.md).
