import "~/components/ConfirmDialog/styles.css";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Xóa",
  cancelLabel = "Hủy",
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  if (!open) return null;

  const handleOverlayClick = loading ? undefined : onCancel;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div
          style={{ textAlign: "center", fontSize: "36px", marginBottom: "8px" }}
        >
          ⚠️
        </div>
        <h3 style={{ textAlign: "center" }}>{title}</h3>
        <p
          style={{
            textAlign: "center",
            color: "var(--text-secondary)",
            marginBottom: "20px",
          }}
        >
          {message}
        </p>
        <div className="modal-actions" style={{ justifyContent: "center" }}>
          <button
            className="btn-cancel"
            onClick={onCancel}
            disabled={loading}
            style={{
              padding: "14px 20px",
              border: "none",
              borderRadius: "var(--radius-md)",
              fontSize: "15px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              background: "var(--bg-muted)",
              color: "var(--text-secondary)",
              flex: 1,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {cancelLabel}
          </button>
          <button
            className="btn-danger"
            onClick={onConfirm}
            autoFocus
            disabled={loading}
            style={{
              padding: "14px 20px",
              border: "none",
              borderRadius: "var(--radius-md)",
              fontSize: "15px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              background: "var(--danger)",
              color: "#ffffff",
              flex: 1,
              opacity: loading ? 0.8 : 1,
            }}
          >
            {loading ? (
              <>
                <span className="btn-spinner" />
                {" Đang xử lý..."}
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
