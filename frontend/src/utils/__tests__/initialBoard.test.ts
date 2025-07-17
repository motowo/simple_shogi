import { describe, it, expect } from 'vitest'
import { initializeGameBoard } from '../initialBoard'
import type { Piece } from '../../types/shogi'

describe('initializeGameBoard', () => {
  it('creates a board with correct initial piece placement', () => {
    const board = initializeGameBoard()

    // 先手（下側）の駒配置をテスト
    expect(board[8][0].piece).toEqual({
      type: 'lance',
      player: 'sente',
      isPromoted: false
    })
    expect(board[8][1].piece).toEqual({
      type: 'knight',
      player: 'sente',
      isPromoted: false
    })
    expect(board[8][2].piece).toEqual({
      type: 'silver',
      player: 'sente',
      isPromoted: false
    })
    expect(board[8][3].piece).toEqual({
      type: 'gold',
      player: 'sente',
      isPromoted: false
    })
    expect(board[8][4].piece).toEqual({
      type: 'king',
      player: 'sente',
      isPromoted: false
    })
    expect(board[8][5].piece).toEqual({
      type: 'gold',
      player: 'sente',
      isPromoted: false
    })
    expect(board[8][6].piece).toEqual({
      type: 'silver',
      player: 'sente',
      isPromoted: false
    })
    expect(board[8][7].piece).toEqual({
      type: 'knight',
      player: 'sente',
      isPromoted: false
    })
    expect(board[8][8].piece).toEqual({
      type: 'lance',
      player: 'sente',
      isPromoted: false
    })
  })

  it('places sente pieces in correct positions', () => {
    const board = initializeGameBoard()

    // 先手の角
    expect(board[7][1].piece).toEqual({
      type: 'bishop',
      player: 'sente',
      isPromoted: false
    })

    // 先手の飛車
    expect(board[7][7].piece).toEqual({
      type: 'rook',
      player: 'sente',
      isPromoted: false
    })

    // 先手の歩兵
    for (let col = 0; col < 9; col++) {
      expect(board[6][col].piece).toEqual({
        type: 'pawn',
        player: 'sente',
        isPromoted: false
      })
    }
  })

  it('places gote pieces in correct positions', () => {
    const board = initializeGameBoard()

    // 後手の駒配置をテスト
    expect(board[0][0].piece).toEqual({
      type: 'lance',
      player: 'gote',
      isPromoted: false
    })
    expect(board[0][4].piece).toEqual({
      type: 'king',
      player: 'gote',
      isPromoted: false
    })

    // 後手の角
    expect(board[1][7].piece).toEqual({
      type: 'bishop',
      player: 'gote',
      isPromoted: false
    })

    // 後手の飛車
    expect(board[1][1].piece).toEqual({
      type: 'rook',
      player: 'gote',
      isPromoted: false
    })
    // 後手の歩兵
    for (let col = 0; col < 9; col++) {
      expect(board[2][col].piece).toEqual({
        type: 'pawn',
        player: 'gote',
        isPromoted: false
      })
    }
  })

  it('leaves middle rows empty', () => {
    const board = initializeGameBoard()

    // 3-5行目（0ベース）は空であることを確認
    for (let row = 3; row <= 5; row++) {
      for (let col = 0; col < 9; col++) {
        expect(board[row][col].piece).toBeNull()
      }
    }
  })

  it('all pieces are initially not promoted', () => {
    const board = initializeGameBoard()

    board.forEach((row) => {
      row.forEach((cell) => {
        if (cell.piece) {
          expect(cell.piece.isPromoted).toBe(false)
        }
      })
    })
  })
})
