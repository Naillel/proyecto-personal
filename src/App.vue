<script setup>
import { ref } from 'vue'
import PantallaDeInicio   from './components/PantallaDeInicio.vue'
import GameBoard          from './components/GameBoard.vue'
import PantallaResultado  from './components/PantallaResultado.vue'

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
    <PantallaDeInicio
      v-if="screen === 'start'"
      @start="handleStart"
    />
    <GameBoard
      v-else-if="screen === 'game'"
      @end="handleGameEnd"
    />
    <PantallaResultado
      v-else-if="screen === 'result'"
      :is-won="isWon"
      @restart="handleRestart"
    />
  </main>
</template>