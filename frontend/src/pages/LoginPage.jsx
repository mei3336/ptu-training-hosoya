import Button from "../components/Button";
import Input from "../components/Input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginApi, verifyMfaLogin } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mfaUserId, setMfaUserId] = useState(null);
  const [otpCode, setOtpCode] = useState("");

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

      if (response.result === "mfa_required") {
        setMfaUserId(response.user_id);
        return;
      }

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

  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    if (isSubmitting) return;

    if (!otpCode.trim()) {
      setErrors({ code: ["を入力してください。"] });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await verifyMfaLogin(mfaUserId, otpCode);

      if (response.result === "success") {
        login({
          id: response.user.id,
          role: response.user.role,
          name: response.user.name,
        });

        navigate("/members");
      }
    } catch (error) {
      if (error.data?.errors) {
        setErrors(error.data.errors);
      } else {
        setErrors({ network: ["通信エラーが発生しました。時間をおいて再度お試しください。"] });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (mfaUserId) {
    return (
      <div>
        <h1>二要素認証</h1>
        <p className="mt-2 text-gray-600">
          認証アプリに表示されている6桁のコードを入力してください。
        </p>

        {errors.code?.map((msg, index) => (
          <p key={index} className="text-red-500">
            {msg}
          </p>
        ))}

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

        <form onSubmit={handleVerifyOtp}>
          <Input
            label="確認コード"
            name="code"
            placeholder="123456"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            error={errors.code}
          />

          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "確認中..." : "確認する"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setMfaUserId(null);
              setOtpCode("");
              setErrors({});
            }}
          >
            戻る
          </Button>
        </form>
      </div>
    );
  }

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