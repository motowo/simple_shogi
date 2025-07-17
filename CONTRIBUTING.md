# Contributing to Simple Shogi

## 開発環境のセットアップ

### 前提条件
- Docker Desktop
- Node.js 18+ (ローカル開発時)
- Git

### 環境構築手順

1. リポジトリをクローン
```bash
git clone https://github.com/motowo/simple_shogi.git
cd simple_shogi
```

2. Docker環境を起動
```bash
docker-compose up -d
```

3. ブラウザで http://localhost:8080 を開く

## 開発フロー

### ブランチ戦略
- `main`: 本番環境用（安定版）
- `develop`: 開発環境用
- `feature/*`: 機能開発用

### 新機能開発の手順

1. mainブランチから新しいブランチを作成
```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

2. Docker環境を起動
```bash
docker-compose up -d
```

3. TDD（テスト駆動開発）で実装
```bash
# テスト作成
# 実装
# テスト実行
docker-compose exec frontend npm run test
```

4. コード品質チェック
```bash
docker-compose exec frontend npm run lint
docker-compose exec frontend npm run format
docker-compose exec frontend npm run type-check
```

5. 全チェックが通ったらプッシュ
```bash
git push -u origin feature/your-feature-name
```

6. プルリクエストを作成

## コード規約

### TypeScript
- 厳密な型付けを行う
- `any`の使用は避ける
- インターフェースを活用する

### Vue.js
- Composition API を使用
- `<script setup>`構文を使用
- 単一ファイルコンポーネント(.vue)形式

### テスト
- 全ての機能にテストを作成
- TDD（テスト駆動開発）を採用
- Vitestを使用

### コミット
- 意味のある単位でコミット
- コミットメッセージは以下の形式:
  ```
  type: 簡潔な説明

  詳細な説明（必要に応じて）
  ```
- type: `feat`, `fix`, `docs`, `test`, `refactor`, `style`, `chore`

## プルリクエスト

### チェックリスト
- [ ] 機能が仕様通りに動作する
- [ ] テストが全て通る
- [ ] リンターエラーがない
- [ ] 型チェックが通る
- [ ] レスポンシブ対応されている
- [ ] アクセシビリティを考慮している

### レビュー観点
- コードの可読性
- パフォーマンス
- セキュリティ
- 将棋ルールの正確性

## トラブルシューティング

### よくある問題

1. **Docker環境でホットリロードが効かない**
   ```bash
   docker-compose down -v
   docker-compose build --no-cache
   docker-compose up -d
   ```

2. **テストが失敗する**
   ```bash
   docker-compose exec frontend npm run test -- --reporter=verbose
   ```

3. **型エラーが発生**
   ```bash
   docker-compose exec frontend npm run type-check
   ```

## 質問・要望

- Issues: 機能要望・バグ報告
- Discussions: 技術的な質問
- Email: プロジェクト管理者への直接連絡

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。