import React from "react";
import Button from "@/components/Button";
import { useNavigate } from "react-router-dom";
import { logout as logoutApi } from "@/services/authService";
import { useAuth } from "../contexts/AuthContext";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logoutApi();
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  
  if (!user) {
    return (
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">地域コミュニティ</h1>
        </div>
      </header>
      );
    }

  if (user.role==="admin"){
    return(
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">地域コミュニティ</h1>
          <nav className="header-nav">
            <a href="/members" className="header-link">メンバー一覧</a>
            <a href="/mypage" className="header-link">マイページ</a>
            <a href="/users" className="header-link">名簿管理（管理者専用）</a>
          </nav>
          <div className="flex items-center justify-end gap-4 mt-8">
            <span>ログイン中：<br /> {user?.name}さん</span>
            <Button
              onClick={handleLogout}
            >
              ログアウト
            </Button>
          </div>
        </div>
      </header>
    );
  }

  if (user.role==="member"){
    return(
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">地域コミュニティ</h1>
          <nav className="header-nav">
            <a href="/members" className="header-link">メンバー一覧</a>
            <a href="/mypage" className="header-link">マイページ</a>
          </nav>
          <div className="flex items-center justify-end gap-4 mt-8">
            <span>ログイン中：<br /> {user?.name}さん</span>
            <Button
              onClick={handleLogout}
            >
              ログアウト
            </Button>
          </div>
        </div>
      </header>
    );
  }


}

export default Header;