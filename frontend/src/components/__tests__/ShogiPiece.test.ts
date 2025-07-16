import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ShogiPiece from '../ShogiPiece.vue'
import type { Piece } from '../../types/shogi'

describe('ShogiPiece', () => {
  it('displays correct piece character for sente king', () => {
    const piece: Piece = {
      type: 'king',
      player: 'sente',
      isPromoted: false
    }
    
    const wrapper = mount(ShogiPiece, { props: { piece } })
    expect(wrapper.find('.piece-character').text()).toBe('王')
  })

  it('displays correct piece character for gote rook', () => {
    const piece: Piece = {
      type: 'rook',
      player: 'gote',
      isPromoted: false
    }
    
    const wrapper = mount(ShogiPiece, { props: { piece } })
    expect(wrapper.find('.piece-character').text()).toBe('飛')
  })

  it('displays promoted piece correctly', () => {
    const piece: Piece = {
      type: 'pawn',
      player: 'sente',
      isPromoted: true
    }
    
    const wrapper = mount(ShogiPiece, { props: { piece } })
    expect(wrapper.find('.piece-character').text()).toBe('と')
    expect(wrapper.find('.shogi-piece').classes()).toContain('promoted')
  })

  it('applies correct CSS classes for sente pieces', () => {
    const piece: Piece = {
      type: 'silver',
      player: 'sente',
      isPromoted: false
    }
    
    const wrapper = mount(ShogiPiece, { props: { piece } })
    const pieceElement = wrapper.find('.shogi-piece')
    expect(pieceElement.classes()).toContain('sente')
    expect(pieceElement.classes()).not.toContain('gote')
  })

  it('applies correct CSS classes for gote pieces', () => {
    const piece: Piece = {
      type: 'gold',
      player: 'gote',
      isPromoted: false
    }
    
    const wrapper = mount(ShogiPiece, { props: { piece } })
    const pieceElement = wrapper.find('.shogi-piece')
    expect(pieceElement.classes()).toContain('gote')
    expect(pieceElement.classes()).not.toContain('sente')
  })

  it('applies promoted class for promoted pieces', () => {
    const piece: Piece = {
      type: 'bishop',
      player: 'sente',
      isPromoted: true
    }
    
    const wrapper = mount(ShogiPiece, { props: { piece } })
    const pieceElement = wrapper.find('.shogi-piece')
    expect(pieceElement.classes()).toContain('promoted')
    expect(wrapper.find('.piece-character').text()).toBe('馬')
  })

  it('does not apply promoted class for non-promoted pieces', () => {
    const piece: Piece = {
      type: 'knight',
      player: 'gote',
      isPromoted: false
    }
    
    const wrapper = mount(ShogiPiece, { props: { piece } })
    const pieceElement = wrapper.find('.shogi-piece')
    expect(pieceElement.classes()).not.toContain('promoted')
  })
})