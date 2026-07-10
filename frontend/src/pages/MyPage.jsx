import Button from "@/components/Button";
import MemberCard from "@/components/MemberCard";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/services/authService";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function MyPage() {
  const { user } = useAuth();
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
        </div>
      </div>
  );
}

export default MyPage;