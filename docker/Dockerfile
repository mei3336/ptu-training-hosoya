FROM ruby:3.4

# 1. 必要なシステムパッケージのインストール
RUN apt-get update -qq && \
    apt-get install -y build-essential libpq-dev postgresql-client

# 2. 作業ディレクトリの設定
WORKDIR /app

# 3. ローカルに生成されたGemfile群をコンテナ内に先行コピー
COPY backend/Gemfile backend/Gemfile.lock ./

# 4. バンドラーの更新と、Gem（bcryptやpgなど）をすべてコンテナにインストール！
RUN gem update --system && \
    bundle install

# 5. ポート指定
EXPOSE 3000

# 6. Rails 8サーバーの起動コマンド
CMD ["rails", "server", "-b", "0.0.0.0"]