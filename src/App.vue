<script setup>
import { ref } from 'vue'
import PantallaDeInicio   from './components/PantallaDeInicio.vue'
import GameBoard          from './components/GameBoard.vue'
import PantallaResultado  from './components/PantallaResultado.vue'

const screen = ref('start')
const isWon  = ref(false)
const secretoFinal = ref(null)
const resumeState = ref(null)

function handleStart() {
  screen.value = 'game'
}

function handleGameEnd(payload) {
  isWon.value = payload.isWon
  secretoFinal.value = payload.secreto
  // Guardar el estado completo para posible visualización de la partida
  resumeState.value = { secreto: payload.secreto, intentos: payload.intentos, isWon: payload.isWon, isGameOver: true }
  screen.value = 'result'
}

function handleRestart() {
  screen.value = 'start'
  secretoFinal.value = null
  resumeState.value = null
}

function handleView() {
  // Volver a la pantalla del juego mostrando la partida final
  screen.value = 'game'
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
      :resume-state="resumeState"
      @end="handleGameEnd"
    />
    <PantallaResultado
      v-else-if="screen === 'result'"
      :is-won="isWon"
      :secreto="secretoFinal"
      @restart="handleRestart"
      @view="handleView"
    />
  </main>
</template>