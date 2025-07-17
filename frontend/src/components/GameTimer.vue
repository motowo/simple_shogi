<template>
  <div class="game-timer">
    <h3 class="timer-title">対局時間</h3>
    <div class="timer-display">
      <!-- 後手の時間 -->
      <div class="player-timer gote" :class="{ active: currentPlayer === 'gote' && !isGameOver }">
        <div class="player-label">後手</div>
        <div class="time-display">{{ formatTime(goteTotalTime) }}</div>
        <div class="think-time">考慮時間: {{ formatTime(goteThinkTime) }}</div>
      </div>

      <!-- 対局経過時間 -->
      <div class="game-elapsed">
        <div class="elapsed-label">経過時間</div>
        <div class="elapsed-time">{{ formatTime(gameElapsedTime) }}</div>
      </div>

      <!-- 先手の時間 -->
      <div class="player-timer sente" :class="{ active: currentPlayer === 'sente' && !isGameOver }">
        <div class="player-label">先手</div>
        <div class="time-display">{{ formatTime(senteTotalTime) }}</div>
        <div class="think-time">考慮時間: {{ formatTime(senteThinkTime) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { Player, GameInfo } from '../types/shogi'

interface Props {
  currentPlayer: Player
  isGameOver: boolean
  gameStartTime?: Date
}

const props = defineProps<Props>()

// 時間管理
const gameElapsedTime = ref(0) // ゲーム全体の経過時間（秒）
const senteTotalTime = ref(0) // 先手の合計時間（秒）
const goteTotalTime = ref(0) // 後手の合計時間（秒）
const senteThinkTime = ref(0) // 先手の現在の考慮時間（秒）
const goteThinkTime = ref(0) // 後手の現在の考慮時間（秒）

const turnStartTime = ref<Date | null>(null)
const gameStart = ref<Date | null>(null)
const gameEnd = ref<Date | null>(null)
const timerInterval = ref<NodeJS.Timeout | null>(null)
const gameId = ref<string>('')

// 時間をフォーマット（mm:ss形式）
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

// タイマー開始
const startTimer = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }

  timerInterval.value = setInterval(() => {
    const now = new Date()

    // ゲーム全体の経過時間を更新
    if (gameStart.value) {
      gameElapsedTime.value = Math.floor((now.getTime() - gameStart.value.getTime()) / 1000)
    }

    // 現在のプレイヤーの考慮時間を更新
    if (turnStartTime.value && !props.isGameOver) {
      const turnElapsed = Math.floor((now.getTime() - turnStartTime.value.getTime()) / 1000)

      if (props.currentPlayer === 'sente') {
        senteThinkTime.value = turnElapsed
      } else {
        goteThinkTime.value = turnElapsed
      }
    }
  }, 1000)
}

// タイマー停止
const stopTimer = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
}

// ゲーム開始
const startGame = () => {
  const now = new Date()
  gameStart.value = now
  gameEnd.value = null
  turnStartTime.value = now

  // ゲームIDを生成
  gameId.value = `game_${now.getTime()}`

  // 時間をリセット
  gameElapsedTime.value = 0
  senteTotalTime.value = 0
  goteTotalTime.value = 0
  senteThinkTime.value = 0
  goteThinkTime.value = 0

  startTimer()
}

// 手番変更時の処理
const onTurnChange = (newPlayer: Player) => {
  const now = new Date()

  // 前のプレイヤーの時間を合計に加算
  if (turnStartTime.value) {
    const turnTime = Math.floor((now.getTime() - turnStartTime.value.getTime()) / 1000)

    if (props.currentPlayer === 'sente') {
      senteTotalTime.value += senteThinkTime.value
      senteThinkTime.value = 0
    } else {
      goteTotalTime.value += goteThinkTime.value
      goteThinkTime.value = 0
    }
  }

  // 新しいプレイヤーの手番開始
  turnStartTime.value = now
}

// ゲーム終了時の処理
const onGameEnd = () => {
  gameEnd.value = new Date()

  // 最後のプレイヤーの時間を合計に加算
  if (turnStartTime.value) {
    const turnTime = Math.floor((gameEnd.value.getTime() - turnStartTime.value.getTime()) / 1000)

    if (props.currentPlayer === 'sente') {
      senteTotalTime.value += senteThinkTime.value
      senteThinkTime.value = 0
    } else {
      goteTotalTime.value += goteThinkTime.value
      goteThinkTime.value = 0
    }
  }

  stopTimer()
}

// ゲーム情報を取得
const getGameInfo = (
  winner?: Player,
  gameEndReason?: 'checkmate' | 'resign' | null,
  totalMoves: number = 0
): GameInfo => {
  return {
    id: gameId.value,
    startTime: gameStart.value || new Date(),
    endTime: gameEnd.value || undefined,
    winner,
    gameEndReason,
    totalMoves,
    senteTotalTime: senteTotalTime.value,
    goteTotalTime: goteTotalTime.value,
    gameElapsedTime: gameElapsedTime.value
  }
}

// プレイヤー変更を監視
watch(
  () => props.currentPlayer,
  (newPlayer, oldPlayer) => {
    if (oldPlayer && newPlayer !== oldPlayer) {
      onTurnChange(newPlayer)
    }
  }
)

// ゲーム終了を監視
watch(
  () => props.isGameOver,
  (isGameOver) => {
    if (isGameOver) {
      onGameEnd()
    }
  }
)

// 外部から呼び出し可能な関数を公開
defineExpose({
  startGame,
  stopTimer,
  getSenteTotalTime: () => senteTotalTime.value,
  getGoteTotalTime: () => goteTotalTime.value,
  getGameElapsedTime: () => gameElapsedTime.value,
  getGameInfo
})

onMounted(() => {
  startGame()
})

onUnmounted(() => {
  stopTimer()
})
</script>

<style scoped>
.game-timer {
  border: 2px solid #8b4513;
  border-radius: 8px;
  padding: 16px;
  margin: 8px;
  background-color: #faebd7;
  min-width: 200px;
}

.timer-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #8b4513;
  text-align: center;
}

.timer-display {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.player-timer {
  padding: 8px 12px;
  border: 2px solid #ccc;
  border-radius: 6px;
  background-color: #f9f9f9;
  transition: all 0.3s ease;
}

.player-timer.active {
  border-color: #4a90e2;
  background-color: #e6f2ff;
  box-shadow: 0 0 8px rgba(74, 144, 226, 0.3);
}

.player-timer.gote.active {
  border-color: #ff6b6b;
  background-color: #ffe6e6;
  box-shadow: 0 0 8px rgba(255, 107, 107, 0.3);
}

.player-label {
  font-size: 14px;
  font-weight: bold;
  color: #8b4513;
  margin-bottom: 4px;
}

.time-display {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  font-family: 'Courier New', monospace;
  text-align: center;
}

.think-time {
  font-size: 12px;
  color: #666;
  text-align: center;
  margin-top: 4px;
}

.game-elapsed {
  text-align: center;
  padding: 8px;
  background-color: rgba(139, 69, 19, 0.1);
  border-radius: 4px;
}

.elapsed-label {
  font-size: 12px;
  color: #8b4513;
  margin-bottom: 4px;
}

.elapsed-time {
  font-size: 16px;
  font-weight: bold;
  color: #8b4513;
  font-family: 'Courier New', monospace;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .game-timer {
    min-width: 150px;
  }

  .timer-display {
    gap: 8px;
  }

  .time-display {
    font-size: 18px;
  }

  .elapsed-time {
    font-size: 14px;
  }
}
</style>
