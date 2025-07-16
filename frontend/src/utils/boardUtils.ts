import type { Position, BoardCell } from '../types/shogi'

/**
 * 9x9の空の将棋盤を初期化する
 */
export function initializeEmptyBoard(): BoardCell[][] {
  const board: BoardCell[][] = []
  
  for (let row = 0; row < 9; row++) {
    const rowCells: BoardCell[] = []
    for (let col = 0; col < 9; col++) {
      rowCells.push({
        position: { row, col },
        piece: null,
        isHighlighted: false,
        isSelected: false
      })
    }
    board.push(rowCells)
  }
  
  return board
}

/**
 * 位置が盤面内にあるかチェックする
 */
export function isValidPosition(position: Position): boolean {
  return position.row >= 0 && position.row < 9 && 
         position.col >= 0 && position.col < 9
}

/**
 * 2つの位置が同じかチェックする
 */
export function isSamePosition(pos1: Position, pos2: Position): boolean {
  return pos1.row === pos2.row && pos1.col === pos2.col
}

/**
 * 将棋の座標表記（例：5五）を Position に変換する
 */
export function parseKifuPosition(kifuPos: string): Position | null {
  if (kifuPos.length !== 2) return null
  
  const colChar = kifuPos[0]
  const rowChar = kifuPos[1]
  
  // 列: '１'-'９' または '1'-'9'
  const colMap: { [key: string]: number } = {
    '１': 0, '２': 1, '３': 2, '４': 3, '５': 4, '６': 5, '７': 6, '８': 7, '９': 8,
    '1': 8, '2': 7, '3': 6, '4': 5, '5': 4, '6': 3, '7': 2, '8': 1, '9': 0
  }
  
  // 行: '一'-'九'
  const rowMap: { [key: string]: number } = {
    '一': 0, '二': 1, '三': 2, '四': 3, '五': 4, '六': 5, '七': 6, '八': 7, '九': 8
  }
  
  const col = colMap[colChar]
  const row = rowMap[rowChar]
  
  if (col === undefined || row === undefined) return null
  
  return { row, col }
}

/**
 * Position を将棋の座標表記に変換する
 */
export function formatKifuPosition(position: Position): string {
  const colLabels = ['９', '８', '７', '６', '５', '４', '３', '２', '１']
  const rowLabels = ['一', '二', '三', '四', '五', '六', '七', '八', '九']
  
  if (!isValidPosition(position)) return ''
  
  return colLabels[position.col] + rowLabels[position.row]
}