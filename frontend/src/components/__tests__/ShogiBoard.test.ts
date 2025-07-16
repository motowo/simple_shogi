import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ShogiBoard from '../ShogiBoard.vue'

describe('ShogiBoard', () => {
  it('renders a 9x9 board', () => {
    const wrapper = mount(ShogiBoard)
    const cells = wrapper.findAll('.board-cell')
    expect(cells).toHaveLength(81) // 9x9 = 81マス
  })

  it('has proper board structure with rows and columns', () => {
    const wrapper = mount(ShogiBoard)
    const rows = wrapper.findAll('.board-row')
    expect(rows).toHaveLength(9)
    
    // 各行に9つのセルがあることを確認
    rows.forEach(row => {
      const cells = row.findAll('.board-cell')
      expect(cells).toHaveLength(9)
    })
  })

  it('cells have correct data attributes for position', () => {
    const wrapper = mount(ShogiBoard)
    const firstCell = wrapper.find('[data-row="0"][data-col="0"]')
    expect(firstCell.exists()).toBe(true)
    
    const lastCell = wrapper.find('[data-row="8"][data-col="8"]')
    expect(lastCell.exists()).toBe(true)
  })

  it('displays coordinate labels', () => {
    const wrapper = mount(ShogiBoard)
    
    // 列のラベル（9-1）
    const colLabels = wrapper.findAll('.col-label')
    expect(colLabels).toHaveLength(9)
    expect(colLabels[0].text()).toBe('9')
    expect(colLabels[8].text()).toBe('1')
    
    // 行のラベル（一-九）
    const rowLabels = wrapper.findAll('.row-label')
    expect(rowLabels).toHaveLength(9)
    expect(rowLabels[0].text()).toBe('一')
    expect(rowLabels[8].text()).toBe('九')
  })
})