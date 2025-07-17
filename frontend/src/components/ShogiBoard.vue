<template>
  <div class="shogi-board-container">
    <!-- 後手の持ち駒 -->
    <CapturedPieces
      player="gote"
      :droppable-pieces="getDroppablePieces(capturedPieces, 'gote')"
      :is-selectable="currentPlayer === 'gote'"
      @piece-click="handleDropPieceSelect"
    />
    
    <!-- 現在のプレイヤー表示 -->
    <div class="current-player">
      現在の手番: {{ currentPlayer === 'sente' ? '先手' : '後手' }}
    </div>
    
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
            <ShogiPiece 
              v-if="cell.piece" 
              :piece="cell.piece" 
            />
          </div>
        </div>
      </div>
    </div>
    
    <!-- 先手の持ち駒 -->
    <CapturedPieces
      player="sente"
      :droppable-pieces="getDroppablePieces(capturedPieces, 'sente')"
      :is-selectable="currentPlayer === 'sente'"
      @piece-click="handleDropPieceSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { BoardCell, Position, Player, Piece, PieceType } from '../types/shogi'
import { ROW_LABELS, COL_LABELS } from '../types/shogi'
import { formatKifuPosition, isSamePosition } from '../utils/boardUtils'
import { initializeGameBoard } from '../utils/initialBoard'
import { getPossibleMoves, isValidMove } from '../utils/moveValidation'
import { 
  addCapturedPiece, 
  canDropPiece, 
  getDroppablePieces as getDroppablePiecesUtil,
  removeCapturedPiece 
} from '../utils/capturedPieces'
import ShogiPiece from './ShogiPiece.vue'
import CapturedPieces from './CapturedPieces.vue'

// 9x9の将棋盤を初期化
const board = ref<BoardCell[][]>([])
const selectedPosition = ref<Position | null>(null)
const currentPlayer = ref<Player>('sente')
const possibleMoves = ref<Position[]>([])
const capturedPieces = ref<Map<Player, Piece[]>>(new Map())
const selectedDropPiece = ref<PieceType | null>(null)

const initializeBoard = () => {
  board.value = initializeGameBoard()
  capturedPieces.value = new Map()
  capturedPieces.value.set('sente', [])
  capturedPieces.value.set('gote', [])
}

const getDroppablePieces = (capturedPieces: Map<Player, Piece[]>, player: Player) => {
  return getDroppablePiecesUtil(capturedPieces, player)
}

const clearSelection = () => {
  selectedPosition.value = null
  selectedDropPiece.value = null
  possibleMoves.value = []
  
  // 全てのセルの選択状態とハイライト状態をクリア
  board.value.forEach(row => {
    row.forEach(cell => {
      cell.isSelected = false
      cell.isHighlighted = false
    })
  })
}

const handleDropPieceSelect = (pieceType: PieceType) => {
  clearSelection()
  selectedDropPiece.value = pieceType
  
  // 駒を打てる位置をハイライト
  highlightDroppablePositions(pieceType)
  
  console.log(`Selected drop piece: ${pieceType}`)
}

const highlightDroppablePositions = (pieceType: PieceType) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const position = { row, col }
      if (canDropPiece(board.value, capturedPieces.value, currentPlayer.value, pieceType, position)) {
        board.value[row][col].isHighlighted = true
      }
    }
  }
}

const selectPiece = (row: number, col: number) => {
  const position = { row, col }
  const cell = board.value[row][col]
  
  // 駒がない場合は何もしない
  if (!cell.piece) return
  
  // 現在のプレイヤーの駒でない場合は何もしない
  if (cell.piece.player !== currentPlayer.value) return
  
  // 既に選択されている場合は選択解除
  if (selectedPosition.value && isSamePosition(selectedPosition.value, position)) {
    clearSelection()
    return
  }
  
  // 新しい駒を選択
  clearSelection()
  selectedPosition.value = position
  cell.isSelected = true
  
  // 可能な手を計算（仮実装：前方1マス）
  calculatePossibleMoves(position, cell.piece)
  
  console.log(`Selected piece at ${formatKifuPosition(position)}`)
}

const calculatePossibleMoves = (position: Position, piece: Piece) => {
  const moves = getPossibleMoves(board.value, position, piece)
  
  // 可能な手をハイライト表示
  moves.forEach(move => {
    board.value[move.row][move.col].isHighlighted = true
  })
  
  possibleMoves.value = moves
}

const handleCellClick = (row: number, col: number) => {
  const position = { row, col }
  const kifuPosition = formatKifuPosition(position)
  
  console.log(`Clicked cell at ${kifuPosition} (row: ${row}, col: ${col})`)
  
  // 駒打ちが選択されている場合
  if (selectedDropPiece.value) {
    if (canDropPiece(board.value, capturedPieces.value, currentPlayer.value, selectedDropPiece.value, position)) {
      // 駒打ち処理
      const droppedPiece: Piece = {
        type: selectedDropPiece.value,
        player: currentPlayer.value,
        isPromoted: false
      }
      
      board.value[row][col].piece = droppedPiece
      removeCapturedPiece(capturedPieces.value, currentPlayer.value, selectedDropPiece.value)
      
      // 手番を交代
      currentPlayer.value = currentPlayer.value === 'sente' ? 'gote' : 'sente'
      
      clearSelection()
      console.log(`Dropped ${selectedDropPiece.value} at ${kifuPosition}`)
    } else {
      clearSelection()
    }
    return
  }
  
  // 駒が選択されていない場合は駒を選択
  if (!selectedPosition.value) {
    selectPiece(row, col)
    return
  }
  
  // 駒が選択されている場合
  const cell = board.value[row][col]
  
  // 同じ駒をクリックした場合は選択解除
  if (isSamePosition(selectedPosition.value, position)) {
    clearSelection()
    return
  }
  
  // 自分の駒をクリックした場合は選択変更
  if (cell.piece && cell.piece.player === currentPlayer.value) {
    selectPiece(row, col)
    return
  }
  
  // 移動が有効かチェック
  if (isValidMove(board.value, selectedPosition.value, position)) {
    // 移動処理
    const selectedCell = board.value[selectedPosition.value.row][selectedPosition.value.col]
    const targetCell = board.value[row][col]
    
    // 駒を取る場合は持ち駒に追加
    if (targetCell.piece) {
      addCapturedPiece(capturedPieces.value, currentPlayer.value, targetCell.piece)
    }
    
    targetCell.piece = selectedCell.piece
    selectedCell.piece = null
    
    // 手番を交代
    currentPlayer.value = currentPlayer.value === 'sente' ? 'gote' : 'sente'
    
    clearSelection()
    console.log(`Moved to ${kifuPosition}`)
  } else {
    // 移動できない場合は選択解除
    clearSelection()
  }
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

.current-player {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #8b4513;
  margin-bottom: 16px;
  padding: 8px 16px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
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