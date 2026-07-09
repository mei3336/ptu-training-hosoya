import React from "react";
import Button from "@/components/Button";
import { useNavigate } from "react-router-dom";
import { logout } from "@/services/authService";

function Header() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">地域コミュニティ</h1>
        <nav className="header-nav">
          <a href="/members" className="header-link">メンバー一覧</a>
          <a href="/mypage" className="header-link">マイページ</a>
          <a href="/users" className="header-link">名簿管理（管理者専用）</a>
        </nav>
        <Button
          onClick={handleLogout}
        >
          ログアウト
        </Button>
      </div>
    </header>
  );
}

export default Header;