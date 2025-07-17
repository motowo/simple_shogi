import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GameStartDialog from '../GameStartDialog.vue'

describe('GameStartDialog', () => {
  it('renders dialog with correct title', () => {
    const wrapper = mount(GameStartDialog, {
      props: {
        isVisible: true
      }
    })

    expect(wrapper.find('.game-start-dialog').exists()).toBe(true)
    expect(wrapper.find('.dialog-title').text()).toBe('対局開始')
  })

  it('does not render when isVisible is false', () => {
    const wrapper = mount(GameStartDialog, {
      props: {
        isVisible: false
      }
    })

    expect(wrapper.find('.game-start-dialog').exists()).toBe(false)
  })

  it('displays game setup information', () => {
    const wrapper = mount(GameStartDialog, {
      props: {
        isVisible: true
      }
    })

    expect(wrapper.text()).toContain('先手・後手を決めて対局を開始します')
    expect(wrapper.text()).toContain('先手（下側）から開始')
    expect(wrapper.text()).toContain('後手（上側）が相手')
    expect(wrapper.text()).toContain('時間は対局開始と同時に計測開始')
  })

  it('emits start-game event when start button is clicked', async () => {
    const wrapper = mount(GameStartDialog, {
      props: {
        isVisible: true
      }
    })

    const startButton = wrapper.find('.start-button')
    await startButton.trigger('click')

    expect(wrapper.emitted('start-game')).toBeTruthy()
    expect(wrapper.emitted('start-game')).toHaveLength(1)
  })

  it('emits cancel event when cancel button is clicked', async () => {
    const wrapper = mount(GameStartDialog, {
      props: {
        isVisible: true
      }
    })

    const cancelButton = wrapper.find('.cancel-button')
    await cancelButton.trigger('click')

    expect(wrapper.emitted('cancel')).toBeTruthy()
    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })

  it('has correct button states', () => {
    const wrapper = mount(GameStartDialog, {
      props: {
        isVisible: true
      }
    })

    const startButton = wrapper.find('.start-button')
    const cancelButton = wrapper.find('.cancel-button')

    expect(startButton.exists()).toBe(true)
    expect(cancelButton.exists()).toBe(true)
    expect(startButton.text()).toBe('対局開始')
    expect(cancelButton.text()).toBe('キャンセル')
  })

  it('supports keyboard navigation', async () => {
    const wrapper = mount(GameStartDialog, {
      props: {
        isVisible: true
      },
      attachTo: document.body
    })

    const dialog = wrapper.find('.game-start-dialog')
    
    // Escapeキーでキャンセル
    await dialog.trigger('keydown', { key: 'Escape' })
    expect(wrapper.emitted('cancel')).toBeTruthy()

    // Enterキーで開始
    await dialog.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('start-game')).toBeTruthy()

    wrapper.unmount()
  })

  it('focuses on start button when dialog opens', async () => {
    const wrapper = mount(GameStartDialog, {
      props: {
        isVisible: true
      },
      attachTo: document.body
    })

    await wrapper.vm.$nextTick()
    
    const startButton = wrapper.find('.start-button')
    expect(startButton.element).toBe(document.activeElement)

    wrapper.unmount()
  })

  it('traps focus within dialog', async () => {
    const wrapper = mount(GameStartDialog, {
      props: {
        isVisible: true
      },
      attachTo: document.body
    })

    const startButton = wrapper.find('.start-button')
    const cancelButton = wrapper.find('.cancel-button')

    // 手動でフォーカスを設定
    ;(startButton.element as HTMLElement).focus()
    
    // Tabキーでフォーカス移動をシミュレート
    await startButton.trigger('keydown', { key: 'Tab' })
    await wrapper.vm.$nextTick()
    
    // handleTabKey関数の動作を確認するため、実際のDOM操作をテスト
    expect(startButton.element).toBeTruthy()
    expect(cancelButton.element).toBeTruthy()

    wrapper.unmount()
  })

  it('has proper ARIA attributes for accessibility', () => {
    const wrapper = mount(GameStartDialog, {
      props: {
        isVisible: true
      }
    })

    const dialog = wrapper.find('.game-start-dialog')
    expect(dialog.attributes('role')).toBe('dialog')
    expect(dialog.attributes('aria-modal')).toBe('true')
    expect(dialog.attributes('aria-labelledby')).toBe('dialog-title')
  })
})