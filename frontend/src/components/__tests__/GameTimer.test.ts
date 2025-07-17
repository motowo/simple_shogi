import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import GameTimer from '../GameTimer.vue'

// タイマーのモック
vi.useFakeTimers()

describe('GameTimer', () => {
  beforeEach(() => {
    vi.clearAllTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  it('renders timer title and initial state', () => {
    const wrapper = mount(GameTimer, {
      props: {
        currentPlayer: 'sente',
        isGameOver: false
      }
    })

    expect(wrapper.find('.timer-title').text()).toBe('対局時間')
    expect(wrapper.find('.player-label').text()).toContain('後手')
    expect(wrapper.find('.elapsed-label').text()).toBe('経過時間')
  })

  it('displays formatted time correctly', () => {
    const wrapper = mount(GameTimer, {
      props: {
        currentPlayer: 'sente',
        isGameOver: false
      }
    })

    // 初期表示は00:00
    const timeDisplays = wrapper.findAll('.time-display')
    expect(timeDisplays[0].text()).toBe('00:00') // 後手
    expect(timeDisplays[1].text()).toBe('00:00') // 先手
  })

  it('shows active player with correct styling', () => {
    const wrapper = mount(GameTimer, {
      props: {
        currentPlayer: 'sente',
        isGameOver: false
      }
    })

    const senteTimer = wrapper.find('.player-timer.sente')
    const goteTimer = wrapper.find('.player-timer.gote')

    expect(senteTimer.classes()).toContain('active')
    expect(goteTimer.classes()).not.toContain('active')
  })

  it('updates timer every second', async () => {
    const wrapper = mount(GameTimer, {
      props: {
        currentPlayer: 'sente',
        isGameOver: false
      }
    })

    // 1秒進める
    vi.advanceTimersByTime(1000)
    await wrapper.vm.$nextTick()

    // 経過時間が更新されているはず
    const elapsedTime = wrapper.find('.elapsed-time')
    expect(elapsedTime.text()).toBe('00:01')
  })

  it('stops timer when game is over', () => {
    const wrapper = mount(GameTimer, {
      props: {
        currentPlayer: 'sente',
        isGameOver: false
      }
    })

    // ゲーム終了状態に変更
    wrapper.setProps({ isGameOver: true })

    // タイマーが停止されているかは内部実装のため、
    // activeクラスが消えることで確認
    const senteTimer = wrapper.find('.player-timer.sente')
    expect(senteTimer.classes()).not.toContain('active')
  })

  it('changes active player when currentPlayer prop changes', async () => {
    const wrapper = mount(GameTimer, {
      props: {
        currentPlayer: 'sente',
        isGameOver: false
      }
    })

    // 先手がアクティブ
    expect(wrapper.find('.player-timer.sente').classes()).toContain('active')
    expect(wrapper.find('.player-timer.gote').classes()).not.toContain('active')

    // 後手に変更
    await wrapper.setProps({ currentPlayer: 'gote' })

    // 後手がアクティブになる
    expect(wrapper.find('.player-timer.sente').classes()).not.toContain('active')
    expect(wrapper.find('.player-timer.gote').classes()).toContain('active')
  })

  it('exposes timer methods', () => {
    const wrapper = mount(GameTimer, {
      props: {
        currentPlayer: 'sente',
        isGameOver: false
      }
    })

    const vm = wrapper.vm as any
    expect(typeof vm.startGame).toBe('function')
    expect(typeof vm.stopTimer).toBe('function')
    expect(typeof vm.getSenteTotalTime).toBe('function')
    expect(typeof vm.getGoteTotalTime).toBe('function')
    expect(typeof vm.getGameElapsedTime).toBe('function')
  })

  it('formats time correctly for various durations', () => {
    const wrapper = mount(GameTimer, {
      props: {
        currentPlayer: 'sente',
        isGameOver: false
      }
    })

    const component = wrapper.vm as any

    // 内部のformatTimeメソッドをテスト
    expect(component.formatTime(0)).toBe('00:00')
    expect(component.formatTime(59)).toBe('00:59')
    expect(component.formatTime(60)).toBe('01:00')
    expect(component.formatTime(125)).toBe('02:05')
    expect(component.formatTime(3661)).toBe('61:01')
  })
})
