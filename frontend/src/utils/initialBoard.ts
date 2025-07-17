import type { BoardCell, Piece, PieceType, Player } from '../types/shogi'
import { initializeEmptyBoard } from './boardUtils'

/**
 * 駒を作成するヘルパー関数
 */
function createPiece(type: PieceType, player: Player): Piece {
  return {
    type,
    player,
    isPromoted: false
  }
}

/**
 * 将棋の初期配置で盤面を初期化する
 */
export function initializeGameBoard(): BoardCell[][] {
  const board = initializeEmptyBoard()

  // 後手（上側）の駒配置
  // 一段目：香桂銀金王金銀桂香
  const goteBackRow: PieceType[] = [
    'lance',
    'knight',
    'silver',
    'gold',
    'king',
    'gold',
    'silver',
    'knight',
    'lance'
  ]
  goteBackRow.forEach((pieceType, col) => {
    board[0][col].piece = createPiece(pieceType, 'gote')
  })

  // 二段目：飛車と角
  board[1][7].piece = createPiece('bishop', 'gote') // 角
  board[1][1].piece = createPiece('rook', 'gote') // 飛車

  // 三段目：歩兵
  for (let col = 0; col < 9; col++) {
    board[2][col].piece = createPiece('pawn', 'gote')
  }

  // 先手（下側）の駒配置
  // 七段目：歩兵
  for (let col = 0; col < 9; col++) {
    board[6][col].piece = createPiece('pawn', 'sente')
  }

  // 八段目：飛車と角
  board[7][1].piece = createPiece('bishop', 'sente') // 角
  board[7][7].piece = createPiece('rook', 'sente') // 飛車

  // 九段目：香桂銀金王金銀桂香
  const senteBackRow: PieceType[] = [
    'lance',
    'knight',
    'silver',
    'gold',
    'king',
    'gold',
    'silver',
    'knight',
    'lance'
  ]
  senteBackRow.forEach((pieceType, col) => {
    board[8][col].piece = createPiece(pieceType, 'sente')
  })

  return board
}

/**
 * 駒の日本語表記を取得する
 */
export function getPieceDisplayName(piece: Piece): string {
  const pieceNames: Record<PieceType, string> = {
    king: '王',
    rook: '飛',
    bishop: '角',
    gold: '金',
    silver: '銀',
    knight: '桂',
    lance: '香',
    pawn: '歩'
  }

  // 成り駒の場合
  if (piece.isPromoted) {
    const promotedNames: Record<PieceType, string> = {
      king: '王', // 王は成らない
      rook: '竜', // 竜王
      bishop: '馬', // 竜馬
      gold: '金', // 金は成らない
      silver: '成銀',
      knight: '成桂',
      lance: '成香',
      pawn: 'と' // と金
    }
    return promotedNames[piece.type]
  }

  return pieceNames[piece.type]
}

/**
 * 駒の種類のみから日本語表記を取得する
 */
export function getPieceTypeDisplayName(pieceType: PieceType): string {
  const pieceNames: Record<PieceType, string> = {
    king: '王',
    rook: '飛',
    bishop: '角',
    gold: '金',
    silver: '銀',
    knight: '桂',
    lance: '香',
    pawn: '歩'
  }

  return pieceNames[pieceType]
}

/**
 * 駒が成ることができるかチェックする
 */
export function canPromote(piece: Piece): boolean {
  // 王と金は成ることができない
  return piece.type !== 'king' && piece.type !== 'gold' && !piece.isPromoted
}
