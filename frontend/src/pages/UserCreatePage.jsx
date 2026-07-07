import React from "react";
import UserForm from "../components/UserForm";
import Modal from "../components/Modal";
import { useMembers } from "../components/hooks/useMembers";


function UserCreatePage() {
  const { createUser } = useMembers();
  const handleSubmit = (formData) => {
    console.log("登録データ", formData);

    // 後でAPI接続
    // createUser(formData)
  };

  return (
    <Modal>
      <h1>新規メンバー登録</h1>
      <UserForm 
        mode="create" 
        onSubmit={handleSubmit} 
      />
    </Modal>
  );
}

export default UserCreatePage;