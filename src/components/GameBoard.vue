<script setup>
import { ref } from 'vue'
const emit = defineEmits(['end'])
const message = ref('Selecciona una opción para terminar el juego.')
function winGame() {
  message.value = '¡Has ganado!'
  emit('end', true)
}
function loseGame() {
  message.value = 'Intento fallido. Sigue jugando.'
  emit('end', false)
}
</script>

<template>
  <section class="game-board">
    <h2>Juego</h2>
    <p>{{ message }}</p>
    <div class="game-actions">
      <button type="button" @click="winGame">Ganar</button>
      <button type="button" @click="loseGame">Perder</button>
    </div>
  </section>
</template>

<style scoped>
.game-board {
  padding: 1.5rem;
  max-width: 560px;
  margin: 0 auto;
  text-align: center;
}
.game-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}
button {
  background: #2d6a4f;
  color: white;
  border: none;
  border-radius: 999px;
  padding: 0.8rem 1.2rem;
  cursor: pointer;
}
button:hover {
  background: #1a4731;
}
</style>
