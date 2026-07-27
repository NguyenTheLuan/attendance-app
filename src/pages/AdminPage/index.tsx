import { useState, useCallback, useRef } from "react";
import { isAbsentNote } from "~/utils/absence";
import { uploadImage } from "~/services/cloudinary";
import Field from "~/components/Field";
import DateSelector from "~/components/DateSelector";
import { getDateString } from "~/utils/dateUtils";
import { addRecord, getMembers, addMember, type Member } from "~/services/db";
import { useTranslation } from "~/hooks/useTranslation";
import type { AttendanceRecord } from "~/types";
import { useEffect } from "react";

export default function AdminPage() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [isAddingNewMember, setIsAddingNewMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  
  const [note, setNote] = useState("");
  const [dateType, setDateType] = useState<"today" | "tomorrow" | "custom">("today");
  const [customDate, setCustomDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  
  useEffect(() => {
    async function loadMembers() {
      try {
        const data = await getMembers();
        setMembers(data);
        if (data.length > 0) setName(data[0].name);
      } catch (err) {
        console.error("Error loading members:", err);
      } finally {
        setLoadingMembers(false);
      }
    }
    loadMembers();
  }, []);

  
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
    
    let targetName = name;
    
    // If adding a new member
    if (isAddingNewMember) {
      if (!newMemberName.trim()) {
        setMessage(t("admin.nameError"));
        return;
      }
      try {
        setUploading(true);
        const newMember = await addMember(newMemberName.trim());
        if (newMember) {
          setMembers((prev) => [...prev, newMember].sort((a, b) => a.name.localeCompare(b.name)));
          targetName = newMember.name;
          setName(newMember.name);
        }
      } catch (err) {
        setMessage("Lỗi khi thêm thành viên mới!");
        setUploading(false);
        return;
      }
    }
    
    if (!targetName.trim()) {
      setMessage(t("admin.nameError"));
      return;
    }
    if (!isAbsent && !file) {
      setMessage(t("admin.photoError"));
      return;
    }
    setUploading(true);
    setMessage("");
    try {
      let imageUrl = "";
      if (!isAbsent && file) {
        imageUrl = await uploadImage(file);
      }
      
      const names = targetName.split(",").map((n) => n.trim()).filter(Boolean);
      for (const n of names) {
        await handleAdd({
          name: n,
          imageUrl,
          date: dateStr,
          note: note.trim() || "",
        });
      }
      
      // Reset form (giữ nguyên name đã chọn)
      setNote("");
      setFile(null);
      setPreview(null);
      setIsAddingNewMember(false);
      setNewMemberName("");
      if (cameraInputRef.current) cameraInputRef.current.value = "";
      if (galleryInputRef.current) galleryInputRef.current.value = "";
      
      const count = names.length;
      setMessage(t("common.success", { count }));
      setIsSuccess(true);
    } catch (err) {
      console.error("Lỗi khi lưu record:", err);
      setMessage(t("common.error"));
      setIsSuccess(false);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="page" style={{ paddingBottom: "100px" }}>
      <h1>{t("admin.title")}</h1>

      <form className="card form" onSubmit={handleSubmit}>
        {!isAbsent && (
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>
              {t("admin.photoLabel")}
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
            
            {!forceCamera && (
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={galleryInputRef}
                style={{ display: "none" }}
                disabled={uploading}
              />
            )}

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
                  {t("admin.deletePhoto")}
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
                  {t("admin.takePhoto")}
                </button>
                
                {!forceCamera && (
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
                    {t("admin.chooseGallery")}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>
            {t("admin.nameLabel")}
          </label>
          
          {!isAddingNewMember ? (
            <div style={{ display: "flex", gap: "8px" }}>
              <select
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={uploading || loadingMembers}
                className="input-field"
                style={{ flex: 1, padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg-input)", color: "var(--text-primary)" }}
              >
                {loadingMembers ? (
                  <option>Đang tải danh sách...</option>
                ) : members.length === 0 ? (
                  <option value="">Chưa có dữ liệu</option>
                ) : (
                  members.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name}
                    </option>
                  ))
                )}
              </select>
              <button
                type="button"
                onClick={() => setIsAddingNewMember(true)}
                disabled={uploading}
                style={{ padding: "0 16px", background: "var(--bg-surface-2)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)", cursor: "pointer" }}
              >
                + Mới
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "8px", flexDirection: "column" }}>
              <input
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Nhập tên thành viên mới..."
                disabled={uploading}
                className="input-field"
                style={{ padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg-input)", color: "var(--text-primary)", width: "100%" }}
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  setIsAddingNewMember(false);
                  setNewMemberName("");
                }}
                disabled={uploading}
                style={{ padding: "8px", background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", textAlign: "left", fontSize: "13px" }}
              >
                Hủy thêm mới (Chọn từ danh sách)
              </button>
            </div>
          )}
        </div>

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
