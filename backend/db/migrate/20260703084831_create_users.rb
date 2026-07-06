class CreateUsers < ActiveRecord::Migration[8.1]
  def change
    # 主キーを「user_id」に明示的に変更して作成
    create_table :users, primary_key: :user_id do |t|
      t.string :name, limit: 50, null: false               # 氏名（最大50文字、必須）
      t.string :nickname, limit: 15                       # ニックネーム（最大15文字、任意）
      t.string :bio, limit: 200                           # 自己紹介（最大200文字、任意）
      t.string :icon_image, limit: 255                    # アイコン画像パス（任意）
      t.string :email, limit: 255, null: false             # メールアドレス（必須）
      t.string :password_digest, null: false              # 暗号化パスワード（必須）
      t.string :otp_secret_key                            # 二要素認証用の暗号化秘密鍵（任意）
      t.integer :role, null: false, default: 2            # 権限ロール (1: admin, 2: member)
      t.integer :login_failure_count, null: false, default: 0 # 失敗回数（初期値:0）
      t.datetime :locked_at                               # アカウントロック日時（任意）

      t.timestamps # created_at と updated_at を自動作成
    end

    # メールアドレスでの高速な検索および一意性（重複禁止）を保証するインデックスを追加
    add_index :users, :email, unique: true
  end
end
