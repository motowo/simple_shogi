<template>
  <div v-if="isVisible" class="promotion-dialog-overlay">
    <div class="promotion-dialog">
      <h3 class="dialog-title">成り駒にしますか？</h3>

      <div class="pieces-comparison">
        <div class="piece-option">
          <div class="piece-label">現在の駒</div>
          <div class="piece-display">
            <ShogiPiece :piece="piece" />
          </div>
          <div class="piece-name">{{ getPieceDisplayName(piece) }}</div>
        </div>

        <div class="arrow">→</div>

        <div class="piece-option">
          <div class="piece-label">成り駒</div>
          <div class="piece-display">
            <ShogiPiece :piece="promotedPiece" />
          </div>
          <div class="piece-name">{{ getPieceDisplayName(promotedPiece) }}</div>
        </div>
      </div>

      <div class="dialog-actions">
        <button class="action-button promote-button" @click="handlePromote">成る</button>
        <button
          v-if="!mustPromote"
          class="action-button no-promote-button"
          @click="handleNoPromote"
        >
          成らない
        </button>
      </div>

      <div v-if="mustPromote" class="force-promote-message">この駒は成る必要があります</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Piece } from '../types/shogi'
import { getPieceDisplayName } from '../utils/initialBoard'
import { promoteMovePiece } from '../utils/promotion'
import ShogiPiece from './ShogiPiece.vue'

interface Props {
  piece: Piece
  isVisible: boolean
  mustPromote: boolean
}

interface Emits {
  (e: 'promote'): void
  (e: 'noPromote'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const promotedPiece = computed(() => {
  return promoteMovePiece(props.piece)
})

const handlePromote = () => {
  emit('promote')
}

const handleNoPromote = () => {
  if (!props.mustPromote) {
    emit('noPromote')
  }
}
</script>

<style scoped>
.promotion-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.promotion-dialog {
  background-color: white;
  border: 3px solid #8b4513;
  border-radius: 12px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.dialog-title {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 24px;
  color: #8b4513;
}

.pieces-comparison {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 24px;
}

.piece-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.piece-label {
  font-size: 14px;
  color: #666;
  font-weight: bold;
}

.piece-display {
  padding: 8px;
  background-color: #f5f5dc;
  border-radius: 8px;
  border: 2px solid #ddd;
}

.piece-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.arrow {
  font-size: 24px;
  color: #8b4513;
  font-weight: bold;
}

.dialog-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.action-button {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 80px;
}

.promote-button {
  background-color: #4a90e2;
  color: white;
}

.promote-button:hover {
  background-color: #357abd;
}

.no-promote-button {
  background-color: #f5f5f5;
  color: #333;
  border: 2px solid #ddd;
}

.no-promote-button:hover {
  background-color: #e8e8e8;
}

.force-promote-message {
  margin-top: 16px;
  padding: 8px;
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  color: #856404;
  font-size: 14px;
  text-align: center;
}
</style>
