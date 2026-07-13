import { useToast } from "@/contexts/ToastContext";
import "./Toast.css";

export default function Toast() {
  const { toast, clearToast } = useToast();

  if (!toast) return null;

  return (
    <div className="toast-container" role="status" aria-live="polite">
      <div className={`toast toast-${toast.type}`}>
        <span>{toast.message}</span>
        <button
          type="button"
          className="toast-close"
          onClick={clearToast}
          aria-label="閉じる"
        >
          ×
        </button>
      </div>
    </div>
  );
}
