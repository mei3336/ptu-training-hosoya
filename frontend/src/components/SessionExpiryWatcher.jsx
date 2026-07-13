import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

export default function SessionExpiryWatcher() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const handleSessionExpired = () => {
      if (!user) return;

      logout();
      showToast("セッションの有効期限が切れました。再度ログインしてください。", "error");
      navigate("/");
    };

    window.addEventListener("session-expired", handleSessionExpired);
    return () => window.removeEventListener("session-expired", handleSessionExpired);
  }, [user, logout, showToast, navigate]);

  return null;
}
