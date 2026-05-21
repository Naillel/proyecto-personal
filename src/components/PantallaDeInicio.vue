<script setup>
defineEmits(['start'])
</script>

<template>
  <section class="pantalla-inicio">
    <div class="carta-inicio">
      <span class="emoji"></span>
      <h1 class="titulo-inicio">TaxoQuest CR</h1>
      <p class="subtitulo-inicio">
        Adivina el animal secreto de la fauna costarricense.<br>
        Cada intento revela qué tan cerca estás en el árbol de la vida.
      </p>

      <div class="taxonomy-prevista">
        <span class="tax-badge">Reino</span>
        <span class="tax-badge">Filo</span>
        <span class="tax-badge">Clase</span>
        <span class="tax-badge">Orden</span>
        <span class="tax-badge">Familia</span>
        <span class="tax-badge">Género</span>
        <span class="tax-badge highlight">Especie ✓</span>
      </div>

      <button class="btn-start" @click="$emit('start')">
        ¡Jugar!
      </button>
    </div>
  </section>
</template>

<style scoped>
.pantalla-inicio {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #1a4731 0%, #2d6a4f 60%, #52b788 100%);
  padding: 1rem;
}

.carta-inicio {
  background: #fff;
  border-radius: 1.5rem;
  padding: 2.5rem 2rem;
  max-width: 420px;
  width: 100%;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0,0,0,.2);
}

.emoji  { font-size: 3.5rem; }
.titulo-inicio  { font-size: 2rem; font-weight: 800; color: #1a4731; margin: .5rem 0; }
.subtitulo-inicio { color: #555; line-height: 1.6; margin-bottom: 1.5rem; }

.taxonomy-prevista {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.tax-badge {
  background: #e9f5ee;
  color: #2d6a4f;
  border-radius: 999px;
  padding: .3rem .8rem;
  font-size: .8rem;
  font-weight: 600;
}

.tax-badge.highlight {
  background: #52b788;
  color: #fff;
}

.btn-start {
  background: #2d6a4f;
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: .9rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background .2s, transform .1s;

  &:hover  { background: #1a4731; }
  &:active { transform: scale(.97); }
}
</style>