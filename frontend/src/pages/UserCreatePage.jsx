import React from "react";
import UserForm from "../components/UserForm";
import { createUser } from "../services/userService";
//import { useMembers } from "../components/hooks/useMembers";


function UserCreatePage() {
  //const { createUser } = useMembers();
  
  const handleSubmit = async (formData) => {
    try {
      await createUser(formData);
      alert("メンバー登録が完了しました！");

      console.log("登録成功", result);

    } catch (error) {
      console.error("登録エラー:",error);
      alert("登録に失敗しました。入力内容を確認してください。");
    }
  };

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