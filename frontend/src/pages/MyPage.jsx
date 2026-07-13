import Button from "@/components/Button";
import Input from "@/components/Input";
import MemberCard from "@/components/MemberCard";
import { useNavigate } from "react-router-dom";
import {
  getCurrentUser,
  setupMfa,
  verifyMfaSetup,
  disableMfa,
} from "@/services/authService";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { logout as logoutApi } from "@/services/authService";
import { useToast } from "@/contexts/ToastContext";

import LastAdminWarningModal from "@/components/LastAdminWarningModal";
import WithdrawModal from "@/components/WithdrawModal";
import OrganizationWithdrawModal from "@/components/OrganizationWithdrawModal";

function MyPage() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await getCurrentUser();

      setProfile({
        ...data.user,
        icon_image_url: data.icon_image_url,
    });
    })();
  }, []);

  const [mfaSetupInfo, setMfaSetupInfo] = useState(null);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaError, setMfaError] = useState(null);
  const [isMfaSubmitting, setIsMfaSubmitting] = useState(false);

  const handleStartMfaSetup = async () => {
    try {
      const info = await setupMfa();
      setMfaSetupInfo(info);
      setMfaCode("");
      setMfaError(null);
    } catch {
      showToast("二要素認証の設定開始に失敗しました。", "error");
    }
  };

  const handleConfirmMfaSetup = async (e) => {
    e.preventDefault();
    if (isMfaSubmitting) return;

    setIsMfaSubmitting(true);
    try {
      await verifyMfaSetup(mfaSetupInfo.secret, mfaCode);
      setProfile((prev) => ({ ...prev, otp_secret_key: mfaSetupInfo.secret }));
      setMfaSetupInfo(null);
      setMfaCode("");
      setMfaError(null);
      showToast("二要素認証を有効にしました。");
    } catch (error) {
      setMfaError(error.data?.errors?.code?.[0] || "確認コードが正しくありません。");
    } finally {
      setIsMfaSubmitting(false);
    }
  };

  const handleDisableMfa = async () => {
    try {
      await disableMfa();
      setProfile((prev) => ({ ...prev, otp_secret_key: null }));
      showToast("二要素認証を無効にしました。");
    } catch {
      showToast("二要素認証の無効化に失敗しました。", "error");
    }
  };

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

        {user?.role === "admin" && (
          <div className="mt-8 rounded border border-gray-200 p-4">
            <h2 className="text-lg font-bold">二要素認証</h2>

            {profile.otp_secret_key ? (
              <>
                <p className="mt-2 text-gray-600">現在、二要素認証は有効です。</p>
                <Button
                  variant="danger"
                  className="mt-2"
                  onClick={handleDisableMfa}
                >
                  二要素認証を無効にする
                </Button>
              </>
            ) : mfaSetupInfo ? (
              <form onSubmit={handleConfirmMfaSetup}>
                <p className="mt-2 text-gray-600">
                  認証アプリ(Google Authenticator等)に以下のシークレットキーを
                  手動で登録し、表示された6桁のコードを入力してください。
                </p>
                <p className="mt-2 font-mono break-all">{mfaSetupInfo.secret}</p>

                <Input
                  label="確認コード"
                  name="mfaCode"
                  placeholder="123456"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  error={mfaError}
                />

                <div className="flex gap-2">
                  <Button type="submit" disabled={isMfaSubmitting}>
                    {isMfaSubmitting ? "確認中..." : "有効にする"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setMfaSetupInfo(null);
                      setMfaCode("");
                      setMfaError(null);
                    }}
                  >
                    キャンセル
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <p className="mt-2 text-gray-600">二要素認証は現在無効です。</p>
                <Button className="mt-2" onClick={handleStartMfaSetup}>
                  二要素認証を設定する
                </Button>
              </>
            )}
          </div>
        )}


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