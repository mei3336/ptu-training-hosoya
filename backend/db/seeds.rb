# db/seeds.rb

# 既存のユーザーデータを削除（初期化）
User.destroy_all

# 共通パスワード
default_password = 'Password123'

# ユーザーデータの定義
users = [
  {
    name: '細谷 芽生',
    email: 'hosoya@example.com',
    nickname: 'めい',
    bio: '町内会のIT担当役員です。システムに関する質問はお気軽にどうぞ！',
    role: 1,
    password: default_password
  },
  {
    name: '佐藤 健一',
    email: 'sato@example.com',
    nickname: 'さとう',
    bio: '地域の見守り活動をしています。よろしくお願いします。',
    role: 2,
    password: default_password
  },
  {
    name: '鈴木 花子',
    email: 'suzuki@example.com',
    nickname: 'はなちゃん',
    bio: 'ガーデニングが好きで、町内の花壇の手入れを担当しています。',
    role: 2,
    password: default_password
  },
  {
    name: '田中 次郎',
    email: 'tanaka@example.com',
    nickname: 'じろー',
    bio: '夏祭りの企画を手伝っています。美味しい焼きそばの焼き方なら任せてください！',
    role: 2,
    password: default_password
  },
  {
    name: '高橋 美咲',
    email: 'takahashi@example.com',
    nickname: 'みさき',
    bio: '最近引っ越してきました。町内のことを色々教えていただけると嬉しいです。',
    role: 2,
    password: default_password
  }
]

# ユーザーの登録
users.each do |user_data|
  User.create!(
    name: user_data[:name],
    email: user_data[:email],
    nickname: user_data[:nickname],
    bio: user_data[:bio],
    role: user_data[:role],
    password: user_data[:password],
    password_confirmation: user_data[:password]
  )
end

puts "Seedデータを作成しました。"