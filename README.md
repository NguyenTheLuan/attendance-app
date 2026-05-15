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

## 📦 Deploy

### GitHub Pages

```bash
# Build web (output: dist/)
npm run build

# Deploy lên GitHub Pages
npm run deploy
```

> ⚠️ Yêu cầu: GitHub repo đã cấu hình Pages ở branch `gh-pages`.

### Zalo Mini App (ZMA)

Deploy app lên Zalo Mini App — ứng dụng nhúng trong Zalo.

#### Yêu cầu

- Extension VS Code: **Zalo Mini App** (ID: `zalo-mini-app.zalo-mini-app`)
- Tài khoản Zalo Mini App tại https://mini.zalo.me

#### Deploy bằng VS Code Extension

1. Mở project trong VS Code
2. Mở tab **Zalo Mini App** ở thanh Extension bên trái
3. Đăng nhập tài khoản Zalo Mini App
4. Nhấn nút **Deploy**
5. Chọn môi trường:
   - **Development** — deploy test nhanh, quét QR xem ngay
   - **Testing** — deploy bản dùng để gửi xét duyệt
6. Nhập mô tả phiên bản (ví dụ: `Phiên bản đầu tiên v1.0`)
7. Chờ deploy hoàn tất
8. Quét QR code để test trên điện thoại

#### Deploy thủ công (build + upload)

```bash
# Build + zip (output: www/ → attendance-app-zma.zip)
npm run zip:zma
```

Upload file `attendance-app-zma.zip` lên https://mini.zalo.me → **Quản lý phiên bản** → **Tải lên**.

#### Kiểm tra & debug ZMA

Nếu app bị **trang trắng (blank page)**:

1. Mở Mini App trên điện thoại
2. **Lắc mạnh điện thoại** → chọn **Debug / Console**
3. Xem log lỗi JS hiện ra
4. Các nguyên nhân thường gặp:
   - Thiếu chunk JS (đã fix: gộp 1 file duy nhất)
   - Không tìm thấy root element (đã fix: dùng `#app`)
   - Lỗi Firebase / SDK

---

## 📜 Quy trình commit

```bash
# 1. Kiểm tra trạng thái
git status

# 2. Thêm file
git add .

# 3. Commit
git commit -m "chore: mô tả thay đổi"

# 4. Push lên GitHub
git push origin main
```

Sau đó chạy deploy tuỳ nền tảng:

- **GitHub Pages:** `npm run build && npm run deploy`
- **Zalo Mini App:** Deploy bằng VS Code Extension

---

## 📜 Lịch sử thay đổi

Xem [CHANGELOG.md](./CHANGELOG.md) để biết chi tiết các phiên bản.
