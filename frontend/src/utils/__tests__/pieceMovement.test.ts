import { describe, it, expect } from 'vitest'
import { getPossibleMoves, isValidMove } from '../moveValidation'
import { initializeEmptyBoard } from '../boardUtils'
import type { Position, Piece } from '../../types/shogi'

describe('pieceMovement', () => {
  describe('King movement', () => {
    it('allows movement in all 8 directions by 1 square', () => {
      const board = initializeEmptyBoard()
      const king: Piece = { type: 'king', player: 'sente', isPromoted: false }
      const position: Position = { row: 4, col: 4 }
      board[4][4].piece = king

      const moves = getPossibleMoves(board, position, king)
      expect(moves).toHaveLength(8)
      
      // 8方向の移動を確認
      const expectedMoves = [
        { row: 3, col: 3 }, { row: 3, col: 4 }, { row: 3, col: 5 },
        { row: 4, col: 3 },                     { row: 4, col: 5 },
        { row: 5, col: 3 }, { row: 5, col: 4 }, { row: 5, col: 5 }
      ]
      
      expectedMoves.forEach(expectedMove => {
        expect(moves).toContainEqual(expectedMove)
      })
    })
  })

  describe('Rook movement', () => {
    it('allows movement in straight lines', () => {
      const board = initializeEmptyBoard()
      const rook: Piece = { type: 'rook', player: 'sente', isPromoted: false }
      const position: Position = { row: 4, col: 4 }
      board[4][4].piece = rook

      const moves = getPossibleMoves(board, position, rook)
      
      // 縦横の移動が可能
      expect(moves.length).toBeGreaterThan(10)
      
      // 縦の移動を確認
      expect(moves).toContainEqual({ row: 0, col: 4 })
      expect(moves).toContainEqual({ row: 8, col: 4 })
      
      // 横の移動を確認
      expect(moves).toContainEqual({ row: 4, col: 0 })
      expect(moves).toContainEqual({ row: 4, col: 8 })
    })

    it('is blocked by other pieces', () => {
      const board = initializeEmptyBoard()
      const rook: Piece = { type: 'rook', player: 'sente', isPromoted: false }
      const blocker: Piece = { type: 'pawn', player: 'gote', isPromoted: false }
      
      board[4][4].piece = rook
      board[4][6].piece = blocker // 右方向に障害物
      
      const moves = getPossibleMoves(board, { row: 4, col: 4 }, rook)
      
      // 障害物の位置は移動可能（駒を取れる）
      expect(moves).toContainEqual({ row: 4, col: 6 })
      
      // 障害物より先は移動不可
      expect(moves).not.toContainEqual({ row: 4, col: 7 })
      expect(moves).not.toContainEqual({ row: 4, col: 8 })
    })
  })

  describe('Bishop movement', () => {
    it('allows movement in diagonal lines', () => {
      const board = initializeEmptyBoard()
      const bishop: Piece = { type: 'bishop', player: 'sente', isPromoted: false }
      const position: Position = { row: 4, col: 4 }
      board[4][4].piece = bishop

      const moves = getPossibleMoves(board, position, bishop)
      
      // 斜めの移動を確認
      expect(moves).toContainEqual({ row: 0, col: 0 })
      expect(moves).toContainEqual({ row: 0, col: 8 })
      expect(moves).toContainEqual({ row: 8, col: 0 })
      expect(moves).toContainEqual({ row: 8, col: 8 })
    })
  })

  describe('Gold movement', () => {
    it('allows movement in 6 directions', () => {
      const board = initializeEmptyBoard()
      const gold: Piece = { type: 'gold', player: 'sente', isPromoted: false }
      const position: Position = { row: 4, col: 4 }
      board[4][4].piece = gold

      const moves = getPossibleMoves(board, position, gold)
      expect(moves).toHaveLength(6)
      
      // 前・左・右・後ろ・左前・右前の移動を確認
      const expectedMoves = [
        { row: 3, col: 3 }, { row: 3, col: 4 }, { row: 3, col: 5 }, // 前方3マス
        { row: 4, col: 3 },                     { row: 4, col: 5 }, // 左右
        { row: 5, col: 4 } // 後ろ
      ]
      
      expectedMoves.forEach(expectedMove => {
        expect(moves).toContainEqual(expectedMove)
      })
    })
  })

  describe('Silver movement', () => {
    it('allows movement in 5 directions', () => {
      const board = initializeEmptyBoard()
      const silver: Piece = { type: 'silver', player: 'sente', isPromoted: false }
      const position: Position = { row: 4, col: 4 }
      board[4][4].piece = silver

      const moves = getPossibleMoves(board, position, silver)
      expect(moves).toHaveLength(5)
      
      // 前・左前・右前・左後ろ・右後ろの移動を確認
      const expectedMoves = [
        { row: 3, col: 3 }, { row: 3, col: 4 }, { row: 3, col: 5 }, // 前方3マス
        { row: 5, col: 3 }, { row: 5, col: 5 } // 左後ろ・右後ろ
      ]
      
      expectedMoves.forEach(expectedMove => {
        expect(moves).toContainEqual(expectedMove)
      })
    })
  })

  describe('Knight movement', () => {
    it('allows L-shaped movement forward', () => {
      const board = initializeEmptyBoard()
      const knight: Piece = { type: 'knight', player: 'sente', isPromoted: false }
      const position: Position = { row: 4, col: 4 }
      board[4][4].piece = knight

      const moves = getPossibleMoves(board, position, knight)
      expect(moves).toHaveLength(2)
      
      // 先手の桂馬は前方2マス左右に移動
      expect(moves).toContainEqual({ row: 2, col: 3 })
      expect(moves).toContainEqual({ row: 2, col: 5 })
    })

    it('allows L-shaped movement forward for gote', () => {
      const board = initializeEmptyBoard()
      const knight: Piece = { type: 'knight', player: 'gote', isPromoted: false }
      const position: Position = { row: 4, col: 4 }
      board[4][4].piece = knight

      const moves = getPossibleMoves(board, position, knight)
      expect(moves).toHaveLength(2)
      
      // 後手の桂馬は後方2マス左右に移動
      expect(moves).toContainEqual({ row: 6, col: 3 })
      expect(moves).toContainEqual({ row: 6, col: 5 })
    })
  })

  describe('Lance movement', () => {
    it('allows forward movement in straight line', () => {
      const board = initializeEmptyBoard()
      const lance: Piece = { type: 'lance', player: 'sente', isPromoted: false }
      const position: Position = { row: 4, col: 4 }
      board[4][4].piece = lance

      const moves = getPossibleMoves(board, position, lance)
      expect(moves).toHaveLength(4)
      
      // 先手の香車は前方直線のみ
      expect(moves).toContainEqual({ row: 3, col: 4 })
      expect(moves).toContainEqual({ row: 2, col: 4 })
      expect(moves).toContainEqual({ row: 1, col: 4 })
      expect(moves).toContainEqual({ row: 0, col: 4 })
    })

    it('allows backward movement for gote', () => {
      const board = initializeEmptyBoard()
      const lance: Piece = { type: 'lance', player: 'gote', isPromoted: false }
      const position: Position = { row: 4, col: 4 }
      board[4][4].piece = lance

      const moves = getPossibleMoves(board, position, lance)
      expect(moves).toHaveLength(4)
      
      // 後手の香車は後方直線のみ
      expect(moves).toContainEqual({ row: 5, col: 4 })
      expect(moves).toContainEqual({ row: 6, col: 4 })
      expect(moves).toContainEqual({ row: 7, col: 4 })
      expect(moves).toContainEqual({ row: 8, col: 4 })
    })
  })

  describe('Pawn movement', () => {
    it('allows one square forward movement', () => {
      const board = initializeEmptyBoard()
      const pawn: Piece = { type: 'pawn', player: 'sente', isPromoted: false }
      const position: Position = { row: 4, col: 4 }
      board[4][4].piece = pawn

      const moves = getPossibleMoves(board, position, pawn)
      expect(moves).toHaveLength(1)
      expect(moves[0]).toEqual({ row: 3, col: 4 })
    })

    it('allows one square backward movement for gote', () => {
      const board = initializeEmptyBoard()
      const pawn: Piece = { type: 'pawn', player: 'gote', isPromoted: false }
      const position: Position = { row: 4, col: 4 }
      board[4][4].piece = pawn

      const moves = getPossibleMoves(board, position, pawn)
      expect(moves).toHaveLength(1)
      expect(moves[0]).toEqual({ row: 5, col: 4 })
    })
  })
})