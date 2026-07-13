import Input from "./Input";
import Button from "./Button";
import React from "react";
import { useNavigate } from "react-router-dom";

const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEXP = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

function validateForm(data, mode) {
  const errors = {};

  if (!data.name.trim()) {
    errors.name = ["を入力してください。"];
  } else if (data.name.length > 50) {
    errors.name = ["は50文字以内で入力してください。"];
  }

  if (!data.email.trim()) {
    errors.email = ["を入力してください。"];
  } else if (data.email.length > 255) {
    errors.email = ["は255文字以内で入力してください。"];
  } else if (!EMAIL_REGEXP.test(data.email)) {
    errors.email = ["の形式が正しくありません。"];
  }

  const passwordProvided = data.password.length > 0;
  if (mode === "create" && !passwordProvided) {
    errors.password = ["を入力してください。"];
  } else if (passwordProvided) {
    if (data.password.length < 8 || data.password.length > 32) {
      errors.password = ["は8文字以上32文字以内で入力してください。"];
    } else if (!PASSWORD_REGEXP.test(data.password)) {
      errors.password = ["は英大文字・英小文字・数字をそれぞれ1文字以上含めてください。"];
    } else if (data.password === data.email) {
      errors.password = ["はメールアドレスと同じものは設定できません。"];
    }
  }

  if (passwordProvided && data.password !== data.passwordConfirmation) {
    errors.passwordConfirmation = ["がパスワードと一致しません。"];
  }

  if (data.nickname && data.nickname.length > 15) {
    errors.nickname = ["は15文字以内で入力してください。"];
  }

  if (data.bio && data.bio.length > 200) {
    errors.bio = ["は200文字以内で入力してください。"];
  }

  return errors;
}

function UserForm({ mode = "create", initialData = {}, onSubmit, errors={}}) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [clientErrors, setClientErrors] = React.useState({});
  const [formData, setFormData] = React.useState({
    name: initialData.name || "",
    nickname: initialData.nickname || "",
    email: initialData.email || "",
    bio: initialData.bio || "",
    password: "",
    passwordConfirmation: "",
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
    setClientErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  
  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      icon_image: e.target.files[0],
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    const validationErrors = validateForm(formData, mode);
    setClientErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = { ...formData };
      delete submitData.passwordConfirmation;
      await onSubmit(submitData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayErrors = { ...errors, ...clientErrors };



  return <form onSubmit={handleSubmit}>
    <div>
      <div>
        <Input
          label="メールアドレス *"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={displayErrors.email}
        />
      </div>


      <div>
        <Input
          label="パスワード *"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={displayErrors.password}
        />
      </div>

      <div>
        <Input
          label="パスワード（確認用） *"
          type="password"
          name="passwordConfirmation"
          value={formData.passwordConfirmation}
          onChange={handleChange}
          error={displayErrors.passwordConfirmation}
        />
      </div>

      <div>
        <Input
          label="氏名 *"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={displayErrors.name}
        />
      </div>

      <div>
      <Input
        label="ニックネーム"
        name="nickname"
        value={formData.nickname}
        onChange={handleChange}
        error={displayErrors.nickname}
      />
      </div>

      <div>
      <Input
        label="自己紹介"
        name="bio"
        value={formData.bio}
        onChange={handleChange}
        error={displayErrors.bio}
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
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? "処理中..."
          : mode === "create"
            ? "登録する"
            : "更新する"}
      </Button>
      <Button
        variant="secondary"
        onClick={() => navigate(-1)}
        disabled={isSubmitting}
      >
        戻る
      </Button>
    </div>
  </form>;
}

export default UserForm;
