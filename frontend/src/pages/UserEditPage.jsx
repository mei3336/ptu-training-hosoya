import { useParams } from "react-router-dom";
import UserForm from "../components/UserForm";
import React from "react";

function UserEditPage() {
  
  const { id } = useParams();

  console.log(id); // 1001

  //const { editUser } = useMembers();
  const handleSubmit = (formData) => {
    console.log("登録データ", formData);

    // 後でAPI接続
    //editUser(id, formData)
  };

  return (
    <div>
      <h1>ユーザー編集</h1>
      <UserForm 
        mode="edit"
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default UserEditPage;