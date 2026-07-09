import Button from "@/components/Button";
import MemberCard from "@/components/MemberCard";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/services/authService";
import { useEffect, useState } from "react";


function MyPage() {
// 仮のユーザーデータ 本番は　MyPage(user) {

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const data = await getCurrentUser();
      setUser(data);
    };
      fetchCurrentUser();
    }, []);


  if (!user) {
    return <div>読み込み中...</div>;
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
          <MemberCard member={user} />
        </div>


        <div className="flex justify-end gap-2 mt-8">
          <Button
            onClick={() => navigate("/users/id/edit".replace("id", user.id))}
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