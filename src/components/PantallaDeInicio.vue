<script setup>
import { ref, onMounted } from 'vue'

defineEmits(['start'])

const isVisible = ref(false)
onMounted(() => { setTimeout(() => { isVisible.value = true }, 50) })
</script>

<template>
  <section class="inicio">

    <!-- Fondo con patrón sutil -->
    <div class="inicio-bg" />

    <div :class="['inicio-contenido', { 'is-visible': isVisible }]">

      <!-- Columna izquierda: identidad -->
      <div class="col-identidad">
        <p class="inicio-kicker">🇨🇷 Fauna Costarricense</p>
        <h1 class="inicio-titulo">
          Taxo<br><span class="titulo-acento">Quest</span>
        </h1>
        <div class="inicio-linea" />
        <p class="inicio-desc">
          Adivina el animal secreto usando el árbol de la vida.<br>
          Cada intento revela qué tan cerca estás en la taxonomía.
        </p>

        <button class="btn-jugar" @click="$emit('start')">
          Jugar ahora
          <span class="btn-flecha">→</span>
        </button>

        <p class="inicio-datos">40 animales · Taxonomía real · Sin límite de intentos</p>
      </div>

      <!-- Columna derecha: demo de niveles -->
      <div class="col-demo">
        <p class="demo-titulo">¿Cómo funciona?</p>

        <div class="demo-intentos">
          <!-- Intento de ejemplo 1 -->
          <div class="demo-row">
            <span class="demo-animal">Jaguar</span>
            <div class="demo-chips">
              <span class="chip correct">Reino</span>
              <span class="chip correct">Filo</span>
              <span class="chip correct">Clase</span>
              <span class="chip correct">Orden</span>
              <span class="chip warm">Familia</span>
              <span class="chip cold">Género</span>
              <span class="chip cold">Especie</span>
            </div>
          </div>

          <!-- Intento de ejemplo 2 -->
          <div class="demo-row">
            <span class="demo-animal">Ocelote</span>
            <div class="demo-chips">
              <span class="chip correct">Reino</span>
              <span class="chip correct">Filo</span>
              <span class="chip correct">Clase</span>
              <span class="chip correct">Orden</span>
              <span class="chip correct">Familia</span>
              <span class="chip warm">Género</span>
              <span class="chip cold">Especie</span>
            </div>
          </div>

          <!-- Intento de ejemplo 3 — ganador -->
          <div class="demo-row demo-row--win">
            <span class="demo-animal">Puma 🏆</span>
            <div class="demo-chips">
              <span class="chip correct">Reino</span>
              <span class="chip correct">Filo</span>
              <span class="chip correct">Clase</span>
              <span class="chip correct">Orden</span>
              <span class="chip correct">Familia</span>
              <span class="chip correct">Género</span>
              <span class="chip correct">Especie</span>
            </div>
          </div>
        </div>

        <!-- Leyenda -->
        <div class="demo-leyenda">
          <span class="leyenda-item">
            <span class="dot correct" /> Coincide
          </span>
          <span class="leyenda-item">
            <span class="dot warm" /> Mismo clado
          </span>
          <span class="leyenda-item">
            <span class="dot cold" /> Lejos
          </span>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* ── Layout ─────────────────────────────────────── */
.inicio {
  min-height: 100dvh;
  background: #111a12;
  display: grid;
  place-items: center;
  padding: 2rem 1.5rem;
  position: relative;
  overflow: hidden;
  font-family: 'Roboto Condensed', system-ui, sans-serif;
}

/* Patrón de fondo sutil */
.inicio-bg {
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 40px,
      rgba(149,159,3,.04) 40px,
      rgba(149,159,3,.04) 41px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 40px,
      rgba(149,159,3,.04) 40px,
      rgba(149,159,3,.04) 41px
    );
  pointer-events: none;
}

/* Contenido: dos columnas */
.inicio-contenido {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  max-width: 960px;
  width: 100%;
  opacity: 0;
  transform: translateY(24px);
  transition: opacity .6s ease, transform .6s ease;
}

.inicio-contenido.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* ── Columna izquierda ───────────────────────────── */
.col-identidad {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.2rem;
}

.inicio-kicker {
  font-size: .8rem;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #959f03;
  margin: 0;
}

.inicio-titulo {
  font-size: clamp(3.5rem, 8vw, 6rem);
  font-weight: 900;
  line-height: .9;
  color: #ffffff;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: -2px;
}

.titulo-acento { color: #959f03; }

/* Línea decorativa — igual que el template */
.inicio-linea {
  width: 40px;
  height: 4px;
  background: #959f03;
  border-radius: 2px;
}

.inicio-desc {
  color: #a8b0a8;
  font-size: 1rem;
  line-height: 1.6;
  font-family: system-ui, sans-serif;
  margin: 0;
  font-weight: 300;
}

.btn-jugar {
  display: inline-flex;
  align-items: center;
  gap: .7rem;
  background: #959f03;
  color: #fff;
  border: none;
  padding: .85rem 1.8rem;
  font-family: 'Roboto Condensed', system-ui, sans-serif;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 0;
  position: relative;
  transition: background .25s;
  align-self: flex-start;
}

.btn-jugar:hover { background: #787c03; }

.btn-flecha {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #787c03;
  font-size: 1.1rem;
  transition: background .25s;
}

.btn-jugar:hover .btn-flecha { background: #959f03; }

.inicio-datos {
  font-size: .75rem;
  letter-spacing: 1px;
  color: #556055;
  text-transform: uppercase;
  margin: 0;
}

/* ── Columna derecha ─────────────────────────────── */
.col-demo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.2rem;
}

.demo-titulo {
  font-size: .75rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #556055;
  font-weight: 700;
  margin: 0;
}

.demo-intentos {
  display: flex;
  flex-direction: column;
  gap: .6rem;
}

.demo-row {
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(149,159,3,.15);
  border-radius: 4px;
  padding: .65rem .9rem;
  display: flex;
  flex-direction: column;
  gap: .45rem;
  transition: border-color .25s;

  &:hover { border-color: rgba(149,159,3,.35); }
}

.demo-row--win {
  border-color: rgba(82,183,136,.4);
  background: rgba(82,183,136,.06);
}

.demo-animal {
  font-size: .8rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #d0d8d0;
}

.demo-chips {
  display: flex;
  gap: .25rem;
  flex-wrap: wrap;
}

.chip {
  font-size: .6rem;
  font-weight: 700;
  letter-spacing: .5px;
  text-transform: capitalize;
  padding: .25rem .5rem;
  border-radius: 2px;
}

.chip.correct { background: #52b788; color: #fff; }
.chip.warm    { background: #f4a261; color: #fff; }
.chip.cold    { background: rgba(255,255,255,.08); color: #667066; }

/* Leyenda */
.demo-leyenda {
  display: flex;
  gap: 1.2rem;
  flex-wrap: wrap;
}

.leyenda-item {
  display: flex;
  align-items: center;
  gap: .4rem;
  font-size: .75rem;
  color: #667066;
}

.dot {
  width: 8px; height: 8px;
  border-radius: 1px;
  flex-shrink: 0;
}

.dot.correct { background: #52b788; }
.dot.warm    { background: #f4a261; }
.dot.cold    { background: rgba(255,255,255,.15); border: 1px solid #556055; }

/* ── Responsive ──────────────────────────────────── */
@media (max-width: 640px) {
  .inicio-contenido {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .inicio-titulo { font-size: 4rem; }
}
</style>