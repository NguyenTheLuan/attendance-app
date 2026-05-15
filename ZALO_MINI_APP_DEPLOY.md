# 🚀 Deploy Attendance App lên Zalo Mini App

## Kế hoạch chi tiết

---

## Phase 1: Phân tích hiện trạng

### ✅ Công nghệ hiện tại

| Công nghệ             | Trạng thái  | Ghi chú                            |
| --------------------- | ----------- | ---------------------------------- |
| React 19 + TypeScript | ✅ OK       | ZMA hỗ trợ React                   |
| Vite build            | ✅ OK       | Cần cấu hình lại base path         |
| HashRouter            | ✅ OK       | Phù hợp với ZMA (iframe)           |
| Firebase Firestore    | ✅ OK       | Cần whitelist domain               |
| Cloudinary upload     | ✅ OK       | Cần whitelist domain + config CORS |
| GitHub Pages deploy   | ❌ Cần thay | ZMA deploy lên Zalo Cloud          |
| localStorage login    | ❌ Cần sửa  | Phải dùng Zalo OAuth thay thế      |

---

## Phase 2: Cấu hình dự án

### Bước 1: Cài đặt dependencies

```bash
npm install zmp-sdk zmp-ui
npm install -D @vitejs/plugin-zmp
```

### Bước 2: Tạo `app-config.json`

File cấu gốc cho Zalo Mini App (cần thay `APP_ID` thật).

### Bước 3: Tạo `mini.app.json`

Cấu hình routing và theme cho ZMA.

### Bước 4: Sửa `vite.config.ts`

- Đổi `base` từ `"/attendance-app/"` thành `"/"` hoặc `"./"`
- Thêm plugin ZMP

### Bước 5: Sửa `index.html`

- Thêm Zalo SDK script
- Thêm meta tags cho ZMA

---

## Phase 3: Chỉnh sửa code

### Bước 6: Tích hợp Zalo Login

- Bỏ login local (`localStorage` hiện tại)
- Dùng `zmp-sdk` login flow:
  - `getAccessToken()` → lấy token
  - `getUserInfo()` → lấy thông tin user

### Bước 7: Thay `localStorage` bằng ZMA Storage

Dùng ZMA's `setStorage()` / `getStorage()` thay vì `localStorage`.

### Bước 8: Wrap App với ZaloProvider

```tsx
import { ZaloProvider } from "zmp-ui";

<ZaloProvider>
  <App />
</ZaloProvider>;
```

### Bước 9: Xử lý routing

- ZMA thường có trang index là trang chính (`/view`)
- Cần map route ZMA với React Router

---

## Phase 4: Build & Deploy

### Bước 10: Build thử

```bash
npm run build
```

### Bước 11: Cài Zalo CLI

```bash
npm install -g zmp-cli
```

### Bước 12: Login & Deploy

```bash
zmp login
zmp deploy
```

### Bước 13: Cấu hình Domain Whitelist

Trên Zalo Developer Dashboard → Mini App → Cấu hình:

- `firestore.googleapis.com`
- `api.cloudinary.com`
- `res.cloudinary.com`
- `firebasestorage.googleapis.com`

---

## Phase 5: Kiểm thử

### Checklist test

- [ ] App load được trên Zalo
- [ ] Login Zalo hoạt động
- [ ] View lịch trực hiển thị đúng
- [ ] Thêm mới record (admin)
- [ ] Upload ảnh qua Cloudinary
- [ ] Thống kê hiển thị biểu đồ
- [ ] Navigation giữa các trang

---

## ⚠️ Rủi ro & Lưu ý

1. **CORS & Domain Whitelist**: Firebase và Cloudinary cần được whitelist trên ZMA dashboard
2. **Zalo OAuth**: Không thể giữ login đơn giản như hiện tại
3. **Upload ảnh**: Cloudinary unsigned upload có thể bị chặn, cần signed upload preset
4. **Bundle size**: Cần tối ưu nếu quá 10MB
5. **Chi phí Zalo Cloud**: Free tier có giới hạn

---

## 📅 Ước tính thời gian

| Phase                    | Thời gian        |
| ------------------------ | ---------------- |
| Phase 2 - Cấu hình       | ~30 phút         |
| Phase 3 - Chỉnh code     | ~1 giờ           |
| Phase 4 - Build & Deploy | ~30 phút         |
| Phase 5 - Kiểm thử       | ~30 phút         |
| **Tổng**                 | **~2.5 - 3 giờ** |
