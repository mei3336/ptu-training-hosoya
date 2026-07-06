import Button from "../components/Button";
import Input from "../components/Input";

function LoginPage() {
  return (
    <div>
      <h1>ログイン画面</h1>
      <Input label="メールアドレス" name="email" placeholder="メールアドレスを入力してください" />
      <Input label="パスワード" name="password" type="password" placeholder="パスワードを入力してください" />
      <Button variant="primary">ログイン</Button>
    </div>
  );
}

export default LoginPage;