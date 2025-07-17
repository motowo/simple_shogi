import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CapturedPieces from '../CapturedPieces.vue'
import type { DroppablePiece } from '../../utils/capturedPieces'

describe('CapturedPieces', () => {
  it('displays player name correctly', () => {
    const wrapper = mount(CapturedPieces, {
      props: {
        player: 'sente',
        droppablePieces: []
      }
    })

    expect(wrapper.find('.title').text()).toBe('先手の持ち駒')
  })

  it('displays gote player name correctly', () => {
    const wrapper = mount(CapturedPieces, {
      props: {
        player: 'gote',
        droppablePieces: []
      }
    })

    expect(wrapper.find('.title').text()).toBe('後手の持ち駒')
  })

  it('displays "なし" when no pieces', () => {
    const wrapper = mount(CapturedPieces, {
      props: {
        player: 'sente',
        droppablePieces: []
      }
    })

    expect(wrapper.find('.no-pieces').text()).toBe('なし')
  })

  it('displays captured pieces correctly', () => {
    const droppablePieces: DroppablePiece[] = [
      { type: 'pawn', count: 2 },
      { type: 'rook', count: 1 }
    ]

    const wrapper = mount(CapturedPieces, {
      props: {
        player: 'sente',
        droppablePieces
      }
    })

    const pieces = wrapper.findAll('.piece-item')
    expect(pieces).toHaveLength(2)

    // 歩兵の表示確認
    const pawnPiece = pieces[0]
    expect(pawnPiece.find('.piece-character').text()).toBe('歩')
    expect(pawnPiece.find('.piece-count').text()).toBe('2')

    // 飛車の表示確認
    const rookPiece = pieces[1]
    expect(rookPiece.find('.piece-character').text()).toBe('飛')
    expect(rookPiece.find('.piece-count').exists()).toBe(false) // count=1の場合は表示されない
  })

  it('emits pieceClick event when piece is clicked and selectable', async () => {
    const droppablePieces: DroppablePiece[] = [{ type: 'pawn', count: 1 }]

    const wrapper = mount(CapturedPieces, {
      props: {
        player: 'sente',
        droppablePieces,
        isSelectable: true
      }
    })

    const piece = wrapper.find('.piece-item')
    await piece.trigger('click')

    expect(wrapper.emitted('pieceClick')).toHaveLength(1)
    expect(wrapper.emitted('pieceClick')![0]).toEqual(['pawn'])
  })

  it('does not emit pieceClick event when not selectable', async () => {
    const droppablePieces: DroppablePiece[] = [{ type: 'pawn', count: 1 }]

    const wrapper = mount(CapturedPieces, {
      props: {
        player: 'sente',
        droppablePieces,
        isSelectable: false
      }
    })

    const piece = wrapper.find('.piece-item')
    await piece.trigger('click')

    expect(wrapper.emitted('pieceClick')).toBeUndefined()
  })

  it('applies selectable class when isSelectable is true', () => {
    const droppablePieces: DroppablePiece[] = [{ type: 'pawn', count: 1 }]

    const wrapper = mount(CapturedPieces, {
      props: {
        player: 'sente',
        droppablePieces,
        isSelectable: true
      }
    })

    const piece = wrapper.find('.piece-item')
    expect(piece.classes()).toContain('selectable')
  })

  it('does not apply selectable class when isSelectable is false', () => {
    const droppablePieces: DroppablePiece[] = [{ type: 'pawn', count: 1 }]

    const wrapper = mount(CapturedPieces, {
      props: {
        player: 'sente',
        droppablePieces,
        isSelectable: false
      }
    })

    const piece = wrapper.find('.piece-item')
    expect(piece.classes()).not.toContain('selectable')
  })
})
