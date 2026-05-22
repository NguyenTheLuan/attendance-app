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

---

## 🔧 Cấu hình môi trường

Tạo file `.env` ở thư mục gốc:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### GitHub Secrets

Khi deploy qua GitHub Actions, các biến trên cần được đặt trong **GitHub Secrets** của repository:

| Secret                              | Tương ứng                           |
| ----------------------------------- | ----------------------------------- |
| `VITE_FIREBASE_API_KEY`             | `VITE_FIREBASE_API_KEY`             |
| `VITE_FIREBASE_AUTH_DOMAIN`         | `VITE_FIREBASE_AUTH_DOMAIN`         |
| `VITE_FIREBASE_PROJECT_ID`          | `VITE_FIREBASE_PROJECT_ID`          |
| `VITE_FIREBASE_STORAGE_BUCKET`      | `VITE_FIREBASE_STORAGE_BUCKET`      |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `VITE_FIREBASE_MESSAGING_SENDER_ID` |
| `VITE_FIREBASE_APP_ID`              | `VITE_FIREBASE_APP_ID`              |

---

## 🚀 Chạy local

```bash
git clone https://github.com/NguyenTheLuan/attendance-app.git
cd attendance-app
npm install
cp .env.example .env   # điền Firebase config
npm run dev
```

---

## 📦 Deploy

### GitHub Pages (CI/CD)

**Tự động** khi push vào nhánh `main` — workflow sẽ:

1. Bump version (tạo tag mới)
2. Cập nhật `CHANGELOG.md` với các commit mới
3. Tạo GitHub Release
4. Build và deploy lên GitHub Pages

> Cần set **6 GitHub Secrets** (ở trên) để build có Firebase config.

---

## 📜 Quy trình commit

```bash
git add .
git commit -m "chore: mô tả thay đổi"
git push origin main
```

> Workflow GitHub Actions sẽ tự động build + deploy khi push lên `main`.

---

## 📜 Lịch sử thay đổi

Xem [CHANGELOG.md](./CHANGELOG.md).
