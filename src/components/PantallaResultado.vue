<script setup>
import placeholder from '../assets/placeholder.svg'

const props = defineProps({
  isWon:   { type: Boolean, required: true },
  secreto: { type: Object, default: null }
})

const emit = defineEmits(['restart', 'view'])

function onImgError(e) {
  e.target.src = placeholder
}
</script>

<template>
  <section class="resultado">
    <div class="resultado-card">
      <span :class="['resultado-banner', isWon ? 'ganaste' : 'perdiste']">
        {{ isWon ? '¡Lo lograste!' : '¡Casi!' }}
      </span>

      <img
        v-if="secreto"
        :src="secreto.imagen"
        :alt="secreto.nombre"
        class="secreto-img"
        @error="onImgError"
      />

      <h1 class="secreto-nombre">{{ secreto?.nombre ?? 'Animal secreto' }}</h1>
      <p class="secreto-cientifico">{{ secreto?.nombreCientifico ?? '—' }}</p>

      <div class="taxonomia-grid" v-if="secreto">
        <div class="tax-item" v-for="(valor, clave) in secreto.taxonomia" :key="clave">
          <span class="tax-key">{{ clave }}</span>
          <span class="tax-val">{{ valor }}</span>
        </div>
      </div>

      <div style="width:100%; display:flex; gap:.6rem;">
        <button class="btn-ver-partida" @click="emit('view')">
          Ver partida
        </button>
        <button class="btn-reiniciar" @click="emit('restart')">
          Jugar de nuevo
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.resultado {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  background: linear-gradient(180deg, #f8fdf8 0%, #eef7ee 100%);
  padding: 1.5rem;
}

.resultado-card {
  background: #ffffff;
  border: 1px solid rgba(45, 106, 79, 0.14);
  border-radius: 20px;
  padding: 2rem;
  max-width: 520px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 20px 42px rgba(45, 106, 79, .1);
}

.resultado-banner {
  font-size: 1.3rem;
  font-weight: 800;
  padding: .7rem 1.4rem;
  border-radius: 999px;
}

.resultado-banner.ganaste { background: #dcfce7; color: #12351d; }
.resultado-banner.perdiste { background: #fee2e2; color: #7f1d1d; }

.secreto-img {
  width: 140px;
  height: 140px;
  object-fit: cover;
  border-radius: 16px;
  border: 2px solid var(--border);
  background: var(--code-bg);
}

.secreto-nombre {
  font-size: 1.5rem;
  font-weight: 800;
  color: #000000;
  margin: 0;
  text-align: center;
}

.secreto-cientifico {
  font-size: .9rem;
  font-style: italic;
  color: #111111;
  opacity: .8;
  margin: -.4rem 0 0;
}

.taxonomia-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: .5rem;
  width: 100%;
}

.tax-item {
  background: var(--code-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: .65rem .85rem;
  display: flex;
  flex-direction: column;
  gap: .2rem;
}

.tax-key {
  font-size: .68rem;
  font-weight: 700;
  text-transform: capitalize;
  color: var(--accent);
}

.tax-val {
  font-size: .92rem;
  font-weight: 600;
  color: var(--text-h);
}

.btn-reiniciar {
  width: 100%;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: .95rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity .2s, transform .1s;
}

.btn-reiniciar:hover { opacity: .9; transform: translateY(-1px); }

.btn-ver-partida {
  width: 100%;
  background: none;
  border: 1px solid rgba(45,106,79,.25);
  border-radius: 12px;
  color: var(--accent);
  padding: .95rem;
  font-weight: 700;
  cursor: pointer;
  transition: background .15s;
}

.btn-ver-partida:hover { background: rgba(45,106,79,.06); }
</style>
