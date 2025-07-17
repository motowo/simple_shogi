import { describe, it, expect } from 'vitest'
import {
  initializeEmptyBoard,
  isValidPosition,
  isSamePosition,
  parseKifuPosition,
  formatKifuPosition
} from '../boardUtils'

describe('boardUtils', () => {
  describe('initializeEmptyBoard', () => {
    it('creates a 9x9 board', () => {
      const board = initializeEmptyBoard()
      expect(board).toHaveLength(9)
      board.forEach((row) => {
        expect(row).toHaveLength(9)
      })
    })

    it('initializes all cells with null pieces', () => {
      const board = initializeEmptyBoard()
      board.forEach((row) => {
        row.forEach((cell) => {
          expect(cell.piece).toBeNull()
          expect(cell.isHighlighted).toBe(false)
          expect(cell.isSelected).toBe(false)
        })
      })
    })

    it('sets correct positions for each cell', () => {
      const board = initializeEmptyBoard()
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          expect(board[row][col].position).toEqual({ row, col })
        }
      }
    })
  })

  describe('isValidPosition', () => {
    it('returns true for valid positions', () => {
      expect(isValidPosition({ row: 0, col: 0 })).toBe(true)
      expect(isValidPosition({ row: 4, col: 4 })).toBe(true)
      expect(isValidPosition({ row: 8, col: 8 })).toBe(true)
    })

    it('returns false for invalid positions', () => {
      expect(isValidPosition({ row: -1, col: 0 })).toBe(false)
      expect(isValidPosition({ row: 0, col: -1 })).toBe(false)
      expect(isValidPosition({ row: 9, col: 0 })).toBe(false)
      expect(isValidPosition({ row: 0, col: 9 })).toBe(false)
    })
  })

  describe('isSamePosition', () => {
    it('returns true for same positions', () => {
      expect(isSamePosition({ row: 1, col: 2 }, { row: 1, col: 2 })).toBe(true)
    })

    it('returns false for different positions', () => {
      expect(isSamePosition({ row: 1, col: 2 }, { row: 1, col: 3 })).toBe(false)
      expect(isSamePosition({ row: 1, col: 2 }, { row: 2, col: 2 })).toBe(false)
    })
  })

  describe('parseKifuPosition', () => {
    it('parses valid kifu positions', () => {
      expect(parseKifuPosition('9一')).toEqual({ row: 0, col: 0 })
      expect(parseKifuPosition('5五')).toEqual({ row: 4, col: 4 })
      expect(parseKifuPosition('1九')).toEqual({ row: 8, col: 8 })
    })

    it('returns null for invalid kifu positions', () => {
      expect(parseKifuPosition('99')).toBeNull()
      expect(parseKifuPosition('a一')).toBeNull()
      expect(parseKifuPosition('9十')).toBeNull()
      expect(parseKifuPosition('')).toBeNull()
    })
  })

  describe('formatKifuPosition', () => {
    it('formats positions correctly', () => {
      expect(formatKifuPosition({ row: 0, col: 0 })).toBe('９一')
      expect(formatKifuPosition({ row: 4, col: 4 })).toBe('５五')
      expect(formatKifuPosition({ row: 8, col: 8 })).toBe('１九')
    })

    it('returns empty string for invalid positions', () => {
      expect(formatKifuPosition({ row: -1, col: 0 })).toBe('')
      expect(formatKifuPosition({ row: 9, col: 0 })).toBe('')
    })
  })
})
