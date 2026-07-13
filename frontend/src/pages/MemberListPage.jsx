import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MemberCard from "../components/MemberCard";
import UserDetailModal from "../components/UserDetailModal";
import Input from "../components/Input";
import { useAuth } from "../contexts/AuthContext";

function MemberListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMembers = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return members;

    return members.filter((member) =>
      [member.name, member.nickname]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(keyword))
    );
  }, [members, searchTerm]);

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
        setLoadError("メンバー一覧の取得に失敗しました。時間をおいて再度お試しください。");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (!user) {
    return null;
  }
  return (
    <div>
      <h1>メンバー一覧</h1>

      {!isLoading && !loadError && members.length > 0 && (
        <div className="mb-4 max-w-sm">
          <Input
            label="名前・ニックネームで検索"
            name="memberSearch"
            placeholder="名前やニックネームを入力"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {isLoading && <p className="mt-4">読み込み中...</p>}

      {loadError && (
        <p className="mt-4 text-red-500">{loadError}</p>
      )}

      {!isLoading && !loadError && members.length === 0 && (
        <p className="mt-4 text-gray-500">登録されているメンバーがいません。</p>
      )}

      {!isLoading && !loadError && members.length > 0 && filteredMembers.length === 0 && (
        <p className="mt-4 text-gray-500">該当するメンバーが見つかりませんでした。</p>
      )}

      <div className="member-list">
        {filteredMembers.map((member) => (
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