<template>
  <div 
    class="shogi-piece"
    :class="{
      'sente': piece.player === 'sente',
      'gote': piece.player === 'gote',
      'promoted': piece.isPromoted
    }"
  >
    <span class="piece-character">{{ displayName }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Piece } from '../types/shogi'
import { getPieceDisplayName } from '../utils/initialBoard'

interface Props {
  piece: Piece
}

const props = defineProps<Props>()

const displayName = computed(() => {
  return getPieceDisplayName(props.piece)
})
</script>

<style scoped>
.shogi-piece {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5deb3; /* 駒の色 */
  border: 2px solid #8b4513;
  border-radius: 8px;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
}

.shogi-piece:hover {
  background-color: #f0e68c;
  transform: scale(1.05);
}

.piece-character {
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
  font-family: 'Yu Gothic', 'Hiragino Kaku Gothic Pro', sans-serif;
  user-select: none;
}

/* 先手の駒は通常の向き */
.shogi-piece.sente {
  background-color: #f5deb3;
  border-color: #8b4513;
}

/* 後手の駒は上下反転 */
.shogi-piece.gote {
  background-color: #ffe4e1;
  border-color: #cd5c5c;
  transform: rotate(180deg);
}

.shogi-piece.gote:hover {
  background-color: #ffc0cb;
  transform: rotate(180deg) scale(1.05);
}

/* 成り駒の装飾 */
.shogi-piece.promoted {
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  border-color: #daa520;
  box-shadow: 0 0 4px rgba(255, 215, 0, 0.6);
}

.shogi-piece.promoted.gote {
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  border-color: #daa520;
}

.shogi-piece.promoted:hover {
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.8);
}
</style>