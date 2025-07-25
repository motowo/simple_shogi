# シンプル将棋

ブラウザ上で人間同士が将棋を指すことができるシンプルなWebアプリケーション

## 概要

- **目的**: ブラウザ上で人間同士が将棋を指すことができるシンプルなアプリケーションの提供
- **対象ユーザー**: 将棋をオンラインで指したいPCユーザー
- **技術スタック**: Vue.js + TypeScript
- **インフラ**: Docker + Docker Compose
- **デプロイ**: 静的ファイルとしてGitHub Pages対応

## 主要機能

### 対局機能
- 人間 vs 人間（1対1）
- 日本将棋連盟が定める一般的な将棋のルールに準拠
- 先手・後手の交互手番制御
- 持ち駒管理（駒の取得・持ち駒の使用）
- 駒の種類ごとの正しい動き
- 成り/不成りの選択
- 王手・詰み判定
- 投了機能
- ゲームリセット機能

### UI機能
- 9×9マスの将棋盤表示
- 駒画像表示（成・不成あり）
- クリックによる選択＋移動操作
- プレイヤー表示（Player 1 / Player 2）
- 手数表示（任意）

## 開発計画

### フェーズ1: 基盤構築
- [x] Docker/Docker Compose環境構築
- [x] Vue.js + TypeScript プロジェクトセットアップ
- [x] 将棋盤UI作成（9×9マス）
- [x] 駒の初期配置
- [x] 基本的なクリック操作

### フェーズ2: 駒システム実装
- [x] 駒の基本移動ロジック
- [x] 駒の種類別移動ルール
- [x] 持ち駒システム
- [x] 成り機能

### フェーズ3: ゲームロジック実装
- [x] 手番制御システム
- [x] 王手判定
- [x] 詰み判定
- [ ] 千日手判定（任意）

### フェーズ4: UI/UX完成
- [x] 投了機能
- [x] リセット機能
- [x] 操作性改善
- [x] スタイリング

## 技術要件

| 項目 | 内容 |
|------|------|
| フロントエンド | Vue.js + TypeScript |
| バックエンド | なし（クライアント側で状態管理） |
| データベース | 不要 |
| インフラ | Docker + Docker Compose |
| デプロイ | 静的ファイルとしてGitHub Pages等 |
| 対象ブラウザ | Chrome, Edge, Firefox（最新版） |

## アーキテクチャ

### Docker構成

現在はフロントエンドのみの構成ですが、将来の拡張性を考慮してDocker Composeを採用しています。

```yaml
services:
  frontend:
    - Vue.js + TypeScript
    - Nginx（プロダクション）
    - ポート: 8080
  
  # 将来の拡張用
  backend:  # APIサーバー（将来実装）
  database: # データベース（将来実装）
```

### ディレクトリ構成

```
simple_shogi/
├── docker-compose.yml
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── src/
│   └── tests/
└── docs/
```

## クイックスタート

```bash
# リポジトリをクローン
git clone <repository-url>
cd simple_shogi

# Docker環境を起動
docker-compose up -d

# ブラウザで http://localhost:8080 を開く
```

## 開発環境

### Dockerコマンド
- `docker-compose up -d`: 開発環境起動
- `docker-compose down`: 開発環境停止
- `docker-compose build`: イメージのビルド
- `docker-compose logs -f`: ログの確認
- `docker-compose exec frontend sh`: コンテナ内へのアクセス

### 開発コマンド（コンテナ内）
- `npm run dev`: 開発サーバー起動
- `npm run build`: プロダクションビルド
- `npm run test`: テスト実行
- `npm run lint`: ESLintでコード品質チェック
- `npm run format`: Prettierでコード整形

### 開発フロー
1. mainブランチから新しいブランチを作成
2. `docker-compose up -d`で開発環境を起動
3. TDD（テスト駆動開発）でタスクを実装
4. テスト実行・コード品質チェック
5. プルリクエスト作成

## 実装完了機能

### ゲーム機能
- ✅ 9×9将棋盤の表示
- ✅ 駒の初期配置（標準的な将棋配置）
- ✅ 全9種類の駒の移動ルール
- ✅ 持ち駒システム（駒の取得・駒打ち）
- ✅ 成り機能（成り駒圏内での成り判定）
- ✅ 王手・詰み判定
- ✅ 手番制御システム

### UI/UX機能
- ✅ 直感的なクリック操作
- ✅ 可能な手のハイライト表示
- ✅ 王手・詰み状態の視覚的表示
- ✅ 投了機能（確認ダイアログ付き）
- ✅ ゲームリセット機能
- ✅ 手数表示（棋譜）
- ✅ レスポンシブデザイン
- ✅ ダークモード対応
- ✅ キーボードショートカット

### 完了の定義

- ✅ ブラウザで盤面が表示され、駒がルール通りに動く
- ✅ プレイヤーが交互に操作可能
- ✅ 成り・投了・詰み判定が正しく処理される
- ✅ リセットでゲームを再スタートできる
- ✅ 主要ブラウザで動作確認済み