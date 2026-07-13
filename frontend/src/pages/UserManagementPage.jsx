import React, { useEffect, useMemo, useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import UserDeleteModal from "@/components/UserDelateModal";
import UserRoleModal from "@/components/UserRoleEditModal";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import ConfirmRoleModal from "@/components/RoleConfirmModal";

export default function UserManagementPage() {
  const navigate = useNavigate();
  const { user:  currentUser } = useAuth();
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [selectedDeleteUser, setSelectedDeleteUser] = useState(null);
  const [selectedRoleUser, setSelectedRoleUser] = useState(null);
  const [roleConfirm, setRoleConfirm] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return users;

    return users.filter((user) =>
      [user.name, user.nickname]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(keyword))
    );
  }, [users, searchTerm]);

  useEffect(() => {
    fetch('/api/v1/users') // プロキシ設定が効いていればこれでOK
      .then(res => {
        if (!res.ok) {
          throw new Error(`サーバーからの応答がありません: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        const formattedMembers = data.map(user => ({
          id: user.id,             // Railsの user_id を id に統一
          name: user.name,
          nickname: user.nickname,
          email: user.email,
          role: user.role,              // "admin" や "member" という文字列
          // ここで役割に応じたラベルを生成する
          roleLabel: user.role === 'admin' ? '管理者' : 'メンバー'
        }));
        setUsers(formattedMembers);
      })
      .catch(err => {
        console.error("データ取得エラー:", err);
        setLoadError("名簿の取得に失敗しました。時間をおいて再度お試しください。");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  
  const handleRoleUpdate = async (userId, role) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const res = await fetch(
        `/api/v1/users/${userId}/update_role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: {
              role,
            },
          }),
        }
      );

      if (!res.ok) {
        throw new Error("権限更新に失敗しました");
      }

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, role }
            : user
        )
      );
      const roleLabel =
        role === "admin" ? "管理者" : "一般メンバー";
      showToast(`${selectedRoleUser.name}さんの権限を「${roleLabel}」に変更しました。`);
      setSelectedRoleUser(null);
    } catch (error) {
      console.error("権限更新エラー:", error);
      showToast("権限の更新に失敗しました。", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedDeleteUser || isProcessing) return;
    setIsProcessing(true);

    try {
      const res = await fetch(
        `/api/v1/users/${selectedDeleteUser.id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("削除に失敗しました");
      }

      setUsers((prev) =>
        prev.filter(
          (user) => user.id !== selectedDeleteUser.id
        )
      );
      showToast(`${selectedDeleteUser.name}さんのユーザー情報を削除しました。`);
      setSelectedDeleteUser(null);
    } catch (error) {
      console.error("削除エラー:", error);
      showToast("削除に失敗しました。", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  if  (currentUser?.role !== "admin"){
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

        {isLoading && <p className="mb-4">読み込み中...</p>}

        {loadError && (
          <p className="mb-4 text-red-500">{loadError}</p>
        )}

        {!isLoading && !loadError && (
          <div className="mb-4 max-w-sm">
            <Input
              label="氏名・ニックネームで検索"
              name="userSearch"
              placeholder="氏名やニックネームを入力"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        {!isLoading && !loadError && filteredUsers.length === 0 && (
          <p className="mb-4 text-gray-500">該当するメンバーが見つかりませんでした。</p>
        )}

        {/* Table */}
        {!isLoading && !loadError && filteredUsers.length > 0 && (
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
              {filteredUsers.map((user) => (
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
                      onClick={() => setSelectedRoleUser(user)}
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

                      {user.id !== currentUser?.id && (
                        <Button
                          variant="danger"
                          onClick={() => setSelectedDeleteUser(user)}
                        >
                          削除
                        </Button>
                      )}
                      
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/*モーダル*/}
      <UserDeleteModal
        isOpen={!!selectedDeleteUser}
        onClose={() => setSelectedDeleteUser(null)}
        user={selectedDeleteUser}
        onDelete={handleDelete}
        isSubmitting={isProcessing}
      />
  
      <UserRoleModal
        isOpen={!!selectedRoleUser}
        onClose={() => setSelectedRoleUser(null)}
        user={selectedRoleUser}
        onUpdate={(userId, role) => {
          setRoleConfirm({
            userId,
            user: selectedRoleUser,
            role,
          });
        }}
      />

      <ConfirmRoleModal
        isOpen={!!roleConfirm}
        user={roleConfirm?.user}
        role={roleConfirm?.role}
        onClose={() => setRoleConfirm(null)}
        isSubmitting={isProcessing}
        onConfirm={async () => {
          await handleRoleUpdate(
            roleConfirm.userId,
            roleConfirm.role
          );

          setRoleConfirm(null);
          setSelectedRoleUser(null);
        }}
      />
    </div>
  );
}