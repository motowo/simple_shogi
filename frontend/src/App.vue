<template>
  <div id="app">
    <h1>シンプル将棋</h1>
    <div class="game-container">
      <ShogiBoard />
    </div>
  </div>
</template>

<script setup lang="ts">
import ShogiBoard from './components/ShogiBoard.vue'
</script>

<style scoped>
#app {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
  text-align: center;
  color: #2c3e50;
  padding: 20px;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #8b4513;
}

.game-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 600px;
}
</style>
