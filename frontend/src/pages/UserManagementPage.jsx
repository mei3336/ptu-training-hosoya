import React, { useState } from "react";
import Button from "../components/Button";

const initialUsers = [
  {
    id: "1001",
    name: "細谷 芽生",
    nickname: "めい",
    email: "hosoya@example.com",
    role: "admin",
  },
  {
    id: "1002",
    name: "佐藤 花子",
    nickname: "はなこ",
    email: "sato@example.com",
    role: "user",
  },
  {
    id: "1003",
    name: "高橋 一郎",
    nickname: "いっちゃん",
    email: "takahashi@example.com",
    role: "user",
  },
  {
    id: "1004",
    name: "鈴木 次郎",
    nickname: "ジロー",
    email: "suzuki@example.com",
    role: "user",
  },
  {
    id: "1005",
    name: "山田 太郎",
    nickname: "会長",
    email: "yamada@example.com",
    role: "admin",
  },
];

export default function UserManagementPage() {
  const [users, setUsers] = useState(initialUsers);

  const toggleRole = (id) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              role: user.role === "admin" ? "user" : "admin",
            }
          : user
      )
    );
  };

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
            onClick={() => navigate("/users/new")}
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
                        onClick={() => navigate(`/users/${user.id}/edit`)}
                      >
                        編集
                      </Button>


                      <Button
                        variant="danger"
                        onClick={() => deleteUser(user.id)}
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
    </div>
  );
}