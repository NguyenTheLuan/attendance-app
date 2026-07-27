-- 1. TẠO BẢNG MEMBERS
CREATE TABLE IF NOT EXISTS public.members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

-- Bật RLS cho bảng members
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Policy cho members: Ai cũng được xem (SELECT), chỉ user đăng nhập (Authenticated) mới được Thêm/Sửa/Xóa
CREATE POLICY "Cho phép đọc members công khai"
ON public.members FOR SELECT USING (true);

CREATE POLICY "Cho phép sửa members khi đã đăng nhập"
ON public.members FOR ALL USING (auth.role() = 'authenticated');


-- 2. CẬP NHẬT POLICY CHO BẢNG RECORDS
-- Lưu ý: Nếu bạn đã tạo bảng records trước đó, chỉ cần cập nhật Policy.
-- Xóa Policy cũ (nếu có)
DROP POLICY IF EXISTS "Cho phép đọc công khai" ON public.records;
DROP POLICY IF EXISTS "Cho phép Insert công khai" ON public.records;
DROP POLICY IF EXISTS "Cho phép Update công khai" ON public.records;
DROP POLICY IF EXISTS "Cho phép Delete công khai" ON public.records;
DROP POLICY IF EXISTS "Cho phép tất cả (Tạm thời)" ON public.records;

-- Tạo Policy mới, chặt chẽ hơn:
-- Bất kỳ ai cũng được xem danh sách trực (SELECT)
CREATE POLICY "Cho phép xem records công khai"
ON public.records FOR SELECT USING (true);

-- CHỈ những ai đã đăng nhập (Authenticated Admin) mới được Thêm, Sửa, Xóa điểm danh
CREATE POLICY "Chỉ Admin được Thêm/Sửa/Xóa records"
ON public.records FOR ALL USING (auth.role() = 'authenticated');


-- 3. THÊM DỮ LIỆU MẪU (Tùy chọn)
INSERT INTO public.members (name) VALUES 
('Nguyễn Thế Luân'),
('Nguyễn Văn A'),
('Trần Thị B'),
('Lê Hoàng C')
ON CONFLICT (name) DO NOTHING;
