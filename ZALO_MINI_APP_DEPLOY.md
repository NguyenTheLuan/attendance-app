# 🚀 Hướng dẫn Deploy Attendance App lên Zalo Mini App

## Yêu cầu

- Tài khoản Zalo Developer: https://mini.zalo.me/
- Ứng dụng đã build: `npm run zip:zma` → file `attendance-app-zma.zip`

---

## Bước 1: Truy cập Zalo Mini App Dashboard

Mở trình duyệt, vào **https://mini.zalo.me/** và đăng nhập bằng tài khoản Zalo của bạn.

Xem **MP ID** của Mini App (cần để cập nhật vào `zma-config.json`).

---

## Bước 2: Tạo Mini App mới

1. Click nút **"Tạo Mini App"** (góc phải trên cùng)
2. Điền thông tin:
   - **Tên Mini App**: `Điểm Danh Khu Phố`
   - **Mô tả**: `Lịch trực của khu phố`
   - **Upload icon**: Chọn ảnh vuông 512x512px
3. Nhấn **"Tạo"**

> Sau khi tạo, lấy **MP ID** và cập nhật vào file `zma-config.json` ở mục `mpId`.

---

## Bước 3: Cập nhật cấu hình ZMA

Cấu hình Zalo Mini App được quản lý qua file **`zma-config.json`** ở thư mục gốc:

```json
{
  "mpId": "399913455877657263",
  "name": "Điểm Danh Khu Phố",
  "description": "Lịch trực của khu phố",
  "version": "1.0.0",
  "icon": "",
  "entryPage": "pages/index/index",
  "pages": ["pages/index/index", "pages/profile/index", "pages/history/index"],
  "window": {
    "titleBarColor": "#ffffff",
    "navigationBarTitleText": "Điểm Danh Khu Phố",
    "navigationBarTextStyle": "black"
  },
  "permissions": [
    "scope.userInfo",
    "scope.userLocation",
    "scope.camera",
    "scope.uploadFile"
  ]
}
```

| Trường        | Mô tả                                                    |
| ------------- | -------------------------------------------------------- |
| `mpId`        | ID của Mini App trên Zalo Mini App Dashboard             |
| `name`        | Tên hiển thị của Mini App                                |
| `description` | Mô tả ngắn                                               |
| `version`     | Version (sẽ được ghi đè bằng version từ `package.json`)  |
| `icon`        | URL icon (có thể để trống, upload sau trên dashboard)    |
| `entryPage`   | Trang chính khi mở app                                   |
| `pages`       | Danh sách các page (phải khớp với thư mục trong `www/`)  |
| `window`      | Cấu hình giao diện window (titleBar, navigationBar, ...) |
| `permissions` | Quyền của app (userInfo, location, camera, uploadFile)   |

> **Lưu ý**: Khi build, script sẽ tự động lấy `version` từ `package.json` và ghi đè vào `app-config.json` trong thư mục `www/`.

---

## Bước 4: Build và tạo ZIP

```bash
# Build + zip
npm run zip:zma
```

Kết quả:

- Build output: thư mục `www/`
- File ZIP: `attendance-app-zma.zip` (khoảng ~0.4 MB)

### Script build tự động làm các việc sau:

1. **Build Vite** với mode `zma` → output vào `www/`
2. **Xóa file không cần thiết** (ví dụ: `404.html`)
3. **Ghi đè `www/app-config.json`** bằng nội dung từ `zma-config.json` (định dạng ZMA v2 chuẩn)
4. **Nén** thư mục `www/` thành `attendance-app-zma.zip`

---

## Bước 5: Upload bản build

1. Trong trang quản lý app, chọn tab **"Cấu hình"** hoặc **"Release"**
2. Click **"Upload phiên bản"**
3. Chọn file `attendance-app-zma.zip`
4. Hệ thống sẽ kiểm tra và hiển thị thông tin:
   - File `index.html` ✅ (tự động nhận diện)
   - Dung lượng: ~0.4 MB
5. Click **"Xác nhận"** / **"Upload"**

---

## Bước 6: Cấu hình Domain Whitelist

Trong tab **"Cấu hình"** → **"Danh sách cho phép"** (Allowlist/Whitelist), thêm các domain sau:

```txt
firestore.googleapis.com
firebasestorage.googleapis.com
identitytoolkit.googleapis.com
securetoken.googleapis.com
api.cloudinary.com
res.cloudinary.com
```

> **Lưu ý**: ZMA yêu cầu whitelist tất cả domain mà app gọi API. Nếu thiếu, app sẽ bị lỗi khi fetch data từ Firebase hoặc upload ảnh Cloudinary.

---

## Bước 7: Test thử

Sau khi upload thành công, ZMA sẽ cấp cho bạn:

1. **Link test**: Dạng `https://mini.zalo.me/test/xxxxx`
2. Mở link này trên **Zalo App** (không phải trình duyệt web)
3. Kiểm tra các chức năng:
   - [ ] App load được trên Zalo
   - [ ] Đăng nhập bằng Zalo hoạt động
   - [ ] Xem lịch trực hiển thị đúng
   - [ ] Admin thêm/sửa/xóa record
   - [ ] Upload ảnh qua Cloudinary
   - [ ] Thống kê biểu đồ

---

## Bước 8: Public (khi sẵn sàng)

1. Vào tab **"Phát hành"** (Release)
2. Click **"Gửi duyệt"** nếu muốn public cho mọi người dùng
3. Hoặc để ở chế độ **"Chỉ dev"** nếu chỉ dùng nội bộ

---

## Các lệnh cần nhớ

```bash
# Dev server (test trên web)
npm run dev

# Build web (GitHub Pages)
npm run build

# Deploy lên GitHub Pages
npm run deploy

# Build + zip ZMA (output: attendance-app-zma.zip)
npm run zip:zma
```

---

## 🔄 Quy trình deploy đầy đủ

### A. Deploy lên GitHub Pages

```bash
# 1. Build web
npm run build

# 2. Deploy lên GitHub Pages
npm run deploy

# 3. Commit & push code
git add .
git commit -m "chore: update source code"
git push origin main
```

### B. Deploy lên Zalo Mini App

```bash
# 1. Build + zip ZMA
npm run zip:zma

# 2. Lên https://mini.zalo.me/ upload file attendance-app-zma.zip

# 3. Commit & push code
git add .
git commit -m "chore: update source code"
git push origin main
```

### C. Deploy cả hai cùng lúc

```bash
# Build web + build ZMA cùng lúc
npm run build && npm run zip:zma

# Deploy web lên GitHub Pages
npm run deploy

# Sau đó lên mini.zalo.me upload file attendance-app-zma.zip
```

---

## ⚠️ Troubleshooting thường gặp

| Vấn đề                       | Nguyên nhân                     | Cách fix                                         |
| ---------------------------- | ------------------------------- | ------------------------------------------------ |
| App load nhưng trắng         | BASE_PATH sai                   | Kiểm tra `.env.zma` có `BASE_PATH=./`            |
| Firebase lỗi                 | Domain chưa whitelist           | Thêm domain vào whitelist                        |
| Upload ảnh lỗi               | Cloudinary CORS                 | Config CORS cho upload preset                    |
| Login không được             | ZMA SDK thiếu                   | Kiểm tra script trong `index.html`               |
| Build ra `dist/` thay `www`  | Sai mode build                  | Dùng `npm run zip:zma` (tự động chọn mode `zma`) |
| `app-config.json` sai format | `zmp-vite-plugin` tạo format cũ | Script build tự động ghi đè từ `zma-config.json` |

---

## Cấu trúc file quan trọng

```
attendance-app/
├── zma-config.json          # ✅ Source of truth cho cấu hình ZMA
├── scripts/
│   └── build-zma.mjs        # Script build + zip (tự động ghi đè app-config.json)
├── www/                     # Build output (sau khi chạy npm run zip:zma)
│   ├── index.html
│   ├── assets/
│   └── app-config.json      # Đã được ghi đè với format ZMA v2 chuẩn
└── attendance-app-zma.zip   # File zip để upload lên ZMA Dashboard
```
