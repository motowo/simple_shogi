<template>
  <div class="resign-button-container">
    <button class="resign-button" :disabled="isGameOver" @click="showConfirmation">投了</button>

    <!-- 投了確認ダイアログ -->
    <div v-if="showDialog" class="resign-confirmation-overlay">
      <div class="resign-confirmation">
        <h3 class="confirmation-title">投了確認</h3>
        <p class="confirmation-message">
          {{ currentPlayer === 'sente' ? '先手' : '後手' }}が投了しますか？
        </p>
        <p class="confirmation-note">
          投了すると{{ currentPlayer === 'sente' ? '後手' : '先手' }}の勝ちになります。
        </p>

        <div class="confirmation-buttons">
          <button class="confirm-button confirm-yes" @click="confirmResign">はい</button>
          <button class="confirm-button confirm-no" @click="cancelResign">いいえ</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Player } from '../types/shogi'

interface Props {
  currentPlayer: Player
  isGameOver: boolean
}

interface Emits {
  (e: 'resign', player: Player): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const showDialog = ref(false)

const showConfirmation = () => {
  if (!props.isGameOver) {
    showDialog.value = true
  }
}

const confirmResign = () => {
  emit('resign', props.currentPlayer)
  showDialog.value = false
}

const cancelResign = () => {
  showDialog.value = false
}
</script>

<style scoped>
.resign-button-container {
  position: relative;
}

.resign-button {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 80px;
}

.resign-button:hover:not(:disabled) {
  background-color: #c82333;
  transform: translateY(-1px);
}

.resign-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
  opacity: 0.6;
}

.resign-confirmation-overlay {
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

.resign-confirmation {
  background-color: white;
  border: 3px solid #8b4513;
  border-radius: 12px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.confirmation-title {
  font-size: 20px;
  font-weight: bold;
  color: #8b4513;
  margin-bottom: 16px;
}

.confirmation-message {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
}

.confirmation-note {
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
  font-style: italic;
}

.confirmation-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.confirm-button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 80px;
}

.confirm-yes {
  background-color: #dc3545;
  color: white;
}

.confirm-yes:hover {
  background-color: #c82333;
}

.confirm-no {
  background-color: #6c757d;
  color: white;
}

.confirm-no:hover {
  background-color: #5a6268;
}
</style>
