<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  intentos:   { type: Array, required: true },
  isGameOver: { type: Boolean, default: false }
})

const NIVELES = ['reino', 'filo', 'clase', 'orden', 'familia', 'genero', 'especie']

const ICONOS = {
  reino:   '🌍',
  filo:    '🧬',
  clase:   '🦴',
  orden:   '📋',
  familia: '👨‍👩‍👧',
  genero:  '🔬',
  especie: '🐾'
}

// Cache: termino → { resumen, url, imagen }
const wikiCache  = ref({})
const nodoActivo = ref(null)

// Mejor calor y valor por nivel
const mejorPorNivel = computed(() => {
  const prioridad = { correct: 2, warm: 1, cold: 0 }
  return Object.fromEntries(
    NIVELES.map(nivel => {
      const mejorCalor = props.intentos.reduce((acc, intento) => {
        const calor = intento.niveles.find(n => n.nivel === nivel)?.calor ?? 'cold'
        return prioridad[calor] > prioridad[acc] ? calor : acc
      }, 'cold')

      const mejorIntento = props.intentos.find(intento =>
        intento.niveles.find(n => n.nivel === nivel)?.calor === mejorCalor
      )
      const valor = mejorIntento?.niveles.find(n => n.nivel === nivel)?.valor ?? null

      return [nivel, { calor: mejorCalor, valor }]
    })
  )
})

// Fetch Wikipedia con imagen
async function fetchWiki(termino) {
  if (!termino || wikiCache.value[termino]) return

  try {
    const url = `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(termino)}`
    const res  = await fetch(url)
    if (!res.ok) throw new Error()
    const data = await res.json()

    wikiCache.value = {
      ...wikiCache.value,
      [termino]: {
        resumen: data.extract
          ? data.extract.split('.').slice(0, 2).join('.').trim() + '.'
          : 'Sin descripción disponible.',
        url:    data.content_urls?.desktop?.page ?? '#',
        imagen: data.thumbnail?.source ?? null
      }
    }
  } catch {
    wikiCache.value = {
      ...wikiCache.value,
      [termino]: { resumen: 'Sin información en Wikipedia.', url: '#', imagen: null }
    }
  }
}

// Pre-fetch cuando se revelan niveles
watch(() => props.intentos, () => {
  NIVELES.forEach(nivel => {
    const { calor, valor } = mejorPorNivel.value[nivel]
    if (calor !== 'cold' && valor) fetchWiki(valor)
  })
}, { deep: true })

function toggleNodo(nivel) {
  const { calor, valor } = mejorPorNivel.value[nivel]
  if (calor === 'cold' || !valor) return
  nodoActivo.value = nodoActivo.value === nivel ? null : nivel
  fetchWiki(valor)
}
</script>

<template>
  <aside class="arbol" v-if="intentos.length > 0">
    <p class="arbol-kicker">ÁRBOL TAXONÓMICO</p>
    <div class="arbol-linea" />

    <div class="arbol-niveles">
      <div
        v-for="(nivel, i) in NIVELES"
        :key="nivel"
        class="nodo-wrap"
      >
        <!-- Nodo principal -->
        <button
          :class="['nodo', mejorPorNivel[nivel].calor, { 'is-active': nodoActivo === nivel }]"
          :disabled="mejorPorNivel[nivel].calor === 'cold'"
          @click="toggleNodo(nivel)"
        >
          <span class="nodo-icono">{{ ICONOS[nivel] }}</span>
          <div class="nodo-texto">
            <span class="nodo-label">{{ nivel }}</span>
            <span class="nodo-valor">
              {{ mejorPorNivel[nivel].calor !== 'cold'
                  ? mejorPorNivel[nivel].valor
                  : '???' }}
            </span>
          </div>
          <span
            :class="['estado-dot', mejorPorNivel[nivel].calor]"
          />
        </button>

        <!-- Card Wikipedia compacta -->
        <Transition name="card-pop">
          <div
            v-if="nodoActivo === nivel && mejorPorNivel[nivel].valor"
            class="wiki-card"
          >
            <!-- Imagen si existe -->
            <img
              v-if="wikiCache[mejorPorNivel[nivel].valor]?.imagen"
              :src="wikiCache[mejorPorNivel[nivel].valor].imagen"
              :alt="mejorPorNivel[nivel].valor"
              class="wiki-img"
            />
            <div class="wiki-body">
              <p class="wiki-nombre">{{ mejorPorNivel[nivel].valor }}</p>
              <p class="wiki-texto">
                {{ wikiCache[mejorPorNivel[nivel].valor]?.resumen ?? 'Cargando...' }}
              </p>
              <a
                v-if="wikiCache[mejorPorNivel[nivel].valor]?.url !== '#'"
                :href="wikiCache[mejorPorNivel[nivel].valor].url"
                target="_blank"
                rel="noopener"
                class="wiki-link"
              >Wikipedia →</a>
            </div>
          </div>
        </Transition>

        <!-- Conector vertical -->
        <div v-if="i < NIVELES.length - 1" class="conector">
          <div :class="['conector-linea', mejorPorNivel[nivel].calor]" />
        </div>
      </div>
    </div>
  </aside>

  <!-- Estado vacío antes del primer intento -->
  <aside v-else class="arbol arbol--vacio">
    <p class="arbol-kicker">ÁRBOL TAXONÓMICO</p>
    <div class="arbol-linea" />
    <p class="arbol-hint">Haz tu primer intento para ver el árbol de la vida</p>
  </aside>
</template>

<style scoped>
/* ── Contenedor ───────────────────────────────── */
.arbol {
  width: 100%;
  background: #161d17;
  border: 1px solid rgba(149,159,3,.2);
  border-radius: 4px;
  padding: 16px;
  font-family: 'Roboto Condensed', system-ui, sans-serif;
}

.arbol--vacio { opacity: .6; }

.arbol-kicker {
  font-size: .65rem;
  font-weight: 700;
  letter-spacing: 3px;
  color: #959f03;
  margin: 0 0 6px;
}

.arbol-linea {
  width: 28px;
  height: 3px;
  background: #959f03;
  margin-bottom: 14px;
}

.arbol-hint {
  font-size: .8rem;
  color: #556055;
  margin: 0;
  font-style: italic;
}

/* ── Niveles ───────────────────────────────────── */
.arbol-niveles {
  display: flex;
  flex-direction: column;
}

.nodo-wrap {
  display: flex;
  flex-direction: column;
}

/* ── Nodo ──────────────────────────────────────── */
.nodo {
  width: 100%;
  display: flex;
  align-items: center;
  gap: .6rem;
  padding: .5rem .7rem;
  border: 1px solid rgba(255,255,255,.06);
  border-radius: 3px;
  background: rgba(255,255,255,.03);
  cursor: pointer;
  text-align: left;
  transition: background .2s, border-color .2s, transform .15s;
  position: relative;
}

.nodo:not(:disabled):hover {
  background: rgba(149,159,3,.1);
  border-color: rgba(149,159,3,.4);
  transform: translateX(3px);
}

.nodo:disabled {
  cursor: default;
  opacity: .45;
}

.nodo.is-active {
  background: rgba(149,159,3,.15);
  border-color: rgba(149,159,3,.5);
}

/* Colores de calor */
.nodo.correct {
  background: rgba(82,183,136,.18);
  border-color: #52b788;
}

.nodo.warm {
  background: rgba(244,162,97,.15);
  border-color: #f4a261;
}

/* ── Contenido del nodo ───────────────────────── */
.nodo-icono { font-size: 1rem; flex-shrink: 0; }

.nodo-texto {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.nodo-label {
  font-size: .6rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #667066;
}

.nodo-valor {
  font-size: .85rem;
  font-weight: 700;
  color: #d0d8d0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nodo.correct .nodo-valor { color: #a8f0cc; }
.nodo.warm    .nodo-valor { color: #fcd9b4; }

/* Dot de estado */
.estado-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.estado-dot.correct { background: #52b788; }
.estado-dot.warm    { background: #f4a261; }
.estado-dot.cold    { background: rgba(255,255,255,.15); }

/* ── Card Wikipedia ───────────────────────────── */
.wiki-card {
  margin: 4px 0 4px 1.6rem;
  background: #1e271f;
  border: 1px solid rgba(149,159,3,.25);
  border-left: 3px solid #959f03;
  border-radius: 0 4px 4px 0;
  display: flex;
  gap: .75rem;
  overflow: hidden;
  max-width: 100%;
}

.wiki-img {
  width: 72px;
  height: 72px;
  object-fit: cover;
  flex-shrink: 0;
  display: block;
}

.wiki-body {
  padding: .65rem .75rem .65rem 0;
  display: flex;
  flex-direction: column;
  gap: .3rem;
  min-width: 0;
}

.wiki-nombre {
  font-size: .75rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #959f03;
  margin: 0;
}

.wiki-texto {
  font-size: .75rem;
  line-height: 1.5;
  color: #8a9e8a;
  margin: 0;
  /* Limitar a 3 líneas */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.wiki-link {
  font-size: .7rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: #959f03;
  text-decoration: none;
  text-transform: uppercase;
  align-self: flex-start;
  transition: color .2s;
}

.wiki-link:hover { color: #c5d000; }

/* ── Animación card ───────────────────────────── */
.card-pop-enter-active { transition: opacity .2s ease, transform .2s ease; }
.card-pop-leave-active { transition: opacity .15s ease, transform .15s ease; }
.card-pop-enter-from  { opacity: 0; transform: translateY(-6px) scaleY(.95); }
.card-pop-leave-to    { opacity: 0; transform: translateY(-4px) scaleY(.95); }

/* ── Conector ─────────────────────────────────── */
.conector {
  display: flex;
  justify-content: flex-start;
  padding-left: 1.15rem;
  height: 10px;
}

.conector-linea {
  width: 2px;
  height: 100%;
  border-radius: 1px;
  transition: background .4s;
}

.conector-linea.correct { background: #52b788; }
.conector-linea.warm    { background: #f4a261; }
.conector-linea.cold    { background: rgba(255,255,255,.08); }
</style>