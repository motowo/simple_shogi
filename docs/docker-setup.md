# Docker環境セットアップガイド

## 前提条件

- Docker Desktop（またはDocker Engine）がインストールされていること
- Docker Composeがインストールされていること

## 初回セットアップ

1. プロジェクトルートで以下のコマンドを実行:

```bash
# Docker環境をビルド
docker-compose build

# バックグラウンドで起動
docker-compose up -d
```

2. ブラウザで http://localhost:8080 にアクセス

## よく使うコマンド

### 環境の操作

```bash
# 起動
docker-compose up -d

# 停止
docker-compose down

# ログ確認
docker-compose logs -f frontend

# 再ビルド
docker-compose build --no-cache
```

### コンテナ内での作業

```bash
# コンテナにアクセス
docker-compose exec frontend sh

# コンテナ内でnpmコマンドを実行
docker-compose exec frontend npm install <package>
docker-compose exec frontend npm run test
docker-compose exec frontend npm run lint
```

## トラブルシューティング

### ポート8080が使用中の場合

他のアプリケーションがポート8080を使用している場合は、`docker-compose.yml`の
ポート設定を変更してください：

```yaml
ports:
  - "3000:8080"  # ホストの3000番ポートを使用
```

### ホットリロードが効かない場合

Windows/Macでホットリロードが効かない場合は、`docker-compose.override.yml`の
`CHOKIDAR_USEPOLLING=true`が設定されていることを確認してください。

### node_modulesの問題

コンテナとホストでnode_modulesが競合する場合：

```bash
# コンテナを停止してボリュームを削除
docker-compose down -v

# 再ビルド
docker-compose build --no-cache
docker-compose up -d
```