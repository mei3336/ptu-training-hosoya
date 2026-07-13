import Input from "./Input";
import Button from "./Button";
import React from "react";
import { useNavigate } from "react-router-dom";

function UserForm({ mode = "create", initialData = {}, onSubmit, errors={}}) {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    name: initialData.name || "",
    nickname: initialData.nickname || "",
    email: initialData.email || "",
    bio: initialData.bio || "",
    password: "",
    role: initialData.role || "member",
    icon_image: null,
  });

  React.useEffect(() => {
    if (mode !== "edit") return;
      
      setFormData(prev => ({
        ...prev,
        name: initialData.name || "",
        nickname: initialData.nickname || "",
        password:initialData.password || "",
        email: initialData.email || "",
        bio: initialData.bio || "",
        role: initialData.role || "member",
      }));
  }, [mode,initialData]);

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
      icon_image: e.target.files[0],
    }));
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);
    onSubmit(formData);
  };



  return <form onSubmit={handleSubmit}>
    <div>
      <div>
        <Input
          label="メールアドレス *"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />
      </div>


      <div>
        <Input
          label="パスワード *"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />
      </div>

      <div>
        <Input
          label="氏名 *"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
        />
      </div>

      <div>
      <Input
        label="ニックネーム"
        name="nickname"
        value={formData.nickname}
        onChange={handleChange}
        error={errors.nickname}
      />
      </div>

      <div>
      <Input
        label="自己紹介"
        name="bio"
        value={formData.bio}
        onChange={handleChange}
        error={errors.bio}
      />
      </div>

      <div>
      <Input
        label="アイコン画像"
        type="file"
        name="icon_image"
        accept="image/*"
        onChange={handleFileChange}
      />
      </div>

    </div>
    <div className="flex justify-end gap-2 mt-8">
      <Button type="submit">
        {mode === "create"
          ? "登録する"
          : "更新する"}
      </Button>
      <Button
        variant="secondary"
        onClick={() => navigate(-1)}
      >
        戻る
      </Button>   
    </div>
  </form>;
}

export default UserForm;
