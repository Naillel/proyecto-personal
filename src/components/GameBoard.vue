<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGameLogic } from '../composables/useGameLogic.js'
import GuessInput      from './GuessInput.vue'
import TaxonomyRow     from './TaxonomyRow.vue'
import ArbolTaxonomico from './ArbolTaxonomico.vue'

const emit = defineEmits(['end'])

const {
  intentos, secreto, isLoading, isGameOver,
  isWon, loadError, animalesDisponibles,
  iniciarJuego, hacerIntento
} = useGameLogic()

const sonidos = {
  acierto:  new Audio('/sounds/Efecto acierto.mp3'),
  error:    new Audio('/sounds/Efecto error.mp3'),
  victoria: new Audio('/sounds/Victoria triunfante.mp3'),
}

const isOverlayVisible = ref(false)
const isExpandido      = ref(false)

const intentosMostrados = computed(() =>
  isExpandido.value ? intentos.value : intentos.value.slice(0, 5)
)
const hayMas = computed(() => intentos.value.length > 5)

onMounted(iniciarJuego)

function onGuess(animal) {
  hacerIntento(animal)
  const ultimo = intentos.value[0]
  if (ultimo.isGanador) {
    sonidos.victoria.play()
    setTimeout(() => { isOverlayVisible.value = true }, 600)
  } else {
    const hayCalor = ultimo.niveles.some(n => n.calor !== 'cold')
    hayCalor ? sonidos.acierto.play() : sonidos.error.play()
  }
}

function verPartida() {
  isOverlayVisible.value = false
}

function reiniciarJuego() {
  isOverlayVisible.value = false
  emit('end', { isWon: true, secreto: secreto.value, reiniciar: true })
}
</script>

<template>
  <section class="game-board">

    <header class="game-header">
      <div class="header-left">
        <p class="header-kicker">🇨🇷 FAUNA COSTARRICENSE</p>
        <h1 class="header-titulo">TaxoQuest <span class="titulo-acento">CR</span></h1>
        <div class="header-linea" />
      </div>

      <!-- Si el juego terminó, mostrar acciones en lugar del hint -->
      <div v-if="isGameOver" class="header-acciones">
        <button class="btn-header-victoria" @click="isOverlayVisible = true">
          Ver resultado 🎉
        </button>
        <button class="btn-header-reiniciar" @click="reiniciarJuego">
          Jugar de nuevo →
        </button>
      </div>
      <p v-else class="header-hint">Adivina el animal secreto usando el árbol de la vida</p>
    </header>

    <div v-if="isLoading" class="estado-msg">
      <span class="estado-dot-anim" /> Cargando fauna...
    </div>
    <div v-else-if="loadError" class="estado-msg estado-error">
      Error al cargar: {{ loadError }}
    </div>

    <template v-else>
      <div class="input-zona">
        <GuessInput
          :animales-disponibles="animalesDisponibles"
          :disabled="isGameOver"
          @guess="onGuess"
        />
        <p class="intentos-count">
          {{ intentos.length }} {{ intentos.length !== 1 ? 'intentos' : 'intento' }}
        </p>
      </div>

      <div class="game-layout">
        <div class="col-intentos">
          <p v-if="!intentos.length" class="intentos-vacio">
            Aún no has intentado ningún animal.<br>
            <span>Escribe uno arriba para empezar.</span>
          </p>

          <template v-else>
            <ul class="intentos-lista">
              <li v-for="(intento, i) in intentosMostrados" :key="i">
                <TaxonomyRow :intento="intento" />
              </li>
            </ul>

            <button
              v-if="hayMas"
              class="btn-ver-mas"
              @click="isExpandido = !isExpandido"
            >
              {{ isExpandido
                  ? '▲ Ver menos'
                  : `▼ Ver ${intentos.length - 5} intento${intentos.length - 5 !== 1 ? 's' : ''} anteriores` }}
            </button>
          </template>
        </div>

        <div class="col-arbol">
          <ArbolTaxonomico :intentos="intentos" :is-game-over="isGameOver" />
        </div>
      </div>
    </template>

    <Transition name="overlay-fade">
      <div v-if="isOverlayVisible" class="overlay" @click.self="verPartida">
        <div class="overlay-card">
          <div class="overlay-confetti">🎉</div>
          <p class="overlay-kicker">¡ANIMAL ENCONTRADO!</p>
          <div class="overlay-linea" />

          <img v-if="secreto?.imagen" :src="secreto.imagen" :alt="secreto.nombre" class="overlay-img" />

          <h2 class="overlay-nombre">{{ secreto?.nombre }}</h2>
          <p class="overlay-cientifico">{{ secreto?.nombreCientifico }}</p>

          <div class="overlay-taxonomia">
            <div v-for="(valor, clave) in secreto?.taxonomia" :key="clave" class="overlay-tax-item">
              <span class="overlay-tax-key">{{ clave }}</span>
              <span class="overlay-tax-val">{{ valor }}</span>
            </div>
          </div>

          <div class="overlay-acciones">
            <button class="btn-ver-partida" @click="verPartida">Ver partida</button>
            <button class="btn-nuevo-juego" @click="reiniciarJuego">Jugar de nuevo →</button>
          </div>

          <p class="overlay-intentos-txt">
            Lo lograste en {{ intentos.length }} intento{{ intentos.length !== 1 ? 's' : '' }}
          </p>
        </div>
      </div>
    </Transition>

  </section>
</template>

<style scoped>
.header-acciones {
  display: flex;
  gap: .6rem;
  flex-wrap: wrap;
}

.btn-header-victoria {
  background: rgba(82,183,136,.12);
  border: 1px solid rgba(82,183,136,.35);
  border-radius: 3px;
  color: #52b788;
  font-size: .75rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: .55rem 1rem;
  cursor: pointer;
  font-family: 'Roboto Condensed', system-ui, sans-serif;
  transition: background .2s;

  &:hover { background: rgba(82,183,136,.22); }
}

.btn-header-reiniciar {
  background: #959f03;
  border: none;
  border-radius: 3px;
  color: #fff;
  font-size: .75rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: .55rem 1rem;
  cursor: pointer;
  font-family: 'Roboto Condensed', system-ui, sans-serif;
  transition: background .2s;

  &:hover { background: #787c03; }
}
.game-board {
  min-height: 100svh;
  background: #111a12;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 28px 28px 48px;
  font-family: 'Roboto Condensed', system-ui, sans-serif;
  position: relative;
}

/* ── Header ──────────────────────────────────── */
.game-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  border-bottom: 1px solid rgba(149,159,3,.2);
  padding-bottom: 20px;
}

.header-left { display: flex; flex-direction: column; gap: .4rem; }

.header-kicker {
  font-size: .65rem;
  letter-spacing: 3px;
  font-weight: 700;
  color: #959f03;
  margin: 0;
}

.header-titulo {
  font-size: 2.2rem;
  font-weight: 900;
  color: #fff;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: -1px;
  line-height: 1;
}

.titulo-acento { color: #959f03; }

.header-linea {
  width: 28px;
  height: 3px;
  background: #959f03;
}

.header-hint {
  font-size: .85rem;
  color: #556055;
  margin: 0;
  max-width: 280px;
  text-align: right;
  font-family: system-ui, sans-serif;
}

/* ── Estado ──────────────────────────────────── */
.estado-msg {
  display: flex;
  align-items: center;
  gap: .6rem;
  color: #667066;
  font-size: .9rem;
}

.estado-error { color: #f87171; }

.estado-dot-anim {
  width: 8px; height: 8px;
  background: #959f03;
  border-radius: 50%;
  animation: pulse-dot 1s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%,100% { opacity:1; transform:scale(1); }
  50%      { opacity:.4; transform:scale(.7); }
}

/* ── Input ───────────────────────────────────── */
.input-zona {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .5rem;
}

.intentos-count {
  font-size: .72rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #556055;
  margin: 0;
}

/* ── Layout ──────────────────────────────────── */
.game-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
  align-items: start;
  flex: 1;
}

.col-intentos { display: flex; flex-direction: column; gap: 10px; }

.intentos-vacio {
  color: #445044;
  font-size: .9rem;
  text-align: center;
  padding: 2rem;
  border: 1px dashed rgba(149,159,3,.15);
  border-radius: 4px;
  line-height: 1.8;

  span { font-size: .8rem; color: #334033; }
}

.intentos-lista {
  list-style: none;
  margin: 0; padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Botón ver más */
.btn-ver-mas {
  background: none;
  border: 1px solid rgba(149,159,3,.2);
  border-radius: 3px;
  color: #959f03;
  font-size: .72rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: .6rem 1rem;
  cursor: pointer;
  width: 100%;
  transition: background .2s, border-color .2s;
  font-family: 'Roboto Condensed', system-ui, sans-serif;

  &:hover {
    background: rgba(149,159,3,.08);
    border-color: rgba(149,159,3,.4);
  }
}

.col-arbol { position: sticky; top: 20px; }

/* ── Overlay ─────────────────────────────────── */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(10,15,10,.75);
  backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
  z-index: 100;
  padding: 1.5rem;
}

.overlay-card {
  background: #161d17;
  border: 1px solid rgba(149,159,3,.35);
  border-radius: 6px;
  padding: 2rem 2rem 1.5rem;
  max-width: 420px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .9rem;
  box-shadow: 0 32px 64px rgba(0,0,0,.6);
  animation: cardPop .35s cubic-bezier(.22,1,.36,1);
}

@keyframes cardPop {
  from { opacity: 0; transform: scale(.92) translateY(16px); }
  to   { opacity: 1; transform: scale(1)   translateY(0); }
}

.overlay-confetti { font-size: 2.5rem; line-height: 1; }

.overlay-kicker {
  font-size: .65rem;
  letter-spacing: 4px;
  font-weight: 700;
  color: #959f03;
  margin: 0;
}

.overlay-linea {
  width: 28px;
  height: 3px;
  background: #959f03;
}

.overlay-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid rgba(149,159,3,.3);
}

.overlay-nombre {
  font-size: 1.6rem;
  font-weight: 900;
  color: #fff;
  margin: 0;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: -0.5px;
}

.overlay-cientifico {
  font-size: .82rem;
  font-style: italic;
  color: #556055;
  margin: -.4rem 0 0;
}

.overlay-taxonomia {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: .4rem;
  width: 100%;
}

.overlay-tax-item {
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(149,159,3,.12);
  border-radius: 3px;
  padding: .4rem .65rem;
  display: flex;
  flex-direction: column;
}

.overlay-tax-key {
  font-size: .6rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #959f03;
  font-weight: 700;
}

.overlay-tax-val {
  font-size: .82rem;
  font-weight: 700;
  color: #d0d8d0;
}

/* Botones de acción */
.overlay-acciones {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: .6rem;
  width: 100%;
  margin-top: .3rem;
}

.btn-ver-partida {
  background: none;
  border: 1px solid rgba(149,159,3,.3);
  border-radius: 3px;
  color: #959f03;
  font-size: .8rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: .75rem;
  cursor: pointer;
  font-family: 'Roboto Condensed', system-ui, sans-serif;
  transition: background .2s;

  &:hover { background: rgba(149,159,3,.1); }
}

.btn-nuevo-juego {
  background: #959f03;
  border: none;
  border-radius: 3px;
  color: #fff;
  font-size: .8rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: .75rem;
  cursor: pointer;
  font-family: 'Roboto Condensed', system-ui, sans-serif;
  transition: background .2s;

  &:hover { background: #787c03; }
}

.overlay-intentos-txt {
  font-size: .72rem;
  color: #445044;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin: 0;
}

/* Animación overlay */
.overlay-fade-enter-active { transition: opacity .25s ease; }
.overlay-fade-leave-active { transition: opacity .2s ease; }
.overlay-fade-enter-from,
.overlay-fade-leave-to { opacity: 0; }

/* ── Responsive ──────────────────────────────── */
@media (max-width: 800px) {
  .game-board { padding: 16px 16px 40px; }
  .game-layout { grid-template-columns: 1fr; }
  .col-arbol { position: static; }
  .header-hint { text-align: left; }
}
</style>