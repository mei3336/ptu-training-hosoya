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

  const handleLogin = async () => {
    try{
      const response = await loginApi(email, password);

      if (response.result === "success") {
        console.log("navigate前");

        login({
          id: response.user.id,
          role: response.user.role,
          name: response.user.name,
        });

        navigate("/members");
      }
    } catch (error) {
      if (error.status === 401) {
        console.log("validation errors", error.data);
        // Railsから届いた { errors: { name: [...], email: [...] } } をそのままセット
        setErrors(error.data.errors);
      } else {
        alert('通信エラーが発生しました。');     
      }
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

      <Input 
        label="メールアドレス" 
        name="email" 
        placeholder="メールアドレスを入力してください"
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input 
        label="パスワード" 
        name="password" 
        type="password" 
        placeholder="パスワードを入力してください" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />

      <Button variant="primary" onClick={handleLogin}>
        ログイン
      </Button>
    </div>
  );
}

export default LoginPage;