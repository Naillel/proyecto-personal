<script setup>
import placeholder from '../assets/placeholder.svg'

defineProps({
  intento: { type: Object, required: true }
})

function onImgError(e) { e.target.src = placeholder }
</script>

<template>
  <article class="t-row">
    <div class="t-header">
      <img
        :src="intento.animal.imagen"
        :alt="intento.animal.nombre"
        class="t-img"
        @error="onImgError"
      />
      <div class="t-meta">
        <span class="t-nombre">{{ intento.animal.nombre }}</span>
        <span class="t-cientifico">{{ intento.animal.nombreCientifico }}</span>
      </div>
    </div>

    <div class="t-niveles">
      <div
        v-for="nivel in intento.niveles"
        :key="nivel.nivel"
        :class="['t-chip', nivel.calor]"
        :title="`${nivel.nivel}: ${nivel.valor}`"
      >
        <span class="t-chip-label">{{ nivel.nivel }}</span>
        <span :class="['t-chip-dot', nivel.calor]" />
      </div>
    </div>
  </article>
</template>

<style scoped>
.t-row {
  background: #161d17;
  border: 1px solid rgba(149,159,3,.15);
  border-radius: 4px;
  padding: .75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: .6rem;
  animation: slideIn .25s cubic-bezier(.22,1,.36,1);
  font-family: 'Roboto Condensed', system-ui, sans-serif;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-10px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Header */
.t-header {
  display: flex;
  align-items: center;
  gap: .7rem;
}

.t-img {
  width: 42px;
  height: 42px;
  object-fit: cover;
  border-radius: 3px;
  flex-shrink: 0;
  background: #1e271f;
  border: 1px solid rgba(149,159,3,.2);
}

.t-meta {
  display: flex;
  flex-direction: column;
  gap: .1rem;
}

.t-nombre {
  font-weight: 700;
  font-size: .9rem;
  color: #d0d8d0;
  letter-spacing: .5px;
  text-transform: uppercase;
}

.t-cientifico {
  font-size: .72rem;
  font-style: italic;
  color: #556055;
}

/* Grid de niveles */
.t-niveles {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: .2rem;
}

.t-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: .35rem .1rem;
  border-radius: 3px;
  gap: .25rem;
  border: 1px solid transparent;
  transition: transform .15s;

  &:hover { transform: translateY(-1px); }
}

.t-chip-label {
  font-size: .55rem;
  font-weight: 700;
  text-transform: capitalize;
  letter-spacing: .5px;
  line-height: 1;
}

.t-chip-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Estados */
.t-chip.correct {
  background: rgba(82,183,136,.18);
  border-color: rgba(82,183,136,.4);
  .t-chip-label { color: #a8f0cc; }
  .t-chip-dot   { background: #52b788; }
}

.t-chip.warm {
  background: rgba(244,162,97,.15);
  border-color: rgba(244,162,97,.35);
  .t-chip-label { color: #fcd9b4; }
  .t-chip-dot   { background: #f4a261; }
}

.t-chip.cold {
  background: rgba(255,255,255,.03);
  border-color: rgba(255,255,255,.06);
  .t-chip-label { color: #445044; }
  .t-chip-dot   { background: rgba(255,255,255,.1); }
}

@media (max-width: 480px) {
  .t-niveles { grid-template-columns: repeat(4, 1fr); }
}
</style>