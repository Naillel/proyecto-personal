<script setup>
defineProps({
  intento: { type: Object, required: true }
})

const EMOJIS = {
  correct: '🟢',
  warm:    '🟡',
  cold:    '⚪'
}
</script>

<template>
  <article class="taxonomy-row">
    <div class="animal-header">
      <img
        :src="intento.animal.imagen"
        :alt="intento.animal.nombre"
        class="animal-thumb"
      />
      <span class="animal-nombre">{{ intento.animal.nombre }}</span>
    </div>

    <div class="niveles">
      <div
        v-for="nivel in intento.niveles"
        :key="nivel.nivel"
        :class="['nivel-chip', nivel.calor]"
      >
        <span class="nivel-label">{{ nivel.nivel }}</span>
        <span class="nivel-valor">{{ nivel.valor }}</span>
        <span class="nivel-emoji">{{ EMOJIS[nivel.calor] }}</span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.taxonomy-row {
  background: #fff;
  border-radius: 1rem;
  padding: .8rem 1rem;
  display: flex;
  flex-direction: column;
  gap: .7rem;
  animation: slideIn .3s ease-out;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.animal-header {
  display: flex;
  align-items: center;
  gap: .7rem;
}

.animal-thumb {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: .5rem;
}

.animal-nombre {
  font-weight: 700;
  color: #1a4731;
  font-size: 1rem;
}

.niveles {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: .3rem;
}

.nivel-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: .4rem .2rem;
  border-radius: .6rem;
  font-size: .65rem;
  text-align: center;
  gap: .15rem;
}

.nivel-label {
  font-weight: 700;
  text-transform: capitalize;
  opacity: .7;
}

.nivel-valor {
  font-size: .6rem;
  word-break: break-word;
}

.nivel-emoji { font-size: .9rem; }

.nivel-chip.correct { background: #52b788; color: #fff; }
.nivel-chip.warm    { background: #f4a261; color: #fff; }
.nivel-chip.cold    { background: #e8e8e8; color: #555; }

/* Responsive: en móvil apila de a 4 */
@media (max-width: 500px) {
  .niveles { grid-template-columns: repeat(4, 1fr); }
}
</style>