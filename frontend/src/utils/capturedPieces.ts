import type { BoardCell, Piece, Player, Position, PieceType } from '../types/shogi'

export interface DroppablePiece {
  type: PieceType
  count: number
}

/**
 * 持ち駒を追加する
 */
export function addCapturedPiece(
  capturedPieces: Map<Player, Piece[]>,
  player: Player,
  capturedPiece: Piece
): void {
  if (!capturedPieces.has(player)) {
    capturedPieces.set(player, [])
  }

  // 取った駒は自分の駒として、成りを解除して追加
  const normalizedPiece: Piece = {
    type: capturedPiece.type,
    player: player,
    isPromoted: false
  }

  capturedPieces.get(player)!.push(normalizedPiece)
}

/**
 * 持ち駒から駒を取り除く（駒打ち時）
 */
export function removeCapturedPiece(
  capturedPieces: Map<Player, Piece[]>,
  player: Player,
  pieceType: PieceType
): boolean {
  const pieces = capturedPieces.get(player)
  if (!pieces) return false

  const index = pieces.findIndex((piece) => piece.type === pieceType)
  if (index === -1) return false

  pieces.splice(index, 1)
  return true
}

/**
 * 指定プレイヤーの持ち駒を取得
 */
export function getCapturedPieces(capturedPieces: Map<Player, Piece[]>, player: Player): Piece[] {
  return capturedPieces.get(player) || []
}

/**
 * 指定の位置に駒を打つことができるかチェック
 */
export function canDropPiece(
  board: BoardCell[][],
  capturedPieces: Map<Player, Piece[]>,
  player: Player,
  pieceType: PieceType,
  position: Position
): boolean {
  // 盤面範囲内かチェック
  if (position.row < 0 || position.row >= 9 || position.col < 0 || position.col >= 9) {
    return false
  }

  // 駒がすでに存在するかチェック
  if (board[position.row][position.col].piece) {
    return false
  }

  // 持ち駒にその駒があるかチェック
  const pieces = getCapturedPieces(capturedPieces, player)
  const hasPiece = pieces.some((piece) => piece.type === pieceType)
  if (!hasPiece) {
    return false
  }

  // 駒種別の特殊ルール
  switch (pieceType) {
    case 'pawn':
      return canDropPawn(board, player, position)
    case 'lance':
      return canDropLance(player, position)
    case 'knight':
      return canDropKnight(player, position)
    default:
      return true
  }
}

/**
 * 歩兵を打つことができるかチェック
 */
function canDropPawn(board: BoardCell[][], player: Player, position: Position): boolean {
  // 同じ列に同じプレイヤーの歩兵が存在するかチェック
  for (let row = 0; row < 9; row++) {
    const piece = board[row][position.col].piece
    if (piece && piece.type === 'pawn' && piece.player === player && !piece.isPromoted) {
      return false
    }
  }

  // 行き所のない駒のチェック（最前線に打てない）
  const frontRow = player === 'sente' ? 0 : 8
  if (position.row === frontRow) {
    return false
  }

  return true
}

/**
 * 香車を打つことができるかチェック
 */
function canDropLance(player: Player, position: Position): boolean {
  // 行き所のない駒のチェック（最前線に打てない）
  const frontRow = player === 'sente' ? 0 : 8
  return position.row !== frontRow
}

/**
 * 桂馬を打つことができるかチェック
 */
function canDropKnight(player: Player, position: Position): boolean {
  // 行き所のない駒のチェック（最前線2行に打てない）
  const frontRows = player === 'sente' ? [0, 1] : [7, 8]
  return !frontRows.includes(position.row)
}

/**
 * 打つことができる駒の一覧を取得
 */
export function getDroppablePieces(
  capturedPieces: Map<Player, Piece[]>,
  player: Player
): DroppablePiece[] {
  const pieces = getCapturedPieces(capturedPieces, player)
  const countMap = new Map<PieceType, number>()

  // 駒種別の個数をカウント
  pieces.forEach((piece) => {
    const current = countMap.get(piece.type) || 0
    countMap.set(piece.type, current + 1)
  })

  // DroppablePiece配列に変換
  return Array.from(countMap.entries()).map(([type, count]) => ({
    type,
    count
  }))
}

/**
 * 持ち駒の配列を種類別にソート
 */
export function sortCapturedPieces(pieces: Piece[]): Piece[] {
  const order: PieceType[] = ['rook', 'bishop', 'gold', 'silver', 'knight', 'lance', 'pawn']

  return pieces.sort((a, b) => {
    const aIndex = order.indexOf(a.type)
    const bIndex = order.indexOf(b.type)
    return aIndex - bIndex
  })
}

/**
 * 持ち駒の表示用文字列を生成
 */
export function formatCapturedPieces(pieces: DroppablePiece[]): string {
  if (pieces.length === 0) return 'なし'

  return pieces
    .map((piece) => {
      const names: Record<PieceType, string> = {
        king: '王',
        rook: '飛',
        bishop: '角',
        gold: '金',
        silver: '銀',
        knight: '桂',
        lance: '香',
        pawn: '歩'
      }

      const name = names[piece.type]
      return piece.count > 1 ? `${name}${piece.count}` : name
    })
    .join(' ')
}
