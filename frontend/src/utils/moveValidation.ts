import type { BoardCell, Position, Piece, PieceType } from '../types/shogi'
import { isValidPosition } from './boardUtils'
import { wouldBeInCheckAfterMove } from './checkDetection'

/**
 * 指定された移動が有効かどうかを検証する
 */
export function isValidMove(
  board: BoardCell[][],
  from: Position,
  to: Position,
  checkSelfCheck: boolean = true
): boolean {
  // 移動先が盤面内かチェック
  if (!isValidPosition(to)) {
    return false
  }

  // 移動元に駒があるかチェック
  const fromCell = board[from.row][from.col]
  if (!fromCell.piece) {
    return false
  }

  // 移動先のセルを取得
  const toCell = board[to.row][to.col]

  // 移動先に自分の駒がある場合は無効
  if (toCell.piece && toCell.piece.player === fromCell.piece.player) {
    return false
  }

  // 駒の種類に応じた移動ルールをチェック
  if (!isPieceMoveLegal(board, from, to, fromCell.piece)) {
    return false
  }

  // 自分が王手になる手は無効（循環参照を避けるためオプション）
  if (checkSelfCheck && wouldBeInCheckAfterMove(board, from, to, fromCell.piece.player)) {
    return false
  }

  return true
}

/**
 * 指定された駒が指定された位置に移動できるかチェック
 */
function isPieceMoveLegal(
  board: BoardCell[][],
  from: Position,
  to: Position,
  piece: Piece
): boolean {
  const rowDiff = to.row - from.row
  const colDiff = to.col - from.col
  const absRowDiff = Math.abs(rowDiff)
  const absColDiff = Math.abs(colDiff)

  // 成り駒の場合は特別な動きをチェック
  if (piece.isPromoted) {
    return isPromotedPieceMoveLegal(
      board,
      from,
      to,
      piece,
      rowDiff,
      colDiff,
      absRowDiff,
      absColDiff
    )
  }

  switch (piece.type) {
    case 'pawn':
      return isPawnMoveLegal(rowDiff, colDiff, piece.player)

    case 'king':
      return isKingMoveLegal(absRowDiff, absColDiff)

    case 'rook':
      return isRookMoveLegal(board, from, to, rowDiff, colDiff)

    case 'bishop':
      return isBishopMoveLegal(board, from, to, rowDiff, colDiff)

    case 'gold':
      return isGoldMoveLegal(rowDiff, colDiff, piece.player)

    case 'silver':
      return isSilverMoveLegal(rowDiff, colDiff, piece.player)

    case 'knight':
      return isKnightMoveLegal(rowDiff, colDiff, piece.player)

    case 'lance':
      return isLanceMoveLegal(board, from, to, rowDiff, colDiff, piece.player)

    default:
      return false
  }
}

/**
 * 成り駒の移動ルール
 */
function isPromotedPieceMoveLegal(
  board: BoardCell[][],
  from: Position,
  to: Position,
  piece: Piece,
  rowDiff: number,
  colDiff: number,
  absRowDiff: number,
  absColDiff: number
): boolean {
  switch (piece.type) {
    case 'pawn': // と金（成歩）
    case 'lance': // 成香
    case 'knight': // 成桂
    case 'silver': // 成銀
      // 金将と同じ動き
      return isGoldMoveLegal(rowDiff, colDiff, piece.player)

    case 'rook': // 竜王（成飛）
      // 飛車の動き + 王将の動き
      return (
        isRookMoveLegal(board, from, to, rowDiff, colDiff) ||
        isKingMoveLegal(absRowDiff, absColDiff)
      )

    case 'bishop': // 竜馬（成角）
      // 角行の動き + 王将の動き
      return (
        isBishopMoveLegal(board, from, to, rowDiff, colDiff) ||
        isKingMoveLegal(absRowDiff, absColDiff)
      )

    case 'gold': // 金将（成り不可）
    case 'king': // 王将（成り不可）
      // 金将と王将は成れないが、念のため元の動きを返す
      return piece.type === 'gold'
        ? isGoldMoveLegal(rowDiff, colDiff, piece.player)
        : isKingMoveLegal(absRowDiff, absColDiff)

    default:
      return false
  }
}

/**
 * 歩兵の移動ルール
 */
function isPawnMoveLegal(rowDiff: number, colDiff: number, player: 'sente' | 'gote'): boolean {
  const direction = player === 'sente' ? -1 : 1
  return rowDiff === direction && colDiff === 0
}

/**
 * 王の移動ルール
 */
function isKingMoveLegal(absRowDiff: number, absColDiff: number): boolean {
  return absRowDiff <= 1 && absColDiff <= 1 && (absRowDiff !== 0 || absColDiff !== 0)
}

/**
 * 飛車の移動ルール
 */
function isRookMoveLegal(
  board: BoardCell[][],
  from: Position,
  to: Position,
  rowDiff: number,
  colDiff: number
): boolean {
  // 縦横移動のみ
  if (rowDiff !== 0 && colDiff !== 0) {
    return false
  }

  // 経路に障害物がないかチェック
  return isPathClear(board, from, to)
}

/**
 * 角の移動ルール
 */
function isBishopMoveLegal(
  board: BoardCell[][],
  from: Position,
  to: Position,
  rowDiff: number,
  colDiff: number
): boolean {
  // 斜め移動のみ
  if (Math.abs(rowDiff) !== Math.abs(colDiff)) {
    return false
  }

  // 経路に障害物がないかチェック
  return isPathClear(board, from, to)
}

/**
 * 金の移動ルール
 */
function isGoldMoveLegal(rowDiff: number, colDiff: number, player: 'sente' | 'gote'): boolean {
  const direction = player === 'sente' ? -1 : 1
  const absRowDiff = Math.abs(rowDiff)
  const absColDiff = Math.abs(colDiff)

  // 前・左・右・後ろ・左前・右前
  if (absRowDiff <= 1 && absColDiff <= 1) {
    // 左後ろ・右後ろは移動不可
    if (rowDiff === -direction && absColDiff === 1) {
      return false
    }
    return true
  }

  return false
}

/**
 * 銀の移動ルール
 */
function isSilverMoveLegal(rowDiff: number, colDiff: number, player: 'sente' | 'gote'): boolean {
  const direction = player === 'sente' ? -1 : 1
  const absRowDiff = Math.abs(rowDiff)
  const absColDiff = Math.abs(colDiff)

  // 前・左前・右前・左後ろ・右後ろ
  if (absRowDiff <= 1 && absColDiff <= 1) {
    // 左・右・後ろは移動不可
    if (rowDiff === 0 || (rowDiff === -direction && colDiff === 0)) {
      return false
    }
    return true
  }

  return false
}

/**
 * 桂馬の移動ルール
 */
function isKnightMoveLegal(rowDiff: number, colDiff: number, player: 'sente' | 'gote'): boolean {
  const direction = player === 'sente' ? -2 : 2
  return rowDiff === direction && Math.abs(colDiff) === 1
}

/**
 * 香車の移動ルール
 */
function isLanceMoveLegal(
  board: BoardCell[][],
  from: Position,
  to: Position,
  rowDiff: number,
  colDiff: number,
  player: 'sente' | 'gote'
): boolean {
  const direction = player === 'sente' ? -1 : 1

  // 前方向のみ
  if (colDiff !== 0 || rowDiff * direction <= 0) {
    return false
  }

  // 経路に障害物がないかチェック
  return isPathClear(board, from, to)
}

/**
 * 移動経路に障害物がないかチェック
 */
function isPathClear(board: BoardCell[][], from: Position, to: Position): boolean {
  const rowDiff = to.row - from.row
  const colDiff = to.col - from.col
  const rowStep = rowDiff === 0 ? 0 : rowDiff > 0 ? 1 : -1
  const colStep = colDiff === 0 ? 0 : colDiff > 0 ? 1 : -1

  let currentRow = from.row + rowStep
  let currentCol = from.col + colStep

  while (currentRow !== to.row || currentCol !== to.col) {
    if (board[currentRow][currentCol].piece) {
      return false
    }
    currentRow += rowStep
    currentCol += colStep
  }

  return true
}

/**
 * 指定された位置の駒が移動可能な全ての位置を取得
 */
export function getPossibleMoves(
  board: BoardCell[][],
  position: Position,
  piece: Piece
): Position[] {
  const moves: Position[] = []

  // 全ての盤面の位置をチェック
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const targetPosition = { row, col }

      // 同じ位置は除外
      if (row === position.row && col === position.col) {
        continue
      }

      // 移動が有効かチェック
      if (isValidMove(board, position, targetPosition)) {
        moves.push(targetPosition)
      }
    }
  }

  return moves
}
