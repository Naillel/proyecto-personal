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

      <p class="resultado-kicker">
        {{ isWon ? '🇨🇷 FAUNA COSTARRICENSE' : '🇨🇷 FAUNA COSTARRICENSE' }}
      </p>
      <div class="resultado-linea" />

      <span :class="['resultado-banner', isWon ? 'ganaste' : 'perdiste']">
        {{ isWon ? '¡Animal encontrado!' : '¡Casi lo logras!' }}
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
        <div
          class="tax-item"
          v-for="(valor, clave) in secreto.taxonomia"
          :key="clave"
        >
          <span class="tax-key">{{ clave }}</span>
          <span class="tax-val">{{ valor }}</span>
        </div>
      </div>

      <div class="resultado-acciones">
        <button class="btn-ver-partida" @click="emit('view')">
          Ver partida
        </button>
        <button class="btn-reiniciar" @click="emit('restart')">
          Jugar de nuevo →
        </button>
      </div>

    </div>
  </section>
</template>
<style scoped>
.resultado {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #111a12;
  padding: 1rem;
  font-family: 'Roboto Condensed', system-ui, sans-serif;
  overflow-y: auto;
}

.resultado-card {
  background: #161d17;
  border: 1px solid rgba(149,159,3,.25);
  border-radius: 6px;
  padding: 1.2rem 1.5rem;
  max-width: 480px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .6rem;
  box-shadow: 0 32px 64px rgba(0,0,0,.5);
  animation: cardIn .4s cubic-bezier(.22,1,.36,1);
  margin: auto;
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.resultado-kicker {
  font-size: .6rem;
  letter-spacing: 3px;
  font-weight: 700;
  color: #959f03;
  margin: 0;
}

.resultado-linea {
  width: 28px;
  height: 3px;
  background: #959f03;
}

.resultado-banner {
  font-size: .7rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: .35rem .9rem;
  border-radius: 3px;
}

.resultado-banner.ganaste {
  background: rgba(82,183,136,.15);
  color: #52b788;
  border: 1px solid rgba(82,183,136,.3);
}

.resultado-banner.perdiste {
  background: rgba(248,113,113,.1);
  color: #f87171;
  border: 1px solid rgba(248,113,113,.25);
}

/* Fila superior: imagen + nombre */
.secreto-img {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid rgba(149,159,3,.3);
  background: #1e271f;
}

.secreto-nombre {
  font-size: 1.4rem;
  font-weight: 900;
  color: #fff;
  margin: 0;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: -0.5px;
  line-height: 1;
}

.secreto-cientifico {
  font-size: .78rem;
  font-style: italic;
  color: #556055;
  margin: -.2rem 0 0;
}

/* Taxonomía: fila horizontal compacta */
.taxonomia-grid {
  display: flex;
  flex-wrap: wrap;
  gap: .3rem;
  width: 100%;
  justify-content: center;
}

.tax-item {
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(149,159,3,.12);
  border-radius: 3px;
  padding: .35rem .6rem;
  display: flex;
  flex-direction: column;
  gap: .1rem;
  min-width: 80px;
  flex: 1 1 80px;
}

.tax-key {
  font-size: .55rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #959f03;
}

.tax-val {
  font-size: .78rem;
  font-weight: 700;
  color: #d0d8d0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Botones */
.resultado-acciones {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: .5rem;
  width: 100%;
  margin-top: .2rem;
}

.btn-ver-partida {
  background: none;
  border: 1px solid rgba(149,159,3,.3);
  border-radius: 3px;
  color: #959f03;
  font-size: .75rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: .65rem;
  cursor: pointer;
  font-family: 'Roboto Condensed', system-ui, sans-serif;
  transition: background .2s;

  &:hover { background: rgba(149,159,3,.1); }
}

.btn-reiniciar {
  background: #959f03;
  border: none;
  border-radius: 3px;
  color: #fff;
  font-size: .75rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: .65rem;
  cursor: pointer;
  font-family: 'Roboto Condensed', system-ui, sans-serif;
  transition: background .2s;

  &:hover { background: #787c03; }
}
</style>