import Button from "@/components/Button";
import MemberCard from "@/components/MemberCard";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/services/authService";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { logout as logoutApi } from "@/services/authService";

import LastAdminWarningModal from "@/components/LastAdminWarningModal";
import WithdrawModal from "@/components/WithdrawModal";
import OrganizationWithdrawModal from "@/components/OrganizationWithdrawModal";

function MyPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  
  useEffect(() => {
    console.log("useEffect実行");

    (async () => {
      console.log("API呼び出し前");

      const data = await getCurrentUser();

      console.log("取得成功", data);

      setProfile({
        ...data.user,
        icon_image_url: data.icon_image_url,
    });
    })();
  }, []);

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] =
    useState(false);

  const [isLastAdminModalOpen, setIsLastAdminModalOpen] =
    useState(false);

  const [isAppTerminationModalOpen, setIsAppTerminationModalOpen] =
    useState(false);

  const handleWithdraw = async () => {
    try {
      const res = await fetch(
        "/api/v1/users/withdraw",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }

      );

      if (res.status === 409) {
        setIsWithdrawModalOpen(false);
        setIsLastAdminModalOpen(true);
        return;
      }

      if (!res.ok) {
        throw new Error("退会に失敗しました");
      }
      await logoutApi();
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      logout();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleAppTermination = async () => {
    try {
      const res = await fetch(
        "/api/v1/users/cancel_app_usage",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("アプリ利用終了に失敗しました");
      }
      
      await logoutApi();
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      logout();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

    

  if (!profile) {
    return <div>読み込み中...</div>;
  }

  if (!user) {
    return  navigate("/");
  }
 
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">
        マイページ
      </h1>

      <p className="mt-2 text-gray-600">
        ご自身のプロフィール情報を確認できます。
      </p>

        {/* メンバーカード流用 */}
        <div className="mypage-member-card">
          <MemberCard member={profile}
          />
        </div>


        <div className="flex justify-end gap-2 mt-8">
          <Button
            onClick={() => navigate("/mypage/edit")}
          >
            編集する
          </Button>

          <Button
            variant="secondary"
            onClick={() => navigate("/members")}
          >
            戻る
          </Button>
           {user?.role === "admin" && (
              <Button
                variant="danger"
                onClick={() =>setIsWithdrawModalOpen(user)}
              >
                退会する
              </Button>
             )}
        </div>
          {user?.role === "admin" && (
            <>
              <WithdrawModal
                isOpen={isWithdrawModalOpen}
                onClose={() => setIsWithdrawModalOpen(false)}
                onConfirm={handleWithdraw}
              />

              <LastAdminWarningModal
                isOpen={isLastAdminModalOpen}
                onClose={() => setIsLastAdminModalOpen(false)}
                onOrganizationWithdraw={() => {
                  setIsLastAdminModalOpen(false);
                  setIsAppTerminationModalOpen(true);
                }}
              />

              <OrganizationWithdrawModal
                isOpen={isAppTerminationModalOpen}
                onClose={() =>
                  setIsAppTerminationModalOpen(false)
                }
                onConfirm={handleAppTermination}
              />
            </>
          )}
    </div>
  );
}

export default MyPage;