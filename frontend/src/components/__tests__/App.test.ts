import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../../App.vue'

describe('App', () => {
  it('renders properly', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('シンプル将棋')
  })

  it('displays ShogiBoard component', () => {
    const wrapper = mount(App)
    const shogiBoard = wrapper.findComponent({ name: 'ShogiBoard' })
    expect(shogiBoard.exists()).toBe(true)
  })

  it('has proper layout structure', () => {
    const wrapper = mount(App)
    const gameContainer = wrapper.find('.game-container')
    expect(gameContainer.exists()).toBe(true)
  })
})
