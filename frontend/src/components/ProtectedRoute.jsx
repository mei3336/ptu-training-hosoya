import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Button from "./Button";

export default function ProtectedRoute({
  children,
  allowedRoles,
}) {

  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="member-card">
          <h2>アクセス権限がありません</h2>
          <p>管理者へお問い合わせください。</p>
            <Button
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            戻る
          </Button>  
        </div>
      </div>
    );

  }

  return <>{children}</>;
}