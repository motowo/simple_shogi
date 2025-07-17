import { describe, it, expect } from 'vitest'
import { 
  addCapturedPiece, 
  removeCapturedPiece, 
  getCapturedPieces, 
  canDropPiece,
  getDroppablePieces 
} from '../capturedPieces'
import { initializeEmptyBoard } from '../boardUtils'
import type { Piece, Player, Position } from '../../types/shogi'

describe('capturedPieces', () => {
  describe('addCapturedPiece', () => {
    it('adds a captured piece to the collection', () => {
      const capturedPieces = new Map<Player, Piece[]>()
      const piece: Piece = { type: 'pawn', player: 'gote', isPromoted: false }
      
      addCapturedPiece(capturedPieces, 'sente', piece)
      
      const sentePieces = getCapturedPieces(capturedPieces, 'sente')
      expect(sentePieces).toHaveLength(1)
      expect(sentePieces[0]).toEqual({ type: 'pawn', player: 'sente', isPromoted: false })
    })

    it('converts promoted pieces to normal pieces when captured', () => {
      const capturedPieces = new Map<Player, Piece[]>()
      const promotedPawn: Piece = { type: 'pawn', player: 'gote', isPromoted: true }
      
      addCapturedPiece(capturedPieces, 'sente', promotedPawn)
      
      const sentePieces = getCapturedPieces(capturedPieces, 'sente')
      expect(sentePieces[0].isPromoted).toBe(false)
    })
  })

  describe('removeCapturedPiece', () => {
    it('removes a piece from captured pieces', () => {
      const capturedPieces = new Map<Player, Piece[]>()
      const piece: Piece = { type: 'pawn', player: 'gote', isPromoted: false }
      
      addCapturedPiece(capturedPieces, 'sente', piece)
      const removed = removeCapturedPiece(capturedPieces, 'sente', 'pawn')
      
      expect(removed).toBeTruthy()
      expect(getCapturedPieces(capturedPieces, 'sente')).toHaveLength(0)
    })

    it('returns false when piece is not available', () => {
      const capturedPieces = new Map<Player, Piece[]>()
      
      const removed = removeCapturedPiece(capturedPieces, 'sente', 'pawn')
      expect(removed).toBe(false)
    })
  })

  describe('canDropPiece', () => {
    it('allows dropping piece on empty square', () => {
      const board = initializeEmptyBoard()
      const capturedPieces = new Map<Player, Piece[]>()
      const piece: Piece = { type: 'pawn', player: 'gote', isPromoted: false }
      
      addCapturedPiece(capturedPieces, 'sente', piece)
      
      const canDrop = canDropPiece(board, capturedPieces, 'sente', 'pawn', { row: 4, col: 4 })
      expect(canDrop).toBe(true)
    })

    it('prevents dropping piece on occupied square', () => {
      const board = initializeEmptyBoard()
      const capturedPieces = new Map<Player, Piece[]>()
      const piece: Piece = { type: 'pawn', player: 'gote', isPromoted: false }
      
      board[4][4].piece = { type: 'king', player: 'gote', isPromoted: false }
      addCapturedPiece(capturedPieces, 'sente', piece)
      
      const canDrop = canDropPiece(board, capturedPieces, 'sente', 'pawn', { row: 4, col: 4 })
      expect(canDrop).toBe(false)
    })

    it('prevents dropping piece when not in captured pieces', () => {
      const board = initializeEmptyBoard()
      const capturedPieces = new Map<Player, Piece[]>()
      
      const canDrop = canDropPiece(board, capturedPieces, 'sente', 'pawn', { row: 4, col: 4 })
      expect(canDrop).toBe(false)
    })

    it('prevents dropping pawn on same column with existing pawn', () => {
      const board = initializeEmptyBoard()
      const capturedPieces = new Map<Player, Piece[]>()
      const piece: Piece = { type: 'pawn', player: 'gote', isPromoted: false }
      
      // 同じ列に先手の歩兵を配置
      board[6][4].piece = { type: 'pawn', player: 'sente', isPromoted: false }
      addCapturedPiece(capturedPieces, 'sente', piece)
      
      const canDrop = canDropPiece(board, capturedPieces, 'sente', 'pawn', { row: 4, col: 4 })
      expect(canDrop).toBe(false)
    })

    it('prevents dropping pawn in promotion zone if it would be immobilized', () => {
      const board = initializeEmptyBoard()
      const capturedPieces = new Map<Player, Piece[]>()
      const piece: Piece = { type: 'pawn', player: 'gote', isPromoted: false }
      
      addCapturedPiece(capturedPieces, 'sente', piece)
      
      // 先手の歩兵を最前線（0行目）に打とうとする
      const canDrop = canDropPiece(board, capturedPieces, 'sente', 'pawn', { row: 0, col: 4 })
      expect(canDrop).toBe(false)
    })

    it('prevents dropping lance in promotion zone if it would be immobilized', () => {
      const board = initializeEmptyBoard()
      const capturedPieces = new Map<Player, Piece[]>()
      const piece: Piece = { type: 'lance', player: 'gote', isPromoted: false }
      
      addCapturedPieces(capturedPieces, 'sente', piece)
      
      // 先手の香車を最前線（0行目）に打とうとする
      const canDrop = canDropPiece(board, capturedPieces, 'sente', 'lance', { row: 0, col: 4 })
      expect(canDrop).toBe(false)
    })

    it('prevents dropping knight in promotion zone if it would be immobilized', () => {
      const board = initializeEmptyBoard()
      const capturedPieces = new Map<Player, Piece[]>()
      const piece: Piece = { type: 'knight', player: 'gote', isPromoted: false }
      
      addCapturedPiece(capturedPieces, 'sente', piece)
      
      // 先手の桂馬を最前線2行（0-1行目）に打とうとする
      const canDrop1 = canDropPiece(board, capturedPieces, 'sente', 'knight', { row: 0, col: 4 })
      const canDrop2 = canDropPiece(board, capturedPieces, 'sente', 'knight', { row: 1, col: 4 })
      
      expect(canDrop1).toBe(false)
      expect(canDrop2).toBe(false)
    })
  })

  describe('getDroppablePieces', () => {
    it('returns available pieces for dropping', () => {
      const capturedPieces = new Map<Player, Piece[]>()
      const pieces: Piece[] = [
        { type: 'pawn', player: 'gote', isPromoted: false },
        { type: 'rook', player: 'gote', isPromoted: false },
        { type: 'pawn', player: 'gote', isPromoted: false }
      ]
      
      pieces.forEach(piece => addCapturedPiece(capturedPieces, 'sente', piece))
      
      const droppable = getDroppablePieces(capturedPieces, 'sente')
      expect(droppable).toHaveLength(2) // 歩兵2枚、飛車1枚
      expect(droppable.find(p => p.type === 'pawn')?.count).toBe(2)
      expect(droppable.find(p => p.type === 'rook')?.count).toBe(1)
    })
  })
})

// ヘルパー関数
function addCapturedPieces(capturedPieces: Map<Player, Piece[]>, player: Player, piece: Piece) {
  addCapturedPiece(capturedPieces, player, piece)
}