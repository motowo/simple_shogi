<template>
  <div class="game-history">
    <div class="history-header">
      <h3 class="history-title">対局履歴</h3>
      <div class="history-controls">
        <button 
          class="stats-button"
          @click="showStats = !showStats"
          :disabled="history.length === 0"
        >
          統計{{ showStats ? '非表示' : '表示' }}
        </button>
        <button 
          class="clear-button"
          @click="handleClearHistory"
          :disabled="history.length === 0"
        >
          履歴クリア
        </button>
      </div>
    </div>

    <!-- 統計情報 -->
    <div v-if="showStats && history.length > 0" class="stats-section">
      <h4 class="stats-title">統計情報</h4>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-label">総対局数</div>
          <div class="stat-value">{{ stats.totalGames }}局</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">先手勝率</div>
          <div class="stat-value">{{ stats.senteWinRate.toFixed(1) }}%</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">後手勝率</div>
          <div class="stat-value">{{ stats.goteWinRate.toFixed(1) }}%</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">平均対局時間</div>
          <div class="stat-value">{{ formatGameTime(Math.round(stats.averageGameTime)) }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">平均手数</div>
          <div class="stat-value">{{ stats.averageMoves.toFixed(1) }}手</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">詰み勝利</div>
          <div class="stat-value">{{ stats.checkmateWins }}局</div>
        </div>
      </div>
    </div>

    <!-- 履歴一覧 -->
    <div class="history-content">
      <div v-if="history.length === 0" class="no-history">
        対局履歴がありません
      </div>
      <div v-else class="history-list">
        <div 
          v-for="game in paginatedHistory" 
          :key="game.id"
          class="history-item"
        >
          <div class="game-info">
            <div class="game-header">
              <span class="game-date">{{ formatGameDate(game.startTime) }}</span>
              <span class="game-result" :class="{ 
                'winner-sente': game.winner === 'sente',
                'winner-gote': game.winner === 'gote'
              }">
                {{ game.winner === 'sente' ? '先手' : '後手' }}勝利
              </span>
            </div>
            <div class="game-details">
              <span class="game-time">{{ formatGameTime(game.gameElapsedTime) }}</span>
              <span class="game-moves">{{ game.totalMoves }}手</span>
              <span class="game-reason">
                {{ game.gameEndReason === 'checkmate' ? '詰み' : '投了' }}
              </span>
            </div>
            <div class="player-times">
              <div class="player-time">
                <span class="player-label">先手:</span>
                <span class="time-value">{{ formatGameTime(game.senteTotalTime) }}</span>
              </div>
              <div class="player-time">
                <span class="player-label">後手:</span>
                <span class="time-value">{{ formatGameTime(game.goteTotalTime) }}</span>
              </div>
            </div>
          </div>
          <button 
            class="delete-button"
            @click="handleDeleteGame(game.id)"
            title="この対局を削除"
          >
            ×
          </button>
        </div>
      </div>
    </div>

    <!-- ページネーション -->
    <div v-if="history.length > itemsPerPage" class="pagination">
      <button 
        @click="currentPage--"
        :disabled="currentPage === 1"
        class="page-button"
      >
        前へ
      </button>
      <span class="page-info">
        {{ currentPage }} / {{ totalPages }}
      </span>
      <button 
        @click="currentPage++"
        :disabled="currentPage === totalPages"
        class="page-button"
      >
        次へ
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getGameHistory, clearGameHistory, removeGameFromHistory, calculateStats, formatGameTime, formatGameDate } from '../utils/gameStorage'
import type { GameInfo } from '../types/shogi'

// 履歴データ
const history = ref<GameInfo[]>([])
const showStats = ref(false)
const currentPage = ref(1)
const itemsPerPage = 10

// 統計情報
const stats = computed(() => calculateStats(history.value))

// ページネーション
const totalPages = computed(() => Math.ceil(history.value.length / itemsPerPage))
const paginatedHistory = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return history.value.slice(start, end)
})

// 履歴を読み込み
const loadHistory = () => {
  history.value = getGameHistory()
}

// 履歴をクリア
const handleClearHistory = () => {
  if (confirm('対局履歴を全て削除しますか？')) {
    clearGameHistory()
    loadHistory()
    showStats.value = false
    currentPage.value = 1
  }
}

// 個別のゲームを削除
const handleDeleteGame = (gameId: string) => {
  if (confirm('この対局を削除しますか？')) {
    removeGameFromHistory(gameId)
    loadHistory()
    
    // 現在のページに表示するアイテムがなくなった場合、前のページに戻る
    if (paginatedHistory.value.length === 0 && currentPage.value > 1) {
      currentPage.value--
    }
  }
}

// 外部から履歴を更新するためのメソッドを公開
defineExpose({
  loadHistory
})

onMounted(() => {
  loadHistory()
})
</script>

<style scoped>
.game-history {
  border: 2px solid #8b4513;
  border-radius: 8px;
  padding: 16px;
  background-color: #faebd7;
  max-height: 600px;
  display: flex;
  flex-direction: column;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.history-title {
  font-size: 16px;
  font-weight: bold;
  color: #8b4513;
  margin: 0;
}

.history-controls {
  display: flex;
  gap: 8px;
}

.stats-button, .clear-button {
  padding: 4px 8px;
  font-size: 12px;
  border: 1px solid #8b4513;
  border-radius: 4px;
  background-color: #f5deb3;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.stats-button:hover:not(:disabled), .clear-button:hover:not(:disabled) {
  background-color: #deb887;
}

.stats-button:disabled, .clear-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.stats-section {
  margin-bottom: 16px;
  padding: 12px;
  background-color: rgba(139, 69, 19, 0.1);
  border-radius: 4px;
}

.stats-title {
  font-size: 14px;
  font-weight: bold;
  color: #8b4513;
  margin: 0 0 8px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 11px;
  color: #666;
  margin-bottom: 2px;
}

.stat-value {
  font-size: 14px;
  font-weight: bold;
  color: #8b4513;
}

.history-content {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.no-history {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 40px 20px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
}

.game-info {
  flex: 1;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.game-date {
  font-size: 12px;
  color: #666;
}

.game-result {
  font-weight: bold;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 3px;
}

.game-result.winner-sente {
  background-color: #e6f2ff;
  color: #1e90ff;
}

.game-result.winner-gote {
  background-color: #ffe6e6;
  color: #ff6b6b;
}

.game-details {
  display: flex;
  gap: 12px;
  margin-bottom: 4px;
  font-size: 11px;
  color: #666;
}

.player-times {
  display: flex;
  gap: 16px;
  font-size: 11px;
}

.player-time {
  display: flex;
  gap: 4px;
}

.player-label {
  color: #666;
}

.time-value {
  font-family: 'Courier New', monospace;
  color: #333;
}

.delete-button {
  padding: 4px 8px;
  font-size: 14px;
  color: #ff6b6b;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 3px;
  transition: background-color 0.2s ease;
}

.delete-button:hover {
  background-color: #ffe6e6;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #ddd;
}

.page-button {
  padding: 4px 8px;
  font-size: 12px;
  border: 1px solid #8b4513;
  border-radius: 4px;
  background-color: #f5deb3;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.page-button:hover:not(:disabled) {
  background-color: #deb887;
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 12px;
  color: #666;
  min-width: 60px;
  text-align: center;
}

/* スクロールバーのスタイリング */
.history-content::-webkit-scrollbar {
  width: 6px;
}

.history-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.history-content::-webkit-scrollbar-thumb {
  background: #8b4513;
  border-radius: 3px;
}

.history-content::-webkit-scrollbar-thumb:hover {
  background: #654321;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .game-details {
    flex-direction: column;
    gap: 4px;
  }
  
  .player-times {
    flex-direction: column;
    gap: 4px;
  }
}
</style>