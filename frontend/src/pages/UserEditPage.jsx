import { useParams } from "react-router-dom";
import UserForm from "../components/UserForm";
import React, { useState, useEffect } from "react";
import { editUser } from "../services/userService";
import { useNavigate } from "react-router-dom";


function UserEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetch(`/api/v1/users/${id}`)
      .then(res => {
        console.log("status=", res.status);
        return res.json();
      })
      .then(data => {
        console.log("取得データ", data);
        setUser(data);
      })
      .catch(err => console.error(err));
  }, [id]);
    console.log(id); // 1001

  //const { editUser } = useMembers();
    
    const handleSubmit = async (formData) => {
        console.log("ページの親の中", formData);
        console.log(formData.icon_image);
        try {
          await editUser(id, formData);
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