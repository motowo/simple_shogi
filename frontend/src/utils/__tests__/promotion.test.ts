import { describe, it, expect } from 'vitest'
import { canPromoteAt, mustPromoteAt, isInPromotionZone, promoteMovePiece } from '../promotion'
import { initializeEmptyBoard } from '../boardUtils'
import type { Piece, Position } from '../../types/shogi'

describe('promotion', () => {
  describe('isInPromotionZone', () => {
    it('identifies sente promotion zone correctly', () => {
      expect(isInPromotionZone('sente', { row: 0, col: 4 })).toBe(true)
      expect(isInPromotionZone('sente', { row: 1, col: 4 })).toBe(true)
      expect(isInPromotionZone('sente', { row: 2, col: 4 })).toBe(true)
      expect(isInPromotionZone('sente', { row: 3, col: 4 })).toBe(false)
    })

    it('identifies gote promotion zone correctly', () => {
      expect(isInPromotionZone('gote', { row: 6, col: 4 })).toBe(true)
      expect(isInPromotionZone('gote', { row: 7, col: 4 })).toBe(true)
      expect(isInPromotionZone('gote', { row: 8, col: 4 })).toBe(true)
      expect(isInPromotionZone('gote', { row: 5, col: 4 })).toBe(false)
    })
  })

  describe('canPromoteAt', () => {
    it('allows promotion for promotable pieces in promotion zone', () => {
      const pawn: Piece = { type: 'pawn', player: 'sente', isPromoted: false }
      const from: Position = { row: 3, col: 4 }
      const to: Position = { row: 2, col: 4 }

      expect(canPromoteAt(pawn, from, to)).toBe(true)
    })

    it('prevents promotion for non-promotable pieces', () => {
      const king: Piece = { type: 'king', player: 'sente', isPromoted: false }
      const from: Position = { row: 3, col: 4 }
      const to: Position = { row: 2, col: 4 }

      expect(canPromoteAt(king, from, to)).toBe(false)
    })

    it('prevents promotion for already promoted pieces', () => {
      const promotedPawn: Piece = { type: 'pawn', player: 'sente', isPromoted: true }
      const from: Position = { row: 3, col: 4 }
      const to: Position = { row: 2, col: 4 }

      expect(canPromoteAt(promotedPawn, from, to)).toBe(false)
    })

    it('allows promotion when moving from promotion zone', () => {
      const pawn: Piece = { type: 'pawn', player: 'sente', isPromoted: false }
      const from: Position = { row: 2, col: 4 } // 成り駒圏内
      const to: Position = { row: 3, col: 4 } // 成り駒圏外

      expect(canPromoteAt(pawn, from, to)).toBe(true)
    })

    it('prevents promotion when not in promotion zone', () => {
      const pawn: Piece = { type: 'pawn', player: 'sente', isPromoted: false }
      const from: Position = { row: 5, col: 4 }
      const to: Position = { row: 4, col: 4 }

      expect(canPromoteAt(pawn, from, to)).toBe(false)
    })
  })

  describe('mustPromoteAt', () => {
    it('requires promotion for pawn reaching the end', () => {
      const pawn: Piece = { type: 'pawn', player: 'sente', isPromoted: false }
      const to: Position = { row: 0, col: 4 }

      expect(mustPromoteAt(pawn, to)).toBe(true)
    })

    it('requires promotion for lance reaching the end', () => {
      const lance: Piece = { type: 'lance', player: 'sente', isPromoted: false }
      const to: Position = { row: 0, col: 4 }

      expect(mustPromoteAt(lance, to)).toBe(true)
    })

    it('requires promotion for knight reaching the end rows', () => {
      const knight: Piece = { type: 'knight', player: 'sente', isPromoted: false }

      expect(mustPromoteAt(knight, { row: 0, col: 4 })).toBe(true)
      expect(mustPromoteAt(knight, { row: 1, col: 4 })).toBe(true)
      expect(mustPromoteAt(knight, { row: 2, col: 4 })).toBe(false)
    })

    it('requires promotion for gote pieces in their end zones', () => {
      const pawn: Piece = { type: 'pawn', player: 'gote', isPromoted: false }
      const lance: Piece = { type: 'lance', player: 'gote', isPromoted: false }
      const knight: Piece = { type: 'knight', player: 'gote', isPromoted: false }

      expect(mustPromoteAt(pawn, { row: 8, col: 4 })).toBe(true)
      expect(mustPromoteAt(lance, { row: 8, col: 4 })).toBe(true)
      expect(mustPromoteAt(knight, { row: 8, col: 4 })).toBe(true)
      expect(mustPromoteAt(knight, { row: 7, col: 4 })).toBe(true)
    })

    it('does not require promotion for pieces that can still move', () => {
      const pawn: Piece = { type: 'pawn', player: 'sente', isPromoted: false }
      const silver: Piece = { type: 'silver', player: 'sente', isPromoted: false }

      expect(mustPromoteAt(pawn, { row: 1, col: 4 })).toBe(false)
      expect(mustPromoteAt(silver, { row: 0, col: 4 })).toBe(false)
    })
  })

  describe('promoteMovePiece', () => {
    it('promotes piece correctly', () => {
      const pawn: Piece = { type: 'pawn', player: 'sente', isPromoted: false }
      const promoted = promoteMovePiece(pawn)

      expect(promoted.isPromoted).toBe(true)
      expect(promoted.type).toBe('pawn')
      expect(promoted.player).toBe('sente')
    })

    it('does not change already promoted piece', () => {
      const promotedPawn: Piece = { type: 'pawn', player: 'sente', isPromoted: true }
      const result = promoteMovePiece(promotedPawn)

      expect(result.isPromoted).toBe(true)
      expect(result.type).toBe('pawn')
    })

    it('creates a new piece object', () => {
      const original: Piece = { type: 'silver', player: 'gote', isPromoted: false }
      const promoted = promoteMovePiece(original)

      expect(promoted).not.toBe(original)
      expect(promoted.isPromoted).toBe(true)
      expect(original.isPromoted).toBe(false)
    })
  })
})
