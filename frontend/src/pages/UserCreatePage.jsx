import React from "react";
import UserForm from "../components/UserForm";
import { createUser } from "../services/userService";
//import { useMembers } from "../components/hooks/useMembers";


function UserCreatePage() {
  //const { createUser } = useMembers();
  
  const handleSubmit = async (formData) => {
    try {
      const result = await createUser(formData);

      console.log("登録成功", result);

    } catch (error) {
      console.error(error);
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