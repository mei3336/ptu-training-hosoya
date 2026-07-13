class Api::V1::MfaController < ApplicationController
    before_action :authenticate_user!, only: [ :setup, :verify, :disable ]
    before_action :require_admin, only: [ :setup, :verify, :disable ]

    # 二要素認証の設定を開始する。QRコード用のURIとシークレットを返す。
    # この時点ではまだユーザーには保存せず、verifyで正しいコードが
    # 入力されて初めて有効化する。
    def setup
        secret = ROTP::Base32.random
        totp = ROTP::TOTP.new(secret, issuer: "地域コミュニティ")

        render json: {
            secret: secret,
            otpauth_url: totp.provisioning_uri(current_user.email)
        }
    end

    # setupで発行したシークレットとコードを検証し、有効なら二要素認証を有効化する。
    def verify
        secret = params[:secret]
        totp = ROTP::TOTP.new(secret)

        if secret.present? && totp.verify(params[:code], drift_behind: 30)
            current_user.update!(otp_secret_key: secret)
            render json: { result: "success", message: "二要素認証を有効にしました。" }
        else
            render json: { errors: { code: [ "確認コードが正しくありません。" ] } }, status: :unprocessable_entity
        end
    end

    # ログイン時、パスワード認証済みかつ二要素認証が有効なユーザーのコードを検証する。
    def verify_login
        user = User.find_by(user_id: params[:user_id])

        if user.nil? || !user.mfa_enabled?
            return render json: { errors: { code: [ "無効なリクエストです。" ] } }, status: :unprocessable_entity
        end

        if user.locked?
            return render json: {
                errors: { login: [ I18n.t("errors.messages.account_locked") ] }
            }, status: :locked
        end

        totp = ROTP::TOTP.new(user.otp_secret_key)

        if totp.verify(params[:code], drift_behind: 30)
            user.reset_login_failure_count!
            issue_jwt_cookie(user)

            render json: {
                result: "success",
                message: "ログインに成功しました",
                user: {
                    id: user.id,
                    role: user.role,
                    name: user.name,
                    email: user.email
                }
            }, status: :ok
        else
            user.register_login_failure!
            render json: { errors: { code: [ "確認コードが正しくありません。" ] } }, status: :unauthorized
        end
    end

    # 二要素認証を無効化する。
    def disable
        current_user.update!(otp_secret_key: nil)
        render json: { result: "success", message: "二要素認証を無効にしました。" }
    end

    private

    def require_admin
        unless current_user.admin?
            render json: { error: "権限がありません" }, status: :forbidden
        end
    end
end
