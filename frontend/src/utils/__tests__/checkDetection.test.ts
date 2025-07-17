import { describe, it, expect } from 'vitest'
import { 
  isKingInCheck, 
  findKingPosition, 
  getAttackingPieces,
  wouldBeInCheckAfterMove,
  isCheckmate
} from '../checkDetection'
import { initializeEmptyBoard } from '../boardUtils'
import type { BoardCell, Position, Piece } from '../../types/shogi'

describe('checkDetection', () => {
  describe('findKingPosition', () => {
    it('finds the king position correctly', () => {
      const board = initializeEmptyBoard()
      const king: Piece = { type: 'king', player: 'sente', isPromoted: false }
      board[8][4].piece = king

      const position = findKingPosition(board, 'sente')
      expect(position).toEqual({ row: 8, col: 4 })
    })

    it('returns null when king is not found', () => {
      const board = initializeEmptyBoard()
      const position = findKingPosition(board, 'sente')
      expect(position).toBeNull()
    })
  })

  describe('isKingInCheck', () => {
    it('detects check by rook', () => {
      const board = initializeEmptyBoard()
      const senteKing: Piece = { type: 'king', player: 'sente', isPromoted: false }
      const goteRook: Piece = { type: 'rook', player: 'gote', isPromoted: false }
      
      board[8][4].piece = senteKing
      board[0][4].piece = goteRook

      expect(isKingInCheck(board, 'sente')).toBe(true)
    })

    it('detects check by bishop', () => {
      const board = initializeEmptyBoard()
      const senteKing: Piece = { type: 'king', player: 'sente', isPromoted: false }
      const goteBishop: Piece = { type: 'bishop', player: 'gote', isPromoted: false }
      
      board[4][4].piece = senteKing
      board[0][0].piece = goteBishop

      expect(isKingInCheck(board, 'sente')).toBe(true)
    })

    it('detects check by pawn', () => {
      const board = initializeEmptyBoard()
      const senteKing: Piece = { type: 'king', player: 'sente', isPromoted: false }
      const gotePawn: Piece = { type: 'pawn', player: 'gote', isPromoted: false }
      
      board[4][4].piece = senteKing
      board[5][4].piece = gotePawn // 後手の歩は下向きなので王手

      expect(isKingInCheck(board, 'sente')).toBe(true)
    })

    it('detects check by knight', () => {
      const board = initializeEmptyBoard()
      const senteKing: Piece = { type: 'king', player: 'sente', isPromoted: false }
      const goteKnight: Piece = { type: 'knight', player: 'gote', isPromoted: false }
      
      board[4][4].piece = senteKing
      board[2][3].piece = goteKnight // 後手の桂馬から王手

      expect(isKingInCheck(board, 'sente')).toBe(true)
    })

    it('returns false when king is not in check', () => {
      const board = initializeEmptyBoard()
      const senteKing: Piece = { type: 'king', player: 'sente', isPromoted: false }
      const gotePawn: Piece = { type: 'pawn', player: 'gote', isPromoted: false }
      
      board[8][4].piece = senteKing
      board[2][7].piece = gotePawn // 王手になっていない位置

      expect(isKingInCheck(board, 'sente')).toBe(false)
    })

    it('detects check is blocked by another piece', () => {
      const board = initializeEmptyBoard()
      const senteKing: Piece = { type: 'king', player: 'sente', isPromoted: false }
      const goteRook: Piece = { type: 'rook', player: 'gote', isPromoted: false }
      const sentePawn: Piece = { type: 'pawn', player: 'sente', isPromoted: false }
      
      board[8][4].piece = senteKing
      board[0][4].piece = goteRook
      board[4][4].piece = sentePawn // 飛車の攻撃をブロック

      expect(isKingInCheck(board, 'sente')).toBe(false)
    })
  })

  describe('getAttackingPieces', () => {
    it('returns all pieces attacking the king', () => {
      const board = initializeEmptyBoard()
      const senteKing: Piece = { type: 'king', player: 'sente', isPromoted: false }
      const goteRook: Piece = { type: 'rook', player: 'gote', isPromoted: false }
      const goteBishop: Piece = { type: 'bishop', player: 'gote', isPromoted: false }
      
      board[4][4].piece = senteKing
      board[0][4].piece = goteRook  // 縦の王手
      board[0][0].piece = goteBishop // 斜めの王手

      const attackers = getAttackingPieces(board, 'sente')
      expect(attackers).toHaveLength(2)
      expect(attackers.some(a => a.position.row === 0 && a.position.col === 4)).toBe(true)
      expect(attackers.some(a => a.position.row === 0 && a.position.col === 0)).toBe(true)
    })
  })

  describe('wouldBeInCheckAfterMove', () => {
    it('prevents moving into check', () => {
      const board = initializeEmptyBoard()
      const senteKing: Piece = { type: 'king', player: 'sente', isPromoted: false }
      const goteRook: Piece = { type: 'rook', player: 'gote', isPromoted: false }
      
      board[8][4].piece = senteKing
      board[7][5].piece = goteRook

      const from: Position = { row: 8, col: 4 }
      const to: Position = { row: 7, col: 4 } // 飛車の利きに入る

      expect(wouldBeInCheckAfterMove(board, from, to, 'sente')).toBe(true)
    })

    it('prevents uncovering check', () => {
      const board = initializeEmptyBoard()
      const senteKing: Piece = { type: 'king', player: 'sente', isPromoted: false }
      const senteSilver: Piece = { type: 'silver', player: 'sente', isPromoted: false }
      const goteRook: Piece = { type: 'rook', player: 'gote', isPromoted: false }
      
      board[8][4].piece = senteKing
      board[7][4].piece = senteSilver // 王を守っている
      board[0][4].piece = goteRook

      const from: Position = { row: 7, col: 4 }
      const to: Position = { row: 6, col: 3 } // 銀を動かすと王手になる

      expect(wouldBeInCheckAfterMove(board, from, to, 'sente')).toBe(true)
    })

    it('allows moves that do not result in check', () => {
      const board = initializeEmptyBoard()
      const senteKing: Piece = { type: 'king', player: 'sente', isPromoted: false }
      const sentePawn: Piece = { type: 'pawn', player: 'sente', isPromoted: false }
      
      board[8][4].piece = senteKing
      board[6][0].piece = sentePawn

      const from: Position = { row: 6, col: 0 }
      const to: Position = { row: 5, col: 0 }

      expect(wouldBeInCheckAfterMove(board, from, to, 'sente')).toBe(false)
    })
  })

  describe('isCheckmate', () => {
    it('detects simple checkmate', () => {
      const board = initializeEmptyBoard()
      const senteKing: Piece = { type: 'king', player: 'sente', isPromoted: false }
      const goteRook1: Piece = { type: 'rook', player: 'gote', isPromoted: false }
      const goteRook2: Piece = { type: 'rook', player: 'gote', isPromoted: false }
      
      // 王を端に追い詰める
      board[8][8].piece = senteKing
      board[7][8].piece = goteRook1 // 横から王手
      board[8][6].piece = goteRook2 // 逃げ道を塞ぐ

      expect(isCheckmate(board, 'sente')).toBe(true)
    })

    it('returns false when king can escape', () => {
      const board = initializeEmptyBoard()
      const senteKing: Piece = { type: 'king', player: 'sente', isPromoted: false }
      const goteRook: Piece = { type: 'rook', player: 'gote', isPromoted: false }
      
      board[4][4].piece = senteKing
      board[0][4].piece = goteRook // 王手

      expect(isCheckmate(board, 'sente')).toBe(false) // 王は逃げられる
    })

    it('returns false when check can be blocked', () => {
      const board = initializeEmptyBoard()
      const senteKing: Piece = { type: 'king', player: 'sente', isPromoted: false }
      const senteSilver: Piece = { type: 'silver', player: 'sente', isPromoted: false }
      const goteRook: Piece = { type: 'rook', player: 'gote', isPromoted: false }
      
      board[8][4].piece = senteKing
      board[7][3].piece = senteSilver
      board[0][4].piece = goteRook // 王手

      expect(isCheckmate(board, 'sente')).toBe(false) // 銀で防げる
    })

    it('returns false when attacking piece can be captured', () => {
      const board = initializeEmptyBoard()
      const senteKing: Piece = { type: 'king', player: 'sente', isPromoted: false }
      const senteBishop: Piece = { type: 'bishop', player: 'sente', isPromoted: false }
      const gotePawn: Piece = { type: 'pawn', player: 'gote', isPromoted: false }
      
      board[8][4].piece = senteKing
      board[6][2].piece = senteBishop
      board[7][4].piece = gotePawn // 王手

      expect(isCheckmate(board, 'sente')).toBe(false) // 角で歩を取れる
    })

    it('returns false when not in check', () => {
      const board = initializeEmptyBoard()
      const senteKing: Piece = { type: 'king', player: 'sente', isPromoted: false }
      
      board[8][4].piece = senteKing

      expect(isCheckmate(board, 'sente')).toBe(false)
    })
  })
})