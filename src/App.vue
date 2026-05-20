<script setup>
import { ref } from 'vue'
import PantallaInicio from './components/PantallaDeInicio.vue'
import GameBoard   from './components/GameBoard.vue'
import PantallaResultados from './components/PantallaResultado.vue'

// 'start' | 'game' | 'result'
const screen = ref('start')
const isWon  = ref(false)

function handleStart() {
  screen.value = 'game'
}

function handleGameEnd(won) {
  isWon.value = won
  screen.value = 'result'
}

function handleRestart() {
  screen.value = 'start'
}
</script>

<template>
  <main class="app">
    <PantallaInicio
      v-if="screen === 'start'"
      @start="handleStart"
    />
    <GameBoard
      v-else-if="screen === 'game'"
      @end="handleGameEnd"
    />
    <PantallaResultados
      v-else-if="screen === 'result'"
      :is-won="isWon"
      @restart="handleRestart"
    />
  </main>
</template>