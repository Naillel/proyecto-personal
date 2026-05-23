<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  animalesDisponibles: { type: Array, required: true },
  disabled:            { type: Boolean, default: false }
})

const emit = defineEmits(['guess'])

const query        = ref('')
const isOpen       = ref(false)

const sugerencias = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (q.length < 1) return []
  return props.animalesDisponibles
    .filter(a => a.nombre.toLowerCase().includes(q))
    .slice(0, 6)
})

function seleccionar(animal) {
  emit('guess', animal)
  query.value = ''
  isOpen.value = false
}

function onInput() {
  isOpen.value = true
}

function onBlur() {
  // Pequeño delay para que el click en sugerencia se registre primero
  setTimeout(() => { isOpen.value = false }, 150)
}
</script>

<template>
  <div class="guess-input">
    <div class="input-wrap">
      <input
        type="text"
        class="input"
        placeholder="Escribe un animal..."
        :disabled="disabled"
        v-model="query"
        @input="onInput"
        @blur="onBlur"
      />
      <span class="input-icon">🔍</span>
    </div>

    <ul v-if="isOpen && sugerencias.length" class="sugerencias">
      <li
        v-for="animal in sugerencias"
        :key="animal.id"
        class="sugerencia-item"
        @mousedown="seleccionar(animal)"
      >
        <span class="sugerencia-nombre">{{ animal.nombre }}</span>
        <span class="sugerencia-cientifico">{{ animal.nombreCientifico }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.guess-input { position: relative; width: 100%; max-width: 480px; margin: 0 auto; }

.input-wrap  { position: relative; }

.input {
  width: 100%;
  padding: .8rem 2.8rem .8rem 1rem;
  border: 2px solid #d0e8da;
  border-radius: 999px;
  font-size: 1rem;
  outline: none;
  transition: border-color .2s;
  box-sizing: border-box;

  &:focus { border-color: #2d6a4f; }
  &:disabled { opacity: .5; cursor: not-allowed; }
}

.input-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.sugerencias {
  position: absolute;
  top: calc(100% + .4rem);
  left: 0; right: 0;
  background: #fff;
  border: 1px solid #d0e8da;
  border-radius: 1rem;
  list-style: none;
  margin: 0; padding: .4rem 0;
  box-shadow: 0 4px 16px rgba(0,0,0,.12);
  z-index: 10;
}

.sugerencia-item {
  display: flex;
  flex-direction: column;
  padding: .6rem 1rem;
  cursor: pointer;
  transition: background .15s;

  &:hover { background: #e9f5ee; }
}

.sugerencia-nombre    { font-weight: 600; color: #1a4731; }
.sugerencia-cientifico { font-size: .8rem; color: #888; font-style: italic; }
</style>