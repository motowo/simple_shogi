<template>
  <div class="captured-pieces">
    <h3 class="title">{{ player === 'sente' ? '先手' : '後手' }}の持ち駒</h3>
    <div class="pieces-container">
      <div
        v-for="piece in droppablePieces"
        :key="piece.type"
        class="piece-item"
        :class="{ selectable: isSelectable }"
        @click="handlePieceClick(piece.type)"
      >
        <div class="piece-display">
          <span class="piece-character">{{ getPieceTypeDisplayName(piece.type) }}</span>
          <span v-if="piece.count > 1" class="piece-count">{{ piece.count }}</span>
        </div>
        <div class="piece-name">{{ getPieceTypeName(piece.type) }}</div>
      </div>
      <div v-if="droppablePieces.length === 0" class="no-pieces">なし</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Player, PieceType } from '../types/shogi'
import type { DroppablePiece } from '../utils/capturedPieces'
import { getPieceTypeDisplayName } from '../utils/initialBoard'

interface Props {
  player: Player
  droppablePieces: DroppablePiece[]
  isSelectable?: boolean
}

interface Emits {
  (e: 'pieceClick', pieceType: PieceType): void
}

const props = withDefaults(defineProps<Props>(), {
  isSelectable: false
})

const emit = defineEmits<Emits>()

const handlePieceClick = (pieceType: PieceType) => {
  if (props.isSelectable) {
    emit('pieceClick', pieceType)
  }
}

const getPieceTypeName = (pieceType: PieceType): string => {
  const names: Record<PieceType, string> = {
    pawn: '歩',
    lance: '香',
    knight: '桂',
    silver: '銀',
    gold: '金',
    bishop: '角',
    rook: '飛',
    king: '王'
  }
  return names[pieceType]
}
</script>

<style scoped>
.captured-pieces {
  border: 2px solid #8b4513;
  border-radius: 8px;
  padding: 16px;
  margin: 8px;
  background-color: #faebd7;
  min-width: 200px;
}

.title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #8b4513;
  text-align: center;
}

.pieces-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  min-height: 70px;
  align-items: flex-start;
  justify-content: center;
}

.piece-item {
  position: relative;
  cursor: default;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.piece-item.selectable {
  cursor: pointer;
}

.piece-item.selectable:hover {
  transform: scale(1.1);
}

.piece-display {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #f5deb3;
  border: 2px solid #8b4513;
  border-radius: 6px;
  position: relative;
  font-family: 'Yu Gothic', 'Hiragino Kaku Gothic Pro', sans-serif;
}

.piece-character {
  font-size: 16px;
  font-weight: bold;
  color: #2c3e50;
}

.piece-count {
  position: absolute;
  bottom: -2px;
  right: -2px;
  background-color: #ff4444;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
}

.piece-name {
  font-size: 12px;
  color: #8b4513;
  font-weight: bold;
  text-align: center;
  white-space: nowrap;
}

.no-pieces {
  color: #666;
  font-style: italic;
  text-align: center;
  width: 100%;
  padding: 16px;
}

/* 後手の持ち駒は上下反転 */
.captured-pieces[data-player='gote'] .piece-display {
  transform: rotate(180deg);
}
</style>
