import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MoveHistory from '../MoveHistory.vue'
import type { Move } from '../../types/shogi'

describe('MoveHistory', () => {
  it('renders title correctly', () => {
    const wrapper = mount(MoveHistory, {
      props: { moves: [] }
    })

    expect(wrapper.find('.history-title').text()).toBe('手順')
  })

  it('displays no moves message when empty', () => {
    const wrapper = mount(MoveHistory, {
      props: { moves: [] }
    })

    expect(wrapper.find('.no-moves').exists()).toBe(true)
    expect(wrapper.find('.no-moves').text()).toBe('まだ手が指されていません')
  })

  it('displays moves when provided', () => {
    const moves: Move[] = [
      {
        from: { row: 6, col: 4 },
        to: { row: 5, col: 4 },
        piece: { type: 'pawn', player: 'sente', isPromoted: false },
        timestamp: new Date()
      },
      {
        from: { row: 2, col: 4 },
        to: { row: 3, col: 4 },
        piece: { type: 'pawn', player: 'gote', isPromoted: false },
        timestamp: new Date()
      }
    ]

    const wrapper = mount(MoveHistory, {
      props: { moves }
    })

    const moveItems = wrapper.findAll('.move-item')
    expect(moveItems).toHaveLength(2)
  })

  it('formats moves correctly', () => {
    const moves: Move[] = [
      {
        from: { row: 6, col: 4 },
        to: { row: 5, col: 4 },
        piece: { type: 'pawn', player: 'sente', isPromoted: false },
        timestamp: new Date()
      }
    ]

    const wrapper = mount(MoveHistory, {
      props: { moves }
    })

    const moveItem = wrapper.find('.move-item')
    expect(moveItem.find('.move-number').text()).toBe('1.')
    expect(moveItem.find('.move-text').text()).toContain('歩')
  })

  it('shows capture moves correctly', () => {
    const moves: Move[] = [
      {
        from: { row: 6, col: 4 },
        to: { row: 5, col: 4 },
        piece: { type: 'pawn', player: 'sente', isPromoted: false },
        capturedPiece: { type: 'pawn', player: 'gote', isPromoted: false },
        timestamp: new Date()
      }
    ]

    const wrapper = mount(MoveHistory, {
      props: { moves }
    })

    const moveText = wrapper.find('.move-text').text()
    expect(moveText).toContain('取')
  })

  it('shows promotion moves correctly', () => {
    const moves: Move[] = [
      {
        from: { row: 1, col: 4 },
        to: { row: 0, col: 4 },
        piece: { type: 'pawn', player: 'sente', isPromoted: false },
        isPromotion: true,
        timestamp: new Date()
      }
    ]

    const wrapper = mount(MoveHistory, {
      props: { moves }
    })

    const moveText = wrapper.find('.move-text').text()
    expect(moveText).toContain('成')
  })

  it('highlights current move', () => {
    const moves: Move[] = [
      {
        from: { row: 6, col: 4 },
        to: { row: 5, col: 4 },
        piece: { type: 'pawn', player: 'sente', isPromoted: false },
        timestamp: new Date()
      },
      {
        from: { row: 2, col: 4 },
        to: { row: 3, col: 4 },
        piece: { type: 'pawn', player: 'gote', isPromoted: false },
        timestamp: new Date()
      }
    ]

    const wrapper = mount(MoveHistory, {
      props: { moves }
    })

    const moveItems = wrapper.findAll('.move-item')
    expect(moveItems[0].classes()).not.toContain('current-move')
    expect(moveItems[1].classes()).toContain('current-move')
  })

  it('handles empty moves array', () => {
    const wrapper = mount(MoveHistory, {
      props: { moves: [] }
    })

    expect(wrapper.find('.moves-list').exists()).toBe(false)
    expect(wrapper.find('.no-moves').exists()).toBe(true)
  })
})