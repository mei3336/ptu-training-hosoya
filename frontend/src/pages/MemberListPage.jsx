import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MemberCard from "../components/MemberCard";
import UserDetailModal from "../components/UserDetailModal";
import { useAuth } from "../contexts/AuthContext";

function MemberListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    // バックエンドのAPIURLを指定（Docker環境なら /api/users など）
    fetch('/api/v1/users') // プロキシ設定が効いていればこれでOK
      .then(res => {
        if (!res.ok) {
          throw new Error(`サーバーからの応答がありません: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setMembers(data);
      })
      .catch(err => {
        console.error("データ取得エラー:", err);
      });
  }, []);
  
  if (!user) {
    return null;
  }
  return (
    <div>
      <h1>メンバー一覧</h1>
      
      <div className="member-list">
        {members.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            onClick={setSelectedMember}
          />
        ))}
      </div>

      {/*モーダル*/}
       <UserDetailModal
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        member={selectedMember}
      />

    </div>
  );
}

export default MemberListPage;