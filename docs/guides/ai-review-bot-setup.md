# 🤖 Hướng dẫn cài đặt Trợ lý AI Review Code (CodeRabbit)

Dự án **Attendance App** sử dụng **CodeRabbit AI** để tự động review code, tìm lỗi và tối ưu hóa mã nguồn mỗi khi có Pull Request mới. Đây là một công cụ cực kỳ mạnh mẽ, miễn phí cho dự án cá nhân và giúp cải thiện chất lượng code đáng kể.

---

## 🌟 CodeRabbit AI là gì?

CodeRabbit là một ứng dụng (GitHub App) tích hợp trực tiếp vào kho lưu trữ GitHub của bạn. Khi bạn tạo một Pull Request, CodeRabbit sẽ:
1. **Đọc hiểu Code:** Phân tích các dòng code bị thay đổi.
2. **Tìm lỗi (Bugs):** Phát hiện các lỗi tiềm ẩn, lỗi bảo mật hoặc code chạy không tối ưu.
3. **Góp ý trực tiếp:** Comment (bình luận) trực tiếp vào từng dòng code bị lỗi và đưa ra đoạn code sửa lỗi (Suggest code).
4. **Tóm tắt PR:** Tự động viết tóm tắt những gì PR này thay đổi bằng ngôn ngữ tự nhiên.

---

## 🛠️ Các bước cài đặt (Chỉ mất 1 phút)

> **Lưu ý:** Bạn không cần phải viết bất kỳ file cấu hình Workflow nào (`.github/workflows/*.yml`) hay nạp tiền mua API Key. CodeRabbit lo toàn bộ hạ tầng AI cho bạn hoàn toàn miễn phí.

### Bước 1: Truy cập kho ứng dụng GitHub
Truy cập vào trang cài đặt của CodeRabbit trên GitHub Marketplace:
👉 **[CodeRabbit AI GitHub App](https://github.com/apps/coderabbitai)**

### Bước 2: Cấp quyền cài đặt
1. Nhấn nút **Install** (Cài đặt) màu xanh lá cây ở góc trên bên phải màn hình.
2. GitHub sẽ yêu cầu bạn chọn tài khoản hoặc tổ chức (Organization) muốn cài đặt. Hãy chọn tài khoản cá nhân của bạn.

### Bước 3: Chọn kho lưu trữ (Repository)
Ở màn hình tiếp theo, bạn có 2 lựa chọn:
- **All repositories** (Cài cho mọi kho lưu trữ của bạn - Không khuyến khích).
- **Only select repositories** (Chỉ cài cho một số kho cụ thể - Khuyên dùng).

Hãy chọn **Only select repositories** và tick chọn kho lưu trữ `attendance-app` (ví dụ: `NguyenTheLuan/attendance-app`).

### Bước 4: Hoàn tất
1. Nhấn nút **Install & Authorize** (Cài đặt & Cấp quyền).
2. Hệ thống sẽ chuyển hướng bạn đến trang Dashboard của CodeRabbit. Khi bạn thấy thông báo **"All done! 🥕 100%"**, quá trình cài đặt đã hoàn tất thành công!

---

## 🚀 Hướng dẫn sử dụng

Từ bây giờ, bạn không cần phải làm gì thêm nữa. Quy trình làm việc của bạn sẽ diễn ra tự động như sau:

1. Bạn tạo một nhánh mới (Branch) trên máy tính.
2. Viết code, Commit và Push nhánh đó lên GitHub.
3. Tạo **Pull Request (PR)** trên GitHub để gộp code vào nhánh `main`.
4. Ngay lập tức, **CodeRabbit bot** sẽ tự động nhảy vào PR của bạn, phân tích code và để lại bình luận chi tiết. 
5. Bạn có thể chat trực tiếp với CodeRabbit ngay trong comment của PR để yêu cầu nó giải thích thêm hoặc sửa lại đoạn code theo ý mình.

Chúc bạn có những dòng code mượt mà, không bug với sự hỗ trợ của AI! 🎉
