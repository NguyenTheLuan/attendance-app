# 🚀 Hướng dẫn Deploy Attendance App lên Zalo Mini App

## Yêu cầu

- Tài khoản Zalo Developer: https://mini.zalo.me/
- Ứng dụng đã build: `npm run zip:zma` → file `dist-zma/attendance-app-zma.zip`

---

## Bước 1: Truy cập Zalo Mini App Dashboard

Mở trình duyệt, vào **https://mini.zalo.me/** và đăng nhập bằng tài khoản Zalo của bạn.

---

## Bước 2: Tạo Mini App mới

1. Click nút **"Tạo Mini App"** (góc phải trên cùng)
2. Điền thông tin:
   - **Tên Mini App**: `Điểm Danh Khu Phố`
   - **Mô tả**: `Ứng dụng hỗ trợ điểm danh và quản lý lịch trực cho khu phố. Người dân có thể xem lịch, điểm danh trực tuyến, admin dễ dàng theo dõi thống kê và xuất báo cáo hàng tháng.`
   - **Upload icon**: Chọn ảnh vuông 512x512px
3. Nhấn **"Tạo"**

---

## Bước 3: Upload bản build

1. Trong trang quản lý app, chọn tab **"Cấu hình"** hoặc **"Release"**
2. Click **"Upload phiên bản"**
3. Chọn file `attendance-app-zma.zip` (đã tạo ở bước build)
4. Hệ thống sẽ kiểm tra và hiển thị thông tin:
   - File `index.html` ✅ (tự động nhận diện)
   - Dung lượng: ~0.32 MB
5. Click **"Xác nhận"** / **"Upload"**

---

## Bước 4: Cấu hình Domain Whitelist

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

## Bước 5: Cấu hình app-config.json

File `app-config.json` đã có sẵn trong project. Nếu cần chỉnh sửa:

```json
{
  "app": {
    "title": "Điểm Danh Khu Phố",
    "headerColor": "#1677ff",
    "textColor": "#ffffff"
  }
}
```

Các tham số:

- `title`: Tiêu đề hiển thị trên header ZMA
- `headerColor`: Màu nền header (mã hex)
- `textColor`: Màu chữ trên header

---

## Bước 6: Test thử

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

## Bước 7: Public (khi sẵn sàng)

1. Vào tab **"Phát hành"** (Release)
2. Click **"Gửi duyệt"** nếu muốn public cho mọi người dùng
3. Hoặc để ở chế độ **"Chỉ dev"** nếu chỉ dùng nội bộ

---

## Các lệnh cần nhớ

```bash
# Dev server (test trên web)
npm run dev

# ─── GitHub Pages ─────────────────────
# Build web (output: dist/)
npm run build

# Deploy lên GitHub Pages
npm run deploy

# ─── Zalo Mini App ────────────────────
# Build + zip ZMA (output: www/ → dist-zma/attendance-app-zma.zip)
npm run zip:zma
```

---

## 🔄 Quy trình deploy đầy đủ (Manual — không CI/CD)

### A. Deploy lên GitHub Pages

```bash
# 1. Build web
npm run build

# 2. Kiểm tra thư mục dist/ có đủ file không
ls dist/

# 3. Deploy lên GitHub Pages
npm run deploy

# 4. Commit & push code nếu có thay đổi
git add .
git commit -m "chore: update source code"
git push origin main   # hoặc tên branch của bạn
```

> ⚠️ Nếu dùng `gh-pages` lần đầu, cần vào GitHub repo → Settings → Pages → chọn branch `gh-pages`.

### B. Deploy lên Zalo Mini App

```bash
# 1. Build + zip
npm run zip:zma

# 2. Kiểm tra file zip
ls dist-zma/attendance-app-zma.zip

# 3. Lên https://mini.zalo.me/ upload file zip đó

# 4. Commit & push code nếu có thay đổi
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

# Sau đó lên mini.zalo.me upload file dist-zma/attendance-app-zma.zip
```

---

## ⚠️ Troubleshooting thường gặp

| Vấn đề                      | Nguyên nhân                    | Cách fix                                         |
| --------------------------- | ------------------------------ | ------------------------------------------------ |
| App load nhưng trắng        | BASE_PATH sai                  | Kiểm tra `.env.zma` có `BASE_PATH=./`            |
| Firebase lỗi                | Domain chưa whitelist          | Thêm domain vào whitelist                        |
| Upload ảnh lỗi              | Cloudinary CORS                | Config CORS cho upload preset                    |
| Login không được            | ZMA SDK thiếu                  | Kiểm tra script trong `index.html`               |
| `www/` không có app-config  | Thiếu plugin `zmp-vite-plugin` | Kiểm tra trong `vite.config.ts` có import plugin |
| Build ra `dist/` thay `www` | Sai mode build                 | Dùng `npm run zip:zma` (tự động chọn mode `zma`) |
