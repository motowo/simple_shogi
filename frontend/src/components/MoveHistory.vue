<template>
  <div class="move-history">
    <h3 class="history-title">手順</h3>
    <div class="history-content">
      <div v-if="moves.length === 0" class="no-moves">まだ手が指されていません</div>
      <div v-else class="moves-list">
        <div
          v-for="(move, index) in moves"
          :key="index"
          class="move-item"
          :class="{ 'current-move': index === moves.length - 1 }"
        >
          <span class="move-number">{{ index + 1 }}.</span>
          <span class="move-text">{{ formatMove(move) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Move } from '../types/shogi'
import { formatKifuPosition } from '../utils/boardUtils'
import { getPieceDisplayName } from '../utils/initialBoard'

interface Props {
  moves: Move[]
}

const props = defineProps<Props>()

const formatMove = (move: Move) => {
  const pieceChar = getPieceDisplayName(move.piece)
  const fromPos = formatKifuPosition(move.from)
  const toPos = formatKifuPosition(move.to)

  let moveText = `${pieceChar}${fromPos}-${toPos}`

  if (move.capturedPiece) {
    moveText += '取'
  }

  if (move.isPromotion) {
    moveText += '成'
  }

  return moveText
}
</script>

<style scoped>
.move-history {
  border: 2px solid #8b4513;
  border-radius: 8px;
  padding: 16px;
  margin: 8px;
  background-color: #faebd7;
  min-width: 200px;
  max-width: 300px;
  max-height: 400px;
}

.history-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #8b4513;
  text-align: center;
}

.history-content {
  max-height: 320px;
  overflow-y: auto;
}

.no-moves {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 20px;
}

.moves-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.move-item {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.move-item:hover {
  background-color: rgba(139, 69, 19, 0.1);
}

.move-item.current-move {
  background-color: rgba(74, 144, 226, 0.2);
  border: 1px solid #4a90e2;
}

.move-number {
  font-weight: bold;
  color: #8b4513;
  min-width: 30px;
  font-size: 14px;
}

.move-text {
  font-family: 'Yu Gothic', 'Hiragino Kaku Gothic Pro', sans-serif;
  font-size: 14px;
  color: #333;
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
</style>
