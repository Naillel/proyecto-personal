<script setup>
import { onMounted } from 'vue'
import { useGameLogic } from '../composables/useGameLogic.js'
import GuessInput   from './GuessInput.vue'
import TaxonomyRow  from './TaxonomyRow.vue'

const emit = defineEmits(['end'])

const {
  intentos,
  isLoading,
  isGameOver,
  isWon,
  animalesDisponibles,
  iniciarJuego,
  hacerIntento
} = useGameLogic()

// Sonidos
const sonidos = {
  acierto:  new Audio('/sounds/Efecto acierto.mp3'),
  error:    new Audio('/sounds/Efecto error.mp3'),
  victoria: new Audio('/sounds/Victoria triunfante.mp3'),
}

onMounted(iniciarJuego)

function onGuess(animal) {
  hacerIntento(animal)

  const ultimo = intentos.value[0]

  if (ultimo.isGanador) {
    sonidos.victoria.play()
    setTimeout(() => emit('end', true), 1800)
  } else {
    const hayAlgunWarm = ultimo.niveles.some(n => n.calor !== 'cold')
    hayAlgunWarm
      ? sonidos.acierto.play()
      : sonidos.error.play()
  }
}
</script>

<template>
  <section class="game-board">
    <header class="game-header">
      <h1 class="game-title">🦜 TaxoQuest CR</h1>
      <p class="game-hint">Adivina el animal secreto de la fauna costarricense</p>
    </header>

    <div v-if="isLoading" class="loading">Cargando animales...</div>

    <template v-else>
      <GuessInput
        :animales-disponibles="animalesDisponibles"
        :disabled="isGameOver"
        @guess="onGuess"
      />

      <p class="intentos-count">
        {{ intentos.length }} intento{{ intentos.length !== 1 ? 's' : '' }}
      </p>

      <ul class="intentos-lista">
        <li v-for="(intento, i) in intentos" :key="i">
          <TaxonomyRow :intento="intento" />
        </li>
      </ul>
    </template>
  </section>
</template>

<style scoped>
.game-board {
  min-height: 100dvh;
  padding: 2rem 1rem 4rem;
  background: linear-gradient(135deg, #1a4731 0%, #2d6a4f 60%, #52b788 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
}

.game-header  { text-align: center; color: #fff; }
.game-title   { font-size: 1.8rem; font-weight: 800; margin: 0; }
.game-hint    { opacity: .85; margin: .3rem 0 0; }
.loading      { color: #fff; font-size: 1.2rem; }
.intentos-count { color: #d0f0e0; font-size: .9rem; margin: 0; }

.intentos-lista {
  width: 100%;
  max-width: 600px;
  list-style: none;
  margin: 0; padding: 0;
  display: flex;
  flex-direction: column;
  gap: .8rem;
}
</style>