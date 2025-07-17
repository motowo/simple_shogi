import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PromotionDialog from '../PromotionDialog.vue'
import type { Piece } from '../../types/shogi'

describe('PromotionDialog', () => {
  const mockPiece: Piece = {
    type: 'pawn',
    player: 'sente',
    isPromoted: false
  }

  it('renders when visible', () => {
    const wrapper = mount(PromotionDialog, {
      props: {
        piece: mockPiece,
        isVisible: true,
        mustPromote: false
      }
    })

    expect(wrapper.find('.promotion-dialog').exists()).toBe(true)
    expect(wrapper.find('.dialog-title').text()).toBe('成り駒にしますか？')
  })

  it('does not render when not visible', () => {
    const wrapper = mount(PromotionDialog, {
      props: {
        piece: mockPiece,
        isVisible: false,
        mustPromote: false
      }
    })

    expect(wrapper.find('.promotion-dialog').exists()).toBe(false)
  })

  it('displays current piece and promoted piece', () => {
    const wrapper = mount(PromotionDialog, {
      props: {
        piece: mockPiece,
        isVisible: true,
        mustPromote: false
      }
    })

    const pieceOptions = wrapper.findAll('.piece-option')
    expect(pieceOptions).toHaveLength(2)
    
    const pieces = wrapper.findAllComponents({ name: 'ShogiPiece' })
    expect(pieces).toHaveLength(2)
  })

  it('shows both promote and no-promote buttons when not forced', () => {
    const wrapper = mount(PromotionDialog, {
      props: {
        piece: mockPiece,
        isVisible: true,
        mustPromote: false
      }
    })

    expect(wrapper.find('.promote-button').exists()).toBe(true)
    expect(wrapper.find('.no-promote-button').exists()).toBe(true)
  })

  it('shows only promote button when forced', () => {
    const wrapper = mount(PromotionDialog, {
      props: {
        piece: mockPiece,
        isVisible: true,
        mustPromote: true
      }
    })

    expect(wrapper.find('.promote-button').exists()).toBe(true)
    expect(wrapper.find('.no-promote-button').exists()).toBe(false)
  })

  it('shows force promote message when mustPromote is true', () => {
    const wrapper = mount(PromotionDialog, {
      props: {
        piece: mockPiece,
        isVisible: true,
        mustPromote: true
      }
    })

    expect(wrapper.find('.force-promote-message').exists()).toBe(true)
    expect(wrapper.find('.force-promote-message').text()).toBe('この駒は成る必要があります')
  })

  it('does not show force promote message when mustPromote is false', () => {
    const wrapper = mount(PromotionDialog, {
      props: {
        piece: mockPiece,
        isVisible: true,
        mustPromote: false
      }
    })

    expect(wrapper.find('.force-promote-message').exists()).toBe(false)
  })

  it('emits promote event when promote button is clicked', async () => {
    const wrapper = mount(PromotionDialog, {
      props: {
        piece: mockPiece,
        isVisible: true,
        mustPromote: false
      }
    })

    await wrapper.find('.promote-button').trigger('click')
    expect(wrapper.emitted('promote')).toHaveLength(1)
  })

  it('emits noPromote event when no-promote button is clicked', async () => {
    const wrapper = mount(PromotionDialog, {
      props: {
        piece: mockPiece,
        isVisible: true,
        mustPromote: false
      }
    })

    await wrapper.find('.no-promote-button').trigger('click')
    expect(wrapper.emitted('noPromote')).toHaveLength(1)
  })

  it('does not emit noPromote when mustPromote is true', async () => {
    const wrapper = mount(PromotionDialog, {
      props: {
        piece: mockPiece,
        isVisible: true,
        mustPromote: true
      }
    })

    // No-promote button should not exist
    expect(wrapper.find('.no-promote-button').exists()).toBe(false)
  })

  it('displays correct piece names', () => {
    const wrapper = mount(PromotionDialog, {
      props: {
        piece: mockPiece,
        isVisible: true,
        mustPromote: false
      }
    })

    const pieceNames = wrapper.findAll('.piece-name')
    expect(pieceNames).toHaveLength(2)
    expect(pieceNames[0].text()).toBe('歩')
    expect(pieceNames[1].text()).toBe('と')
  })
})