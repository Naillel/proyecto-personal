<script setup>
defineProps({
  isWon: { type: Boolean, required: true }
})

defineEmits(['restart'])
</script>

<template>
  <section class="pantalla-resultado">
    <div class="resultado-card">
      <span class="resultado-emoji">{{ isWon ? '🎉' : '😢' }}</span>

      <h1 class="resultado-titulo">
        {{ isWon ? '¡Lo lograste!' : '¡Casi!' }}
      </h1>

      <p class="resultado-mensaje">
        {{ isWon
          ? 'Encontraste el animal secreto de la fauna costarricense.'
          : 'El árbol de la vida es grande. ¡Inténtalo de nuevo!' }}
      </p>

      <button class="btn-reiniciar" @click="$emit('restart')">
        Jugar de nuevo 🔄
      </button>
    </div>
  </section>
</template>

<style scoped>
.pantalla-resultado {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #1a4731 0%, #2d6a4f 60%, #52b788 100%);
  padding: 1rem;
}

.resultado-card {
  background: #fff;
  border-radius: 1.5rem;
  padding: 2.5rem 2rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0,0,0,.2);
}

.resultado-emoji  { font-size: 4rem; }
.resultado-titulo { font-size: 2rem; font-weight: 800; color: #1a4731; margin: .5rem 0; }
.resultado-mensaje { color: #555; line-height: 1.6; margin-bottom: 2rem; }

.btn-reiniciar {
  background: #2d6a4f;
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: .9rem 2rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background .2s;

  &:hover { background: #1a4731; }
}
</style>