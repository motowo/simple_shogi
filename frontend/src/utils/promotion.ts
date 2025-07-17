import type { Piece, Position, Player, PieceType } from '../types/shogi'

/**
 * 指定した位置が成り駒圏内かどうかを判定
 */
export function isInPromotionZone(player: Player, position: Position): boolean {
  if (player === 'sente') {
    // 先手の成り駒圏は上から3段（0-2行目）
    return position.row >= 0 && position.row <= 2
  } else {
    // 後手の成り駒圏は下から3段（6-8行目）
    return position.row >= 6 && position.row <= 8
  }
}

/**
 * 指定した移動で成ることができるかを判定
 */
export function canPromoteAt(piece: Piece, from: Position, to: Position): boolean {
  // 王と金は成れない
  if (piece.type === 'king' || piece.type === 'gold') {
    return false
  }

  // 既に成り駒の場合は成れない
  if (piece.isPromoted) {
    return false
  }

  // 移動前か移動後のどちらかが成り駒圏内である必要がある
  const fromInZone = isInPromotionZone(piece.player, from)
  const toInZone = isInPromotionZone(piece.player, to)

  return fromInZone || toInZone
}

/**
 * 指定した位置で成らなければいけないかを判定（行き場のない駒）
 */
export function mustPromoteAt(piece: Piece, to: Position): boolean {
  // 王と金は成れない
  if (piece.type === 'king' || piece.type === 'gold') {
    return false
  }

  // 既に成り駒の場合は成る必要がない
  if (piece.isPromoted) {
    return false
  }

  const endRow = piece.player === 'sente' ? 0 : 8
  const secondEndRow = piece.player === 'sente' ? 1 : 7

  switch (piece.type) {
    case 'pawn':
    case 'lance':
      // 歩兵と香車は最前線で成る必要がある
      return to.row === endRow

    case 'knight':
      // 桂馬は最前線2行で成る必要がある
      return to.row === endRow || to.row === secondEndRow

    default:
      // その他の駒は成る必要がない
      return false
  }
}

/**
 * 駒を成り駒に変換
 */
export function promoteMovePiece(piece: Piece): Piece {
  return {
    ...piece,
    isPromoted: true
  }
}

/**
 * 成り駒を元の駒に戻す（持ち駒化時）
 */
export function demotePiece(piece: Piece): Piece {
  return {
    ...piece,
    isPromoted: false
  }
}

/**
 * 成り駒が可能な駒かどうかを判定
 */
export function canPiecePromote(pieceType: PieceType): boolean {
  return pieceType !== 'king' && pieceType !== 'gold'
}

/**
 * 成り駒かどうかでソート（成り駒を後に）
 */
export function sortByPromotionStatus(pieces: Piece[]): Piece[] {
  return pieces.sort((a, b) => {
    if (a.isPromoted === b.isPromoted) return 0
    return a.isPromoted ? 1 : -1
  })
}

/**
 * 成り駒の移動時の表示名を取得
 */
export function getPromotedPieceName(piece: Piece): string {
  if (!piece.isPromoted) {
    return getPieceBaseName(piece.type)
  }

  const promotedNames: Record<PieceType, string> = {
    king: '王',     // 王は成らない
    rook: '竜',     // 竜王
    bishop: '馬',   // 竜馬
    gold: '金',     // 金は成らない
    silver: '成銀',
    knight: '成桂',
    lance: '成香',
    pawn: 'と'      // と金
  }

  return promotedNames[piece.type]
}

/**
 * 駒の基本名を取得
 */
function getPieceBaseName(pieceType: PieceType): string {
  const baseNames: Record<PieceType, string> = {
    king: '王',
    rook: '飛',
    bishop: '角',
    gold: '金',
    silver: '銀',
    knight: '桂',
    lance: '香',
    pawn: '歩'
  }

  return baseNames[pieceType]
}

/**
 * 駒の移動で成りを判定し、必要に応じて成り駒に変換
 */
export function handlePromotion(
  piece: Piece,
  from: Position,
  to: Position,
  forcePromote?: boolean
): { piece: Piece; mustPromote: boolean; canPromote: boolean } {
  const mustPromote = mustPromoteAt(piece, to)
  const canPromote = canPromoteAt(piece, from, to)

  if (mustPromote || forcePromote) {
    return {
      piece: promoteMovePiece(piece),
      mustPromote,
      canPromote
    }
  }

  return {
    piece,
    mustPromote,
    canPromote
  }
}