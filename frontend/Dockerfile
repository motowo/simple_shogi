# 開発環境用ステージ
FROM node:18-alpine AS development

WORKDIR /app

# package.jsonとpackage-lock.json（存在する場合）をコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm ci || npm install

# アプリケーションコードをコピー
COPY . .

# 開発サーバーを起動
EXPOSE 8080
CMD ["npm", "run", "dev"]

# ビルドステージ
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci || npm install

COPY . .
RUN npm run build

# 本番環境用ステージ
FROM nginx:alpine AS production

# Nginxの設定ファイルをコピー
COPY nginx.conf /etc/nginx/nginx.conf

# ビルドステージから成果物をコピー
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]