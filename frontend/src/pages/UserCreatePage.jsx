import React from "react";
import UserForm from "../components/UserForm";
import { createUser } from "../services/userService";
import { useNavigate } from "react-router-dom";
//import { useMembers } from "../components/hooks/useMembers";
import { useAuth } from "../contexts/AuthContext";

function UserCreatePage() {
  //const { createUser } = useMembers();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    console.log("ページの親の中", formData);
    console.log(formData.icon_image);
    try {
      await createUser(formData);
      alert("メンバー登録が完了しました！");
      navigate("/users");

    } catch (error) {
      console.error("登録エラー:",error);
      alert("登録に失敗しました。入力内容を確認してください。");
    }
  };

  if  (user?.role !== "admin"){
     return <div>このページにアクセスする権限がありません。</div>;
  }

  return (
    <div>
      <h1>新規メンバー登録</h1>
      <UserForm 
        
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default UserCreatePage;