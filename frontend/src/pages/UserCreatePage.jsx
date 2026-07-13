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
  const [errors, setErrors] = React.useState({});

  const handleSubmit = async (formData) => {
    console.log("ページの親の中", formData);
    try {
      await createUser(formData);
      alert("メンバー登録が完了しました！");
      navigate("/users");

    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.log("validation errors", error.response.data.errors);
        // Railsから届いた { errors: { name: [...], email: [...] } } をそのままセット
        setErrors(error.response.data.errors);
      } else {
        alert('通信エラーが発生しました。');     
      }
    }
  };

  if (!user) {
    return <div>読み込み中...</div>;
  }

  if  (user?.role !== "admin"){
     return <div>このページにアクセスする権限がありません。</div>;
  }

  return (
    <div>
      <h1>新規メンバー登録</h1>
      <UserForm 
        mode = "create"
        onSubmit={handleSubmit}
        errors = {errors}
      />
    </div>
  );
}

export default UserCreatePage;