import { describe, it, expect } from 'vitest'
import { isValidMove, getPossibleMoves } from '../moveValidation'
import { initializeGameBoard } from '../initialBoard'
import type { Position, Piece } from '../../types/shogi'

describe('moveValidation', () => {
  describe('isValidMove', () => {
    it('allows valid pawn moves', () => {
      const board = initializeGameBoard()
      const from: Position = { row: 6, col: 4 } // 先手の歩兵
      const to: Position = { row: 5, col: 4 } // 1マス前

      const result = isValidMove(board, from, to)
      expect(result).toBe(true)
    })

    it('prevents invalid pawn moves', () => {
      const board = initializeGameBoard()
      const from: Position = { row: 6, col: 4 } // 先手の歩兵
      const to: Position = { row: 4, col: 4 } // 2マス前（無効）

      const result = isValidMove(board, from, to)
      expect(result).toBe(false)
    })

    it('prevents moving to occupied squares with own pieces', () => {
      const board = initializeGameBoard()
      const from: Position = { row: 8, col: 4 } // 先手の王
      const to: Position = { row: 7, col: 4 } // 先手の飛車がいる位置

      const result = isValidMove(board, from, to)
      expect(result).toBe(false)
    })

    it('allows capturing opponent pieces', () => {
      const board = initializeGameBoard()
      // 先手の歩兵を敵陣に移動させる（テスト用）
      const piece = board[6][4].piece
      board[6][4].piece = null
      board[3][4].piece = piece

      const from: Position = { row: 3, col: 4 }
      const to: Position = { row: 2, col: 4 } // 後手の歩兵を取る

      const result = isValidMove(board, from, to)
      expect(result).toBe(true)
    })

    it('prevents moves outside the board', () => {
      const board = initializeGameBoard()
      const from: Position = { row: 0, col: 4 } // 後手の王
      const to: Position = { row: -1, col: 4 } // 盤外

      const result = isValidMove(board, from, to)
      expect(result).toBe(false)
    })
  })

  describe('getPossibleMoves', () => {
    it('returns correct moves for sente pawn', () => {
      const board = initializeGameBoard()
      const position: Position = { row: 6, col: 4 }
      const piece = board[position.row][position.col].piece!

      const moves = getPossibleMoves(board, position, piece)
      expect(moves).toHaveLength(1)
      expect(moves[0]).toEqual({ row: 5, col: 4 })
    })

    it('returns correct moves for gote pawn', () => {
      const board = initializeGameBoard()
      const position: Position = { row: 2, col: 4 }
      const piece = board[position.row][position.col].piece!

      const moves = getPossibleMoves(board, position, piece)
      expect(moves).toHaveLength(1)
      expect(moves[0]).toEqual({ row: 3, col: 4 })
    })

    it('returns empty array when path is blocked', () => {
      const board = initializeGameBoard()
      // 歩兵の前に駒を置く
      board[5][4].piece = board[6][5].piece
      board[6][5].piece = null

      const position: Position = { row: 6, col: 4 }
      const piece = board[position.row][position.col].piece!

      const moves = getPossibleMoves(board, position, piece)
      expect(moves).toHaveLength(0)
    })

    it('returns correct moves for king', () => {
      const board = initializeGameBoard()
      const position: Position = { row: 8, col: 4 } // 先手の王
      const piece = board[position.row][position.col].piece!

      const moves = getPossibleMoves(board, position, piece)
      // 王は8方向に1マスずつ移動可能だが、初期配置では上の1マスのみ
      expect(moves).toHaveLength(1)
      expect(moves[0]).toEqual({ row: 7, col: 4 })
    })
  })
})
