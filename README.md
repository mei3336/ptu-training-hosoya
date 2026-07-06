# 会員名簿・組織図アプリ

## システム概要

地域コミュニティ向けの会員管理システム

## 技術構成

- React
- Ruby on Rails API
- PostgreSQL
- Docker

## 主な機能

- ログイン
- 二要素認証
- メンバー一覧
- ユーザー詳細
- マイページ
- ユーザー登録
- ユーザー編集
- ユーザー削除
- 権限変更

## 画面

- SCR01 ログイン
- SCR02 メンバー一覧
- SCR03 詳細モーダル
- SCR04 マイページ
- SCR05 名簿管理
- SCR06 ユーザー登録
- SCR07 ユーザー編集

## システム構成
PTU-TRAINING-HOSOYA/          # プロジェクトのルート
├── .gitignore
├── README.md
│
├── backend/                    # バックエンド：Ruby on Rails 8 (API専用モード)
│   ├── Gemfile
│   ├── config/
│   │   ├── routes.rb           # ★APIのURLパス（エンドポイント）を定義する場所
│   │   └── cors.rb             # ★React（別ポート）からのアクセスを許可するCORS設定
│   ├── db/
│   │   ├── migrate/            # ★usersテーブル等を作成するマイグレーションファイル群
│   │   └── schema.rb           # データベースの構造
│   └── app/
│       ├── models/
│       │   └── user.rb         # ★has_secure_password や enum :role、MFA(rotp)を実装する場所
│       └── controllers/
│           └── api/
│               └── v1/         # ★Reactから呼ばれるAPIコントローラー群（バージョン管理）
│                   ├── auth_controller.rb     # ログイン・ログアウト処理
│                   ├── mfa_controller.rb      # 二要素認証(TOTP)処理
│                   └── users_controller.rb    # 名簿一覧・登録・編集・削除・権限変更
│
└── frontend/                   # フロントエンド：React (Vite等で作成)
    ├── package.json
    ├── tailwind.config.js      # Tailwind CSSの設定ファイル
    └── src/
        ├── main.jsx            # アプリのエントリーポイント
        ├── App.jsx             # ルーティングやログイン状態の管理（親コンポーネント）
        │
        ├── components/         # ★画面を問わず使い回す「共通のUIパーツ」
        │   ├── CommonHeader.jsx # 共通ヘッダー（権限でメニューが変わる）
        │   ├── Button.jsx      # 青・赤・グレーの共通ボタン
        │   └── Modal.jsx       # 警告ポップアップ用の共通枠
        │
        ├── pages/              # ★設計書の「SCR01〜SCR07」に対応する各画面コンポーネント
        │   ├── Login.jsx       # SCR01: ログイン画面（MFAモーダルを内包）
        │   ├── MemberList.jsx  # SCR02: メンバー一覧画面（カード形式 ＋ 名前検索）
        │   ├── MemberDetailModal.jsx # SCR03: ユーザー情報詳細モーダル（参照専用）
        │   ├── MyPage.jsx      # SCR04: マイページ画面（一般/管理者の表示制御あり）
        │   ├── AdminDashboard.jsx # SCR05: 名簿管理画面（表形式 ＋ 警告モーダル）
        │   ├── UserRegister.jsx # SCR06: ユーザー登録画面（一般/管理者共通）
        │   └── UserEdit.jsx    # SCR07: ユーザー編集画面（管理者代理編集）
        │
        └── services/           # ★Rails（バックエンド）と通信するための関数群
            └── api.js          # Axiosなどの通信ライブラリを設定し、Rails APIを叩く共通処理

## 今回使う特殊？Gemfile
- bcrypt: ユーザーのパスワードを守る、絶対に開けられない「最強の暗庫（金庫）」。
- rotp: 管理者だけが持つ、30秒ごとに鍵穴が変わる「電子キーシリンダー」。
- rack-cors: ReactとRailsの間を通す、セキュリティゲートの「通行許可証」。