import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ResetButton from '../ResetButton.vue'

describe('ResetButton', () => {
  it('renders correctly', () => {
    const wrapper = mount(ResetButton)

    expect(wrapper.find('.reset-button').exists()).toBe(true)
    expect(wrapper.find('.reset-button').text()).toBe('局面リセット')
  })

  it('shows confirmation dialog when clicked', async () => {
    const wrapper = mount(ResetButton)

    await wrapper.find('.reset-button').trigger('click')

    expect(wrapper.find('.reset-confirmation').exists()).toBe(true)
    expect(wrapper.find('.confirmation-message').text()).toContain('局面をリセットしますか？')
  })

  it('emits reset event when confirmed', async () => {
    const wrapper = mount(ResetButton)

    // リセットボタンをクリック
    await wrapper.find('.reset-button').trigger('click')

    // 確認ダイアログで「はい」をクリック
    await wrapper.find('.confirm-yes').trigger('click')

    expect(wrapper.emitted('reset')).toHaveLength(1)
  })

  it('does not emit reset event when cancelled', async () => {
    const wrapper = mount(ResetButton)

    // リセットボタンをクリック
    await wrapper.find('.reset-button').trigger('click')

    // 確認ダイアログで「いいえ」をクリック
    await wrapper.find('.confirm-no').trigger('click')

    expect(wrapper.emitted('reset')).toBeUndefined()
  })

  it('hides confirmation dialog when cancelled', async () => {
    const wrapper = mount(ResetButton)

    // リセットボタンをクリック
    await wrapper.find('.reset-button').trigger('click')
    expect(wrapper.find('.reset-confirmation').exists()).toBe(true)

    // 確認ダイアログで「いいえ」をクリック
    await wrapper.find('.confirm-no').trigger('click')
    expect(wrapper.find('.reset-confirmation').exists()).toBe(false)
  })

  it('hides confirmation dialog after confirming', async () => {
    const wrapper = mount(ResetButton)

    // リセットボタンをクリック
    await wrapper.find('.reset-button').trigger('click')
    expect(wrapper.find('.reset-confirmation').exists()).toBe(true)

    // 確認ダイアログで「はい」をクリック
    await wrapper.find('.confirm-yes').trigger('click')
    expect(wrapper.find('.reset-confirmation').exists()).toBe(false)
  })

  it('displays warning message about game state', async () => {
    const wrapper = mount(ResetButton)

    await wrapper.find('.reset-button').trigger('click')

    const message = wrapper.find('.confirmation-note').text()
    expect(message).toContain('現在の局面が失われます')
  })
})
