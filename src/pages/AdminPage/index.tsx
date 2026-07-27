import { useState, useCallback, useRef } from "react";
import { isAbsentNote } from "~/utils/absence";
import { uploadImage } from "~/services/cloudinary";
import Field from "~/components/Field";
import DateSelector, { getDateString } from "~/components/DateSelector";
import { addRecord } from "~/services/db";
import type { AttendanceRecord } from "~/types";

export default function AdminPage() {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [dateType, setDateType] = useState<"today" | "tomorrow" | "custom">("today");
  const [customDate, setCustomDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const isAbsent = isAbsentNote(note);
  const dateStr = getDateString(dateType, customDate);

  const forceCamera = localStorage.getItem("attendance_force_camera") === "true";

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  }

  const handleAdd = useCallback(
    async (data: Omit<AttendanceRecord, "id" | "createdAt">) => {
      await addRecord(data);
    },
    []
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setMessage("Vui lòng nhập tên");
      return;
    }
    if (!isAbsent && !file) {
      setMessage("Vui lòng chụp hoặc chọn ảnh");
      return;
    }
    setUploading(true);
    setMessage("");
    try {
      let imageUrl = "";
      if (!isAbsent && file) {
        imageUrl = await uploadImage(file);
      }
      
      const names = name.split(",").map((n) => n.trim()).filter(Boolean);
      for (const n of names) {
        await handleAdd({
          name: n,
          imageUrl,
          date: dateStr,
          note: note.trim() || "",
        });
      }
      
      // Reset form
      setName("");
      setNote("");
      setFile(null);
      setPreview(null);
      if (cameraInputRef.current) cameraInputRef.current.value = "";
      if (galleryInputRef.current) galleryInputRef.current.value = "";
      
      const count = names.length;
      setMessage(`✅ Đã lưu điểm danh ${count} người thành công!`);
      setIsSuccess(true);
    } catch (err) {
      console.error("Lỗi khi lưu record:", err);
      setMessage("❌ Lỗi khi lưu. Thử lại nhé.");
      setIsSuccess(false);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="page" style={{ paddingBottom: "100px" }}>
      <h1>📋 Điểm Danh Trực</h1>

      <form className="card form" onSubmit={handleSubmit}>
        {!isAbsent && (
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>
              Ảnh người trực
            </label>
            
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              ref={cameraInputRef}
              style={{ display: "none" }}
              disabled={uploading}
            />
            
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={galleryInputRef}
              style={{ display: "none" }}
              disabled={uploading}
            />

            {preview ? (
              <div style={{ position: "relative" }}>
                <img 
                  src={preview} 
                  alt="Preview" 
                  style={{ width: "100%", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", aspectRatio: "3/4", objectFit: "cover" }} 
                />
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                    if (cameraInputRef.current) cameraInputRef.current.value = "";
                    if (galleryInputRef.current) galleryInputRef.current.value = "";
                  }}
                  className="btn-danger"
                  style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "var(--radius-sm)", fontWeight: "bold" }}
                  disabled={uploading}
                >
                  ✕ Xóa ảnh
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  disabled={uploading}
                  style={{
                    background: "var(--primary)",
                    color: "var(--text-on-primary)",
                    border: "none",
                    padding: "16px",
                    borderRadius: "var(--radius-md)",
                    fontSize: "16px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: "var(--shadow-sm)"
                  }}
                >
                  <span style={{ fontSize: "20px" }}>📸</span> Chụp ảnh (Camera)
                </button>
                
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  disabled={uploading}
                  style={{
                    background: "var(--bg-surface-2)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border)",
                    padding: "12px",
                    borderRadius: "var(--radius-md)",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }}
                >
                  <span style={{ fontSize: "18px" }}>🖼️</span> Chọn từ thư viện
                </button>
              </div>
            )}
          </div>
        )}

        <Field
          label="Tên người trực"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập tên... (cách nhau bằng dấu phẩy)"
          disabled={uploading}
        />

        <DateSelector
          dateType={dateType}
          customDate={customDate}
          onDateTypeChange={setDateType}
          onCustomDateChange={setCustomDate}
          disabled={uploading}
        />

        <Field
          as="textarea"
          label="Ghi chú"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={isAbsent ? "Ví dụ: vắng (không cần ảnh)" : "Ví dụ: hỗ trợ..."}
          disabled={uploading}
          rows={2}
        />

        <button type="submit" className="btn-primary" disabled={uploading} style={{ width: "100%", padding: "14px", fontSize: "15px" }}>
          {uploading ? "⏳ Đang xử lý..." : "💾 LƯU ĐIỂM DANH"}
        </button>
        
        {message && (
          <p className={`msg ${isSuccess ? "ok" : "err"}`} style={{ marginTop: "12px", textAlign: "center" }}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
