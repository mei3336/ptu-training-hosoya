import { useParams } from "react-router-dom";
import UserForm from "../components/UserForm";
import React, { useState, useEffect } from "react";
import { editUser } from "../services/userService";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";

function UserEditPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [errors, setErrors] = React.useState({});
  

  useEffect(() => {
    const fetchUser = async () => {
      // マイページ編集
      if (!id) {
        const data = await getCurrentUser();

        setProfile(data.user);
        return;
      }

      // 通常のユーザー編集
      const res = await fetch(`/api/v1/users/${id}`);
      const data = await res.json();

      setProfile(data);
    };
    fetchUser();
  }, [id]);

  //const { editUser } = useMembers();
    
    const handleSubmit = async (formData) => {
        const targetId = id || profile.user_id;
        console.log("ページの親の中", formData);
        console.log(formData.icon_image);
        try {
          await editUser(targetId, formData);
          alert("ユーザー情報を更新しました！");
          navigate(-1);

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

  if (!profile) {
    return <div>読み込み中...</div>;
  }

  if (!user) {
    return  navigate("/");
  }

  return (
    <div>
      <h1>ユーザー編集</h1>
      <UserForm
        mode="edit"
        initialData={profile}
        onSubmit={handleSubmit}
        errors = {errors}
      />
    </div>
  );
}

export default UserEditPage;