import { useParams } from "react-router-dom";
import UserForm from "../components/UserForm";
import React, { useState, useEffect } from "react";
import { editUser } from "../services/userService";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";

function UserEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  

  useEffect(() => {
    const fetchUser = async () => {
      // マイページ編集
      if (!id) {
        const data = await getCurrentUser();

        setUser(data.user);
        return;
      }

      // 通常のユーザー編集
      const res = await fetch(`/api/v1/users/${id}`);
      const data = await res.json();

      setUser(data);
    };
    fetchUser();
  }, [id]);

  //const { editUser } = useMembers();
    
    const handleSubmit = async (formData) => {
        const targetId = id || user.user_id;
        console.log("ページの親の中", formData);
        console.log(formData.icon_image);
        try {
          await editUser(targetId, formData);
          alert("ユーザー情報を更新しました！");
          navigate(-1);

        } catch (error) {
          console.error("登録エラー:",error);
          alert("登録に失敗しました。入力内容を確認してください。");
        }
      };

  if (!user) {
    return <div>読み込み中...</div>;
  }

  return (
    <div>
      <h1>ユーザー編集</h1>
      <UserForm
        mode="edit"
        initialData={user}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default UserEditPage;