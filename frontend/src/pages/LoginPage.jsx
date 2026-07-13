import Button from "../components/Button";
import Input from "../components/Input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (isSubmitting) return;

    const validationErrors = {};
    if (!email.trim()) {
      validationErrors.email = ["を入力してください。"];
    }
    if (!password) {
      validationErrors.password = ["を入力してください。"];
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try{
      const response = await loginApi(email, password);

      if (response.result === "success") {
        login({
          id: response.user.id,
          role: response.user.role,
          name: response.user.name,
        });

        navigate("/members");
      }
    } catch (error) {
      if (error.status === 401) {
        // Railsから届いた { errors: { name: [...], email: [...] } } をそのままセット
        setErrors(error.data.errors);
      } else {
        setErrors({ network: ["通信エラーが発生しました。時間をおいて再度お試しください。"] });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>ログイン画面</h1>

      {errors.login?.map((msg, index) => (
        <p key={index} className="text-red-500">
          {msg}
        </p>
      ))}

      {errors.network?.map((msg, index) => (
        <p key={index} className="text-red-500">
          {msg}
        </p>
      ))}

      <form onSubmit={handleLogin}>
        <Input
          label="メールアドレス"
          name="email"
          placeholder="メールアドレスを入力してください"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <Input
          label="パスワード"
          name="password"
          type="password"
          placeholder="パスワードを入力してください"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "ログイン中..." : "ログイン"}
        </Button>
      </form>
    </div>
  );
}

export default LoginPage;