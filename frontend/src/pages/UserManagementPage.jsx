import React, { useEffect,useState } from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import UserDeleteModal from "@/components/UserDelateModal";
import { useAuth } from "../contexts/AuthContext";

export default function UserManagementPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(null);

  useEffect(() => {
    fetch('/api/v1/users') // プロキシ設定が効いていればこれでOK
      .then(res => {
        if (!res.ok) {
          throw new Error(`サーバーからの応答がありません: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("取得データ:", data); // これがブラウザのコンソールに出るか確認
        const formattedMembers = data.map(user => ({
          id: user.id,             // Railsの user_id を id に統一
          name: user.name,
          email: user.email,
          role: user.role,              // "admin" や "member" という文字列
          // ここで役割に応じたラベルを生成する
          roleLabel: user.role === 'admin' ? '管理者' : 'メンバー'
        }));
        setUsers(formattedMembers);
      })
      .catch(err => {
        console.error("データ取得エラー:", err);
      });
  }, []);

  const toggleRole = (id) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              role: user.role === "admin" ? "member" : "admin",
            }
          : user
      )
    );
  };

  const handleDelete = async () => {
    if (!selectedUsers) return;

    try {
      const res = await fetch(
        `/api/v1/users/${selectedUsers.id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("削除に失敗しました");
      }

      setUsers((prev) =>
        prev.filter(
          (user) => user.id !== selectedUsers.id
        )
      );

      setSelectedUsers(null);
    } catch (error) {
      console.error("削除エラー:", error);
    }
  };

  if  (user?.role !== "admin"){
    return <div>このページにアクセスする権限がありません。</div>;
  }

  return (
    <div>
      <div>
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1>
              名簿管理（管理者専用）
            </h1>
            <p>
              全メンバーの情報管理と権限設定を行います。
            </p>
          </div>


          <Button
            variant="primary"
            onClick={() => navigate("/users/create")}
          >
            ＋ 新規メンバー登録
          </Button>

        </div>

        {/* Table */}
        <div className="user-table-wrapper">
          <table className="user-table">
            <thead>
              <tr className="border-b">
                <th>
                  ID
                </th>
                <th>
                  氏名 / ニックネーム
                </th>
                <th>
                  メールアドレス
                </th>
                <th>
                  権限（クリックで切替）
                </th>
                <th>
                  操作
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                >
                  <td>
                    {user.id}
                  </td>

                  <td>
                    <div>
                      {user.name}
                    </div>
                    <div>
                      {user.nickname}
                    </div>
                  </td>

                  <td>
                    {user.email}
                  </td>

                  <td>
                    <Button
                      onClick={() => toggleRole(user.id)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                        user.role === "admin"
                          ? "border-red-200 bg-red-50 text-red-600"
                          : "border-gray-200 bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.role === "admin"
                        ? "◉ 管理者"
                        : "メンバー"}
                    </Button>
                  </td>

                  <td>
                    <div className="flex gap-2 justify-end">
                      <Button
                        onClick={() =>{
                          navigate(`/users/${user.id}/edit`)}}
                      >
                        編集
                      </Button>


                      <Button
                        variant="danger"
                        onClick={() => setSelectedUsers(user)}
                      >
                        削除
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/*モーダル*/}
      <UserDeleteModal
        isOpen={!!selectedUsers}
        onClose={() => setSelectedUsers(null)}
        user={selectedUsers}
        onDelete={handleDelete}
      />
    </div>
  );
}