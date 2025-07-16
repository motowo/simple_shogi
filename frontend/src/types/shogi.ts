// 将棋盤の位置を表す型
export interface Position {
  row: number // 0-8 (一-九)
  col: number // 0-8 (9-1)
}

// 将棋盤のマスの状態
export interface BoardCell {
  position: Position
  piece: Piece | null
  isHighlighted?: boolean
  isSelected?: boolean
}

// 駒の種類
export type PieceType = 
  | 'king'     // 王/玉
  | 'rook'     // 飛車
  | 'bishop'   // 角行
  | 'gold'     // 金将
  | 'silver'   // 銀将
  | 'knight'   // 桂馬
  | 'lance'    // 香車
  | 'pawn'     // 歩兵

// プレイヤー
export type Player = 'sente' | 'gote' // 先手・後手

// 駒の情報
export interface Piece {
  type: PieceType
  player: Player
  isPromoted?: boolean // 成り駒かどうか
}

// 将棋盤の状態
export interface BoardState {
  cells: BoardCell[][]
  currentPlayer: Player
  selectedPosition: Position | null
}

// 日本語の行ラベル
export const ROW_LABELS = ['一', '二', '三', '四', '五', '六', '七', '八', '九']

// 列ラベル
export const COL_LABELS = ['9', '8', '7', '6', '5', '4', '3', '2', '1']