// UserForm.jsx
import { useState } from "react";
import Button from "./Button";
import Input from "./Input";

function UserForm({ mode = "create", initialData = {}, onSubmit }) {
  const [formData, setFormData] = useState({
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
      setFormData((prev) => ({
        ...prev,
        value,
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
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="氏名 *"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="氏名を入力"
      />

      <Input
        label="ニックネーム"
        name="nickname"
        value={formData.nickname}
        onChange={handleChange}
        placeholder="ニックネームを入力"
      />

      <Input
        label="メールアドレス *"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="example@example.com"
      />

      <div className="input-container">
        <label className="input-label">自己紹介</label>

        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          maxLength={200}
          rows={4}
          className="input-field"
          placeholder="自己紹介を入力"
        />
      </div>

      <Input
        label={
          mode === "create"
            ? "初期パスワード *"
            : "パスワード（変更時のみ入力）"
        }
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />

      <div className="input-container">
        <label className="input-label">権限</label>

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="input-field"
        >
          <option value="member">一般ユーザー</option>
          <option value="admin">管理者</option>
        </select>
      </div>

      <div className="input-container">
        <label className="input-label">
          プロフィール画像
        </label>

        <input
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
    </form>
  );
}

export default UserForm;
