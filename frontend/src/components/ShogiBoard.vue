<template>
  <div class="shogi-board-container">
    <!-- 列ラベル（上部） -->
    <div class="col-labels">
      <div class="corner-spacer"></div>
      <div
        v-for="(label, index) in COL_LABELS"
        :key="`col-${index}`"
        class="col-label"
      >
        {{ label }}
      </div>
    </div>

    <!-- 盤面とサイドラベル -->
    <div class="board-with-labels">
      <!-- 行ラベル（左側） -->
      <div class="row-labels">
        <div
          v-for="(label, index) in ROW_LABELS"
          :key="`row-${index}`"
          class="row-label"
        >
          {{ label }}
        </div>
      </div>

      <!-- 将棋盤 -->
      <div class="shogi-board">
        <div
          v-for="(row, rowIndex) in board"
          :key="`row-${rowIndex}`"
          class="board-row"
        >
          <div
            v-for="(cell, colIndex) in row"
            :key="`cell-${rowIndex}-${colIndex}`"
            class="board-cell"
            :data-row="rowIndex"
            :data-col="colIndex"
            :class="{
              'highlighted': cell.isHighlighted,
              'selected': cell.isSelected
            }"
            @click="handleCellClick(rowIndex, colIndex)"
          >
            <!-- 駒がある場合の表示は後で実装 -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { BoardCell, Position } from '../types/shogi'
import { ROW_LABELS, COL_LABELS } from '../types/shogi'
import { initializeEmptyBoard, formatKifuPosition } from '../utils/boardUtils'

// 9x9の将棋盤を初期化
const board = ref<BoardCell[][]>([])

const initializeBoard = () => {
  board.value = initializeEmptyBoard()
}

const handleCellClick = (row: number, col: number) => {
  const position = { row, col }
  const kifuPosition = formatKifuPosition(position)
  console.log(`Clicked cell at ${kifuPosition} (row: ${row}, col: ${col})`)
  // クリック処理は後で実装
}

// コンポーネントマウント時に盤面を初期化
onMounted(() => {
  initializeBoard()
})
</script>

<style scoped>
.shogi-board-container {
  display: inline-block;
  font-family: 'Yu Gothic', 'Hiragino Kaku Gothic Pro', sans-serif;
  background-color: #f5f5dc; /* ベージュ色の背景 */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.col-labels {
  display: flex;
  margin-bottom: 8px;
}

.corner-spacer {
  width: 40px; /* 行ラベルの幅と同じ */
  height: 30px;
}

.col-label {
  width: 50px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  color: #333;
}

.board-with-labels {
  display: flex;
}

.row-labels {
  display: flex;
  flex-direction: column;
  margin-right: 8px;
}

.row-label {
  width: 40px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  color: #333;
}

.shogi-board {
  border: 3px solid #8b4513; /* 茶色の外枠 */
  background-color: #faebd7; /* 盤面の背景色 */
}

.board-row {
  display: flex;
}

.board-cell {
  width: 50px;
  height: 50px;
  border: 1px solid #8b4513;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  position: relative;
}

.board-cell:hover {
  background-color: rgba(255, 255, 0, 0.2);
}

.board-cell.highlighted {
  background-color: rgba(0, 255, 0, 0.3);
}

.board-cell.selected {
  background-color: rgba(255, 165, 0, 0.5);
  box-shadow: inset 0 0 0 2px #ff8c00;
}

/* 将棋盤の線を調整 */
.board-row:first-child .board-cell {
  border-top: 2px solid #8b4513;
}

.board-row:last-child .board-cell {
  border-bottom: 2px solid #8b4513;
}

.board-cell:first-child {
  border-left: 2px solid #8b4513;
}

.board-cell:last-child {
  border-right: 2px solid #8b4513;
}
</style>