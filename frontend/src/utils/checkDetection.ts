import type { BoardCell, Position, Player, Piece } from '../types/shogi'
import { isValidMove, getPossibleMoves } from './moveValidation'
import { canDropPiece } from './capturedPieces'

export interface AttackingPiece {
  piece: Piece
  position: Position
}

/**
 * 王の位置を見つける
 */
export function findKingPosition(board: BoardCell[][], player: Player): Position | null {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = board[row][col].piece
      if (piece && piece.type === 'king' && piece.player === player) {
        return { row, col }
      }
    }
  }
  return null
}

/**
 * 指定されたプレイヤーの王が王手されているかチェック
 */
export function isKingInCheck(board: BoardCell[][], player: Player): boolean {
  const kingPosition = findKingPosition(board, player)
  if (!kingPosition) return false

  const opponent = player === 'sente' ? 'gote' : 'sente'

  // 全ての敵駒をチェック
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = board[row][col].piece
      if (piece && piece.player === opponent) {
        const from = { row, col }
        // その駒が王の位置に移動できるかチェック（自己王手チェックは無効化）
        if (isValidMove(board, from, kingPosition, false)) {
          return true
        }
      }
    }
  }

  return false
}

/**
 * 王を攻撃している駒のリストを取得
 */
export function getAttackingPieces(board: BoardCell[][], player: Player): AttackingPiece[] {
  const kingPosition = findKingPosition(board, player)
  if (!kingPosition) return []

  const attackers: AttackingPiece[] = []
  const opponent = player === 'sente' ? 'gote' : 'sente'

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = board[row][col].piece
      if (piece && piece.player === opponent) {
        const from = { row, col }
        if (isValidMove(board, from, kingPosition, false)) {
          attackers.push({ piece, position: from })
        }
      }
    }
  }

  return attackers
}

/**
 * 指定された移動を行った後、自分の王が王手になるかチェック
 */
export function wouldBeInCheckAfterMove(
  board: BoardCell[][],
  from: Position,
  to: Position,
  player: Player
): boolean {
  // ボードのコピーを作成
  const tempBoard = board.map(row => 
    row.map(cell => ({
      ...cell,
      piece: cell.piece ? { ...cell.piece } : null
    }))
  )

  // 仮想的に移動を実行
  const movingPiece = tempBoard[from.row][from.col].piece
  if (!movingPiece) return false

  tempBoard[to.row][to.col].piece = movingPiece
  tempBoard[from.row][from.col].piece = null

  // 移動後の盤面で王手チェック
  return isKingInCheck(tempBoard, player)
}

/**
 * 指定された駒打ちを行った後、自分の王が王手になるかチェック
 */
export function wouldBeInCheckAfterDrop(
  board: BoardCell[][],
  piece: Piece,
  position: Position,
  player: Player
): boolean {
  // ボードのコピーを作成
  const tempBoard = board.map(row => 
    row.map(cell => ({
      ...cell,
      piece: cell.piece ? { ...cell.piece } : null
    }))
  )

  // 仮想的に駒打ちを実行
  tempBoard[position.row][position.col].piece = piece

  // 駒打ち後の盤面で王手チェック
  return isKingInCheck(tempBoard, player)
}

/**
 * 詰みかどうかを判定
 */
export function isCheckmate(board: BoardCell[][], player: Player): boolean {
  // まず王手されているかチェック
  if (!isKingInCheck(board, player)) {
    return false
  }

  // 王の位置を取得
  const kingPosition = findKingPosition(board, player)
  if (!kingPosition) return false

  // 1. 王が逃げられるかチェック
  const kingPiece = board[kingPosition.row][kingPosition.col].piece!
  const kingMoves = getPossibleMoves(board, kingPosition, kingPiece)
  
  for (const move of kingMoves) {
    if (!wouldBeInCheckAfterMove(board, kingPosition, move, player)) {
      return false // 逃げられる場所がある
    }
  }

  // 2. 王手をかけている駒を取れるかチェック
  const attackers = getAttackingPieces(board, player)
  
  // 複数の駒から王手されている場合は取れない（両王手）
  if (attackers.length > 1) {
    return true
  }

  const attacker = attackers[0]
  
  // 自分の駒で攻撃者を取れるかチェック
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = board[row][col].piece
      if (piece && piece.player === player) {
        const from = { row, col }
        if (isValidMove(board, from, attacker.position, false)) {
          // その移動で自分が王手になるか確認
          if (!wouldBeInCheckAfterMove(board, from, attacker.position, player)) {
            return false // 攻撃者を取れる
          }
        }
      }
    }
  }

  // 3. 王手を防げるかチェック（飛び道具の場合のみ）
  const canBlock = canBlockCheck(board, player, kingPosition, attacker)
  if (canBlock) {
    return false
  }

  // どの方法でも王手を解除できない場合は詰み
  return true
}

/**
 * 王手を合駒で防げるかチェック
 */
function canBlockCheck(
  board: BoardCell[][],
  player: Player,
  kingPosition: Position,
  attacker: AttackingPiece
): boolean {
  // 攻撃者が飛び道具（飛車、角、香車）でない場合は合駒できない
  const blockablePieces = ['rook', 'bishop', 'lance']
  if (!blockablePieces.includes(attacker.piece.type)) {
    return false
  }

  // 王と攻撃者の間のマスを取得
  const pathPositions = getPathBetween(attacker.position, kingPosition)
  
  // 各マスに自分の駒を移動または打つことができるかチェック
  for (const blockPosition of pathPositions) {
    // 駒の移動で防げるか
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const piece = board[row][col].piece
        if (piece && piece.player === player && piece.type !== 'king') {
          const from = { row, col }
          if (isValidMove(board, from, blockPosition, false)) {
            if (!wouldBeInCheckAfterMove(board, from, blockPosition, player)) {
              return true
            }
          }
        }
      }
    }
  }

  return false
}

/**
 * 2つの位置の間のマスを取得（直線移動のみ）
 */
function getPathBetween(from: Position, to: Position): Position[] {
  const positions: Position[] = []
  const rowDiff = to.row - from.row
  const colDiff = to.col - from.col

  // 直線でない場合は空配列を返す
  if (rowDiff !== 0 && colDiff !== 0 && Math.abs(rowDiff) !== Math.abs(colDiff)) {
    return positions
  }

  const rowStep = rowDiff === 0 ? 0 : rowDiff > 0 ? 1 : -1
  const colStep = colDiff === 0 ? 0 : colDiff > 0 ? 1 : -1

  let currentRow = from.row + rowStep
  let currentCol = from.col + colStep

  while (currentRow !== to.row || currentCol !== to.col) {
    positions.push({ row: currentRow, col: currentCol })
    currentRow += rowStep
    currentCol += colStep
  }

  return positions
}

/**
 * 王手をかける手かどうかチェック
 */
export function isCheckingMove(
  board: BoardCell[][],
  from: Position,
  to: Position
): boolean {
  // ボードのコピーを作成
  const tempBoard = board.map(row => 
    row.map(cell => ({
      ...cell,
      piece: cell.piece ? { ...cell.piece } : null
    }))
  )

  // 仮想的に移動を実行
  const movingPiece = tempBoard[from.row][from.col].piece
  if (!movingPiece) return false

  tempBoard[to.row][to.col].piece = movingPiece
  tempBoard[from.row][from.col].piece = null

  // 相手のプレイヤーを取得
  const opponent = movingPiece.player === 'sente' ? 'gote' : 'sente'

  // 移動後の盤面で相手が王手になるかチェック
  return isKingInCheck(tempBoard, opponent)
}