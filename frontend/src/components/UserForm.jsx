import Input from "./Input";
import Button from "./Button";
import React from "react";

function UserForm({ mode = "create", initialData = {}, onSubmit }) {
  const [formData, setFormData] = React.useState({
    name: initialData.name || "",
    nickname: initialData.nickname || "",
    email: initialData.email || "",
    bio: initialData.bio || "",
    password: "",
    role: initialData.role || "member",
    iconImage: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  
  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      iconImage: e.target.files[0],
    }));
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);
  };



  return <form onSubmit={handleSubmit}>
    <div>
      <Input
        label="メールアドレス *"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />

      
      <Input
        label="初期パスワード *"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />

      <Input
        label="氏名 *"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />

      <Input
        label="ニックネーム"
        name="nickname"
        value={formData.nickname}
        onChange={handleChange}
      />

      <Input
        label="自己紹介"
        name="bio"
        value={formData.bio}
        onChange={handleChange}
      />

      <Input
        label="アイコン画像"
        type="file"
        name="iconImage"
        accept="image/*"
        onChange={handleFileChange}
      />

    </div>

    <Button type="submit">
      {mode === "create"
        ? "登録する"
        : "更新する"}
    </Button>

  </form>;
}

export default UserForm;
