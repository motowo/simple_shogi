<template>
  <div class="reset-button-container">
    <button class="reset-button" @click="showConfirmation">局面リセット</button>

    <!-- リセット確認ダイアログ -->
    <div v-if="showDialog" class="reset-confirmation-overlay">
      <div class="reset-confirmation">
        <h3 class="confirmation-title">リセット確認</h3>
        <p class="confirmation-message">局面をリセットしますか？</p>
        <p class="confirmation-note">現在の局面が失われ、初期配置に戻ります。</p>

        <div class="confirmation-buttons">
          <button class="confirm-button confirm-yes" @click="confirmReset">はい</button>
          <button class="confirm-button confirm-no" @click="cancelReset">いいえ</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Emits {
  (e: 'reset'): void
}

const emit = defineEmits<Emits>()

const showDialog = ref(false)

const showConfirmation = () => {
  showDialog.value = true
}

const confirmReset = () => {
  emit('reset')
  showDialog.value = false
}

const cancelReset = () => {
  showDialog.value = false
}
</script>

<style scoped>
.reset-button-container {
  position: relative;
}

.reset-button {
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
}

.reset-button:hover {
  background-color: #5a6268;
  transform: translateY(-1px);
}

.reset-confirmation-overlay {
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

.reset-confirmation {
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
  background-color: #6c757d;
  color: white;
}

.confirm-yes:hover {
  background-color: #5a6268;
}

.confirm-no {
  background-color: #28a745;
  color: white;
}

.confirm-no:hover {
  background-color: #218838;
}
</style>
