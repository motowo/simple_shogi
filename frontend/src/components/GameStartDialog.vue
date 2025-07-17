<template>
  <div
    v-if="isVisible"
    class="game-start-overlay"
    @keydown="handleKeydown"
    @click="handleOverlayClick"
  >
    <div
      class="game-start-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      @click.stop
    >
      <div class="dialog-header">
        <h2 id="dialog-title" class="dialog-title">対局開始</h2>
      </div>

      <div class="dialog-content">
        <div class="game-info">
          <p class="main-message">先手・後手を決めて対局を開始します</p>
          
          <div class="game-rules">
            <div class="rule-item">
              <span class="rule-icon">🔸</span>
              <span>先手（下側）から開始</span>
            </div>
            <div class="rule-item">
              <span class="rule-icon">🔸</span>
              <span>後手（上側）が相手</span>
            </div>
            <div class="rule-item">
              <span class="rule-icon">🔸</span>
              <span>時間は対局開始と同時に計測開始</span>
            </div>
          </div>

          <div class="preparation-note">
            <p>準備ができたら「対局開始」ボタンを押してください</p>
          </div>
        </div>
      </div>

      <div class="dialog-actions">
        <button
          ref="startButton"
          class="start-button"
          type="button"
          @click="handleStartGame"
          @keydown.tab="handleTabKey"
        >
          対局開始
        </button>
        <button
          ref="cancelButton"
          class="cancel-button"
          type="button"
          @click="handleCancel"
          @keydown.tab="handleTabKey"
        >
          キャンセル
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'

interface Props {
  isVisible: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'start-game': []
  'cancel': []
}>()

const startButton = ref<HTMLElement | null>(null)
const cancelButton = ref<HTMLElement | null>(null)

const handleStartGame = () => {
  emit('start-game')
}

const handleCancel = () => {
  emit('cancel')
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    event.preventDefault()
    handleCancel()
  } else if (event.key === 'Enter') {
    event.preventDefault()
    handleStartGame()
  }
}

const handleTabKey = (event: KeyboardEvent) => {
  if (event.key === 'Tab') {
    event.preventDefault()
    const currentTarget = event.target as HTMLElement
    
    if (event.shiftKey) {
      // Shift+Tab: 逆方向
      if (currentTarget === startButton.value) {
        cancelButton.value?.focus()
      } else {
        startButton.value?.focus()
      }
    } else {
      // Tab: 順方向
      if (currentTarget === startButton.value) {
        cancelButton.value?.focus()
      } else {
        startButton.value?.focus()
      }
    }
  }
}

const handleOverlayClick = (event: MouseEvent) => {
  // オーバーレイクリックでキャンセル
  if (event.target === event.currentTarget) {
    handleCancel()
  }
}

const focusStartButton = async () => {
  await nextTick()
  startButton.value?.focus()
}

// ダイアログが表示されたときに最初のボタンにフォーカス
watch(
  () => props.isVisible,
  (isVisible) => {
    if (isVisible) {
      focusStartButton()
    }
  }
)

onMounted(() => {
  if (props.isVisible) {
    focusStartButton()
  }
})

// ダイアログの外側スクロール防止
watch(
  () => props.isVisible,
  (isVisible) => {
    if (isVisible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
)

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
.game-start-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.game-start-dialog {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  border: 2px solid #8b4513;
}

.dialog-header {
  padding: 24px 24px 16px;
  border-bottom: 1px solid #e0e0e0;
  text-align: center;
}

.dialog-title {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: #8b4513;
  font-family: 'Yu Gothic', 'Hiragino Kaku Gothic Pro', sans-serif;
}

.dialog-content {
  padding: 24px;
}

.game-info {
  text-align: center;
}

.main-message {
  font-size: 18px;
  color: #333;
  margin-bottom: 24px;
  font-weight: 500;
  line-height: 1.5;
}

.game-rules {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  text-align: left;
}

.rule-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 16px;
  color: #444;
}

.rule-item:last-child {
  margin-bottom: 0;
}

.rule-icon {
  margin-right: 8px;
  font-size: 14px;
}

.preparation-note {
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 8px;
}

.preparation-note p {
  margin: 0;
  font-size: 14px;
  color: #856404;
  font-weight: 500;
}

.dialog-actions {
  padding: 16px 24px 24px;
  display: flex;
  justify-content: center;
  gap: 16px;
}

.start-button,
.cancel-button {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
}

.start-button {
  background-color: #4a90e2;
  color: white;
  border: 2px solid #4a90e2;
}

.start-button:hover {
  background-color: #357abd;
  border-color: #357abd;
}

.start-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.3);
}

.cancel-button {
  background-color: #6c757d;
  color: white;
  border: 2px solid #6c757d;
}

.cancel-button:hover {
  background-color: #5a6268;
  border-color: #5a6268;
}

.cancel-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(108, 117, 125, 0.3);
}

/* アニメーション */
.game-start-overlay {
  animation: fadeIn 0.3s ease-out;
}

.game-start-dialog {
  animation: slideIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* レスポンシブデザイン */
@media (max-width: 768px) {
  .game-start-dialog {
    width: 95%;
    margin: 20px;
  }
  
  .dialog-header {
    padding: 20px 20px 12px;
  }
  
  .dialog-title {
    font-size: 20px;
  }
  
  .dialog-content {
    padding: 20px;
  }
  
  .main-message {
    font-size: 16px;
  }
  
  .rule-item {
    font-size: 14px;
  }
  
  .dialog-actions {
    padding: 12px 20px 20px;
    flex-direction: column;
  }
  
  .start-button,
  .cancel-button {
    width: 100%;
    min-width: auto;
  }
}

/* ダークモード対応 */
@media (prefers-color-scheme: dark) {
  .game-start-dialog {
    background-color: #2d3748;
    border-color: #a0aec0;
  }
  
  .dialog-title {
    color: #e2e8f0;
  }
  
  .main-message {
    color: #e2e8f0;
  }
  
  .rule-item {
    color: #cbd5e0;
  }
  
  .game-rules {
    background-color: #4a5568;
    border-color: #718096;
  }
  
  .preparation-note {
    background-color: #744210;
    border-color: #975a16;
  }
  
  .preparation-note p {
    color: #faf089;
  }
  
  .dialog-header {
    border-bottom-color: #4a5568;
  }
}

/* アクセシビリティ改善 */
@media (prefers-reduced-motion: reduce) {
  .game-start-overlay,
  .game-start-dialog {
    animation: none;
  }
  
  .start-button,
  .cancel-button {
    transition: none;
  }
}
</style>