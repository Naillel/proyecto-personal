<script setup>
const props = defineProps({
  isWon: {
    type: Boolean,
    required: true,
  },
})
const emit = defineEmits(['restart'])
function restart() {
  emit('restart')
}
</script>

<template>
  <section class="pantalla-resultado">
    <div class="resultado-contenedor">
      <h1>{{ isWon ? '¡Ganaste!' : 'Inténtalo de nuevo' }}</h1>
      <p>
        {{ isWon ? 'Has adivinado el animal secreto.' : 'El juego terminó, pero puedes volver a empezar.' }}
      </p>
      <button type="button" @click="restart">Reiniciar</button>
    </div>
  </section>
</template>

<style scoped>
.pantalla-resultado {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 1.5rem;
}
.resultado-contenedor {
  text-align: center;
  background: #fff;
  padding: 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 12px 40px rgba(0,0,0,0.12);
}
button {
  margin-top: 1.5rem;
  background: #2d6a4f;
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 0.9rem 2rem;
  cursor: pointer;
}
button:hover {
  background: #1a4731;
}
</style>
