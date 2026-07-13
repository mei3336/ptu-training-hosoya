require "test_helper"

class Api::V1::AuthControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(
      name: "テスト太郎",
      email: "test-auth@example.com",
      password: "Passw0rd"
    )
  end

  # このサンドボックスにはconfig/master.keyが存在せず、
  # Rails.application.credentials.secret_key_baseがnilになるため、
  # JWT発行を伴うテストのみ一時的に値を差し替える。
  def with_stubbed_secret_key_base
    credentials = Rails.application.credentials
    credentials.define_singleton_method(:secret_key_base) { "x" * 32 }
    yield
  ensure
    credentials.singleton_class.send(:remove_method, :secret_key_base)
  end

  test "ログイン成功時に失敗回数がリセットされる" do
    @user.update!(login_failure_count: 3)

    with_stubbed_secret_key_base do
      post "/api/v1/login", params: { email: @user.email, password: "Passw0rd" }
    end

    assert_response :ok
    @user.reload
    assert_equal 0, @user.login_failure_count
    assert_nil @user.locked_at
  end

  test "ログイン失敗のたびに失敗回数が増える" do
    post "/api/v1/login", params: { email: @user.email, password: "wrong-password" }

    assert_response :unauthorized
    assert_equal 1, @user.reload.login_failure_count
  end

  test "規定回数失敗するとアカウントがロックされる" do
    (User::LOGIN_LOCK_THRESHOLD - 1).times do
      post "/api/v1/login", params: { email: @user.email, password: "wrong-password" }
    end
    assert_nil @user.reload.locked_at

    post "/api/v1/login", params: { email: @user.email, password: "wrong-password" }

    assert_response :unauthorized
    assert @user.reload.locked_at.present?
  end

  test "ロック中は正しいパスワードでもログインできない" do
    @user.update!(locked_at: Time.current, login_failure_count: User::LOGIN_LOCK_THRESHOLD)

    post "/api/v1/login", params: { email: @user.email, password: "Passw0rd" }

    assert_response :locked
  end

  test "ロック期間経過後は自動的にロックが解除される" do
    @user.update!(locked_at: (User::LOGIN_LOCK_DURATION + 1.minute).ago, login_failure_count: User::LOGIN_LOCK_THRESHOLD)

    with_stubbed_secret_key_base do
      post "/api/v1/login", params: { email: @user.email, password: "Passw0rd" }
    end

    assert_response :ok
  end
end
