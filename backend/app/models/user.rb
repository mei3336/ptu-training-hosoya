class User < ApplicationRecord
  self.primary_key = "user_id"

  LOGIN_LOCK_THRESHOLD = 5
  LOGIN_LOCK_DURATION = 15.minutes

  enum :role, {
        admin: 1,
        member: 2
  }


  has_one_attached :icon_image
  has_secure_password

  validates :name,
            presence: { message: "を入力してください。" },
            length: {
              maximum: 50,
              message: "は50文字以内で入力してください。"
            }

  validates :email,
            presence: { message: "を入力してください。" },
            length: {
              maximum: 255,
              message: "は255文字以内で入力してください。"
            },
            format: {
              with: URI::MailTo::EMAIL_REGEXP,
              message: "の形式が正しくありません。"
            },
            uniqueness: {
              message: "は既に登録されています。"
            }

  validates :password,
            presence: { message: "を入力してください。" },
            length: {
              minimum: 8,
              maximum: 32,
              message: "は8文字以上32文字以内で入力してください。"
            },
            format: {
              with: /\A(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+\z/,
              message: "は英大文字・英小文字・数字をそれぞれ1文字以上含めてください。"
            },
            allow_nil: true  #パスワードが空の場合はバリデーションをスキップする. マイページ編集時のパスワード送信は任意設計。

  validates :nickname,
            length: {
              maximum: 15,
              message: "は15文字以内で入力してください。"
            },
            allow_blank: true

  validates :bio,
            length: {
              maximum: 200,
              message: "は200文字以内で入力してください。"
            },
            allow_blank: true
            

  validate :password_not_same_as_email

  # 現在ロック中かどうかを判定する。ロック期間を過ぎていれば自動的に解除する。
  def locked?
    return false if locked_at.blank?

    if locked_at < LOGIN_LOCK_DURATION.ago
      update!(locked_at: nil, login_failure_count: 0)
      false
    else
      true
    end
  end

  # ログイン失敗時に呼び出す。閾値に達したらロックする。
  def register_login_failure!
    increment!(:login_failure_count)
    update!(locked_at: Time.current) if login_failure_count >= LOGIN_LOCK_THRESHOLD
  end

  def reset_login_failure_count!
    update!(login_failure_count: 0, locked_at: nil)
  end

  def mfa_enabled?
    otp_secret_key.present?
  end

  private

  def password_not_same_as_email
    return if password.blank? || email.blank?

    if password == email
      errors.add(:password, "はメールアドレスと同じものは設定できません。")
    end
  end
end