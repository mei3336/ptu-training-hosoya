require "test_helper"

class Api::V1::MfaControllerTest < ActionDispatch::IntegrationTest
  setup do
    @admin = User.create!(
      name: "管理者太郎",
      email: "admin-mfa@example.com",
      password: "Passw0rd",
      role: :admin
    )
    @member = User.create!(
      name: "メンバー花子",
      email: "member-mfa@example.com",
      password: "Passw0rd",
      role: :member
    )
  end

  def with_stubbed_secret_key_base
    credentials = Rails.application.credentials
    credentials.define_singleton_method(:secret_key_base) { "x" * 32 }
    yield
  ensure
    credentials.singleton_class.send(:remove_method, :secret_key_base)
  end

  def login_as(user)
    post "/api/v1/login", params: { email: user.email, password: "Passw0rd" }
  end

  test "管理者はMFAのセットアップ情報を取得できる" do
    with_stubbed_secret_key_base do
      login_as(@admin)
      post "/api/v1/mfa/setup"
    end

    assert_response :ok
    body = JSON.parse(response.body)
    assert body["secret"].present?
    assert body["otpauth_url"].present?
  end

  test "一般メンバーはMFAのセットアップができない" do
    with_stubbed_secret_key_base do
      login_as(@member)
      post "/api/v1/mfa/setup"
    end

    assert_response :forbidden
  end

  test "正しいコードでMFAを有効化できる" do
    secret = ROTP::Base32.random
    code = ROTP::TOTP.new(secret).now

    with_stubbed_secret_key_base do
      login_as(@admin)
      post "/api/v1/mfa/verify", params: { secret: secret, code: code }
    end

    assert_response :ok
    assert @admin.reload.mfa_enabled?
  end

  test "誤ったコードではMFAを有効化できない" do
    secret = ROTP::Base32.random

    with_stubbed_secret_key_base do
      login_as(@admin)
      post "/api/v1/mfa/verify", params: { secret: secret, code: "000000" }
    end

    assert_response :unprocessable_entity
    assert_not @admin.reload.mfa_enabled?
  end

  test "MFA有効な管理者はパスワード認証後にmfa_requiredが返る" do
    secret = ROTP::Base32.random
    @admin.update!(otp_secret_key: secret)

    post "/api/v1/login", params: { email: @admin.email, password: "Passw0rd" }

    assert_response :ok
    body = JSON.parse(response.body)
    assert_equal "mfa_required", body["result"]
    assert_equal @admin.id, body["user_id"]
  end

  test "正しいワンタイムコードでログインが完了する" do
    secret = ROTP::Base32.random
    @admin.update!(otp_secret_key: secret)
    code = ROTP::TOTP.new(secret).now

    with_stubbed_secret_key_base do
      post "/api/v1/mfa/verify_login", params: { user_id: @admin.id, code: code }
    end

    assert_response :ok
    body = JSON.parse(response.body)
    assert_equal "success", body["result"]
  end

  test "誤ったワンタイムコードではログインできない" do
    secret = ROTP::Base32.random
    @admin.update!(otp_secret_key: secret)

    post "/api/v1/mfa/verify_login", params: { user_id: @admin.id, code: "000000" }

    assert_response :unauthorized
    assert_equal 1, @admin.reload.login_failure_count
  end

  test "MFAを無効化できる" do
    with_stubbed_secret_key_base do
      login_as(@admin)
      @admin.update!(otp_secret_key: ROTP::Base32.random)
      delete "/api/v1/mfa"
    end

    assert_response :ok
    assert_not @admin.reload.mfa_enabled?
  end
end
