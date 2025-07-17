import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ResignButton from '../ResignButton.vue'
import type { Player } from '../../types/shogi'

describe('ResignButton', () => {
  it('renders correctly for sente player', () => {
    const wrapper = mount(ResignButton, {
      props: {
        currentPlayer: 'sente',
        isGameOver: false
      }
    })

    expect(wrapper.find('.resign-button').exists()).toBe(true)
    expect(wrapper.find('.resign-button').text()).toBe('投了')
  })

  it('is disabled when game is over', () => {
    const wrapper = mount(ResignButton, {
      props: {
        currentPlayer: 'sente',
        isGameOver: true
      }
    })

    const button = wrapper.find('.resign-button')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('is enabled when game is active', () => {
    const wrapper = mount(ResignButton, {
      props: {
        currentPlayer: 'gote',
        isGameOver: false
      }
    })

    const button = wrapper.find('.resign-button')
    expect(button.attributes('disabled')).toBeUndefined()
  })

  it('shows confirmation dialog when clicked', async () => {
    const wrapper = mount(ResignButton, {
      props: {
        currentPlayer: 'sente',
        isGameOver: false
      }
    })

    await wrapper.find('.resign-button').trigger('click')

    expect(wrapper.find('.resign-confirmation').exists()).toBe(true)
    expect(wrapper.find('.confirmation-message').text()).toContain('投了しますか？')
  })

  it('emits resign event when confirmed', async () => {
    const wrapper = mount(ResignButton, {
      props: {
        currentPlayer: 'sente',
        isGameOver: false
      }
    })

    // 投了ボタンをクリック
    await wrapper.find('.resign-button').trigger('click')

    // 確認ダイアログで「はい」をクリック
    await wrapper.find('.confirm-yes').trigger('click')

    expect(wrapper.emitted('resign')).toHaveLength(1)
    expect(wrapper.emitted('resign')![0]).toEqual(['sente'])
  })

  it('does not emit resign event when cancelled', async () => {
    const wrapper = mount(ResignButton, {
      props: {
        currentPlayer: 'gote',
        isGameOver: false
      }
    })

    // 投了ボタンをクリック
    await wrapper.find('.resign-button').trigger('click')

    // 確認ダイアログで「いいえ」をクリック
    await wrapper.find('.confirm-no').trigger('click')

    expect(wrapper.emitted('resign')).toBeUndefined()
  })

  it('hides confirmation dialog when cancelled', async () => {
    const wrapper = mount(ResignButton, {
      props: {
        currentPlayer: 'sente',
        isGameOver: false
      }
    })

    // 投了ボタンをクリック
    await wrapper.find('.resign-button').trigger('click')
    expect(wrapper.find('.resign-confirmation').exists()).toBe(true)

    // 確認ダイアログで「いいえ」をクリック
    await wrapper.find('.confirm-no').trigger('click')
    expect(wrapper.find('.resign-confirmation').exists()).toBe(false)
  })

  it('displays current player in confirmation message', async () => {
    const wrapper = mount(ResignButton, {
      props: {
        currentPlayer: 'gote',
        isGameOver: false
      }
    })

    await wrapper.find('.resign-button').trigger('click')

    const message = wrapper.find('.confirmation-message').text()
    expect(message).toContain('後手')
    expect(message).toContain('投了しますか？')
  })
})
