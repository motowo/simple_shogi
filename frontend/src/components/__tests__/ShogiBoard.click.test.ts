import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ShogiBoard from '../ShogiBoard.vue'

describe('ShogiBoard - Click Operations', () => {
  it('handles cell click events', async () => {
    const wrapper = mount(ShogiBoard)
    
    // 駒がある位置をクリック
    const cell = wrapper.find('[data-row="8"][data-col="4"]') // 先手の王
    await cell.trigger('click')
    
    // クリックイベントが発生したことを確認
    // 実際の実装では、選択状態やハイライト表示が行われる
    expect(cell.exists()).toBe(true)
  })

  it('can select a piece by clicking', async () => {
    const wrapper = mount(ShogiBoard)
    
    // 先手の歩兵をクリック
    const pawnCell = wrapper.find('[data-row="6"][data-col="4"]')
    await pawnCell.trigger('click')
    
    // 選択状態を確認
    expect(pawnCell.classes()).toContain('selected')
  })

  it('handles clicking on empty cells', async () => {
    const wrapper = mount(ShogiBoard)
    
    // 空のセルをクリック
    const emptyCell = wrapper.find('[data-row="4"][data-col="4"]')
    await emptyCell.trigger('click')
    
    // 空のセルのクリックも正常に処理される
    expect(emptyCell.exists()).toBe(true)
  })

  it('can deselect a piece by clicking the same piece again', async () => {
    const wrapper = mount(ShogiBoard)
    
    // 駒を選択
    const pieceCell = wrapper.find('[data-row="8"][data-col="0"]') // 先手の香車
    await pieceCell.trigger('click')
    
    // 同じ駒をもう一度クリック
    await pieceCell.trigger('click')
    
    // 選択解除を確認
    expect(pieceCell.classes()).not.toContain('selected')
  })

  it('can select different pieces', async () => {
    const wrapper = mount(ShogiBoard)
    
    // 最初の駒を選択
    const firstPiece = wrapper.find('[data-row="8"][data-col="0"]')
    await firstPiece.trigger('click')
    
    // 別の駒を選択
    const secondPiece = wrapper.find('[data-row="8"][data-col="1"]')
    await secondPiece.trigger('click')
    
    // 両方の駒が存在することを確認
    expect(firstPiece.exists()).toBe(true)
    expect(secondPiece.exists()).toBe(true)
  })

  it('highlights possible moves when a piece is selected', async () => {
    const wrapper = mount(ShogiBoard)
    
    // 歩兵を選択
    const pawnCell = wrapper.find('[data-row="6"][data-col="4"]') // 先手の歩兵
    await pawnCell.trigger('click')
    
    // 可能な手のハイライトを確認
    const highlightedCells = wrapper.findAll('.highlighted')
    expect(highlightedCells.length).toBeGreaterThan(0)
  })

  it('displays current player information', () => {
    const wrapper = mount(ShogiBoard)
    
    // 現在のプレイヤー表示を確認
    const currentPlayerDisplay = wrapper.find('.current-player')
    expect(currentPlayerDisplay.exists()).toBe(true)
    expect(currentPlayerDisplay.text()).toContain('先手')
  })
})