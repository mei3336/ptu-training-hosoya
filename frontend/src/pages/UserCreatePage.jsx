import React from "react";
import UserForm from "../components/UserForm";
//import { useMembers } from "../components/hooks/useMembers";


function UserCreatePage() {
  //const { createUser } = useMembers();
  const handleSubmit = (formData) => {
    console.log("登録データ", formData);

    // 後でAPI接続
    //createUser(formData)
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