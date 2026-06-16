<script setup>
import { ref, computed, nextTick } from 'vue'

const props = defineProps({
  animalesDisponibles: { type: Array, required: true },
  disabled:            { type: Boolean, default: false }
})

const emit = defineEmits(['guess'])

const query   = ref('')
const isOpen  = ref(false)
const inputEl = ref(null)

const sugerencias = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (q.length < 1) return []
  return props.animalesDisponibles
    .filter(a => a.nombre.toLowerCase().includes(q))
    .slice(0, 6)
})

async function seleccionar(animal) {
  emit('guess', animal)
  query.value = ''
  isOpen.value = false
  // remover foco para evitar que la lista reaparezca
  await nextTick()
  inputEl.value?.blur()
}

function onBlur() {
  setTimeout(() => { isOpen.value = false }, 150)
}
function onInput() {
  isOpen.value = query.value.trim().length > 0
}
</script>

<template>
  <div class="gi-wrap">
    <div class="gi-input-row">
      <input
        class="gi-input"
        type="text"
        placeholder="Escribe el nombre de un animal..."
        :disabled="disabled"
        v-model="query"
        @input="onInput"
        ref="inputEl"
        @blur="onBlur"
      />
      <span class="gi-icon">🔍</span>
    </div>

    <Transition name="gi-list">
      <ul v-if="isOpen && sugerencias.length" class="gi-sugerencias">
        <li
          v-for="animal in sugerencias"
          :key="animal.id"
          class="gi-item"
          @mousedown="seleccionar(animal)"
        >
          <span class="gi-nombre">{{ animal.nombre }}</span>
          <span class="gi-cientifico">{{ animal.nombreCientifico }}</span>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.gi-wrap {
  position: relative;
  width: 100%;
  max-width: 520px;
  font-family: 'Roboto Condensed', system-ui, sans-serif;
}

.gi-input-row { position: relative; }

.gi-input {
  width: 100%;
  padding: .75rem 2.8rem .75rem 1.2rem;
  background: #1e271f;
  border: 1px solid rgba(149,159,3,.3);
  border-radius: 3px;
  color: #d0d8d0;
  font-size: .95rem;
  font-family: inherit;
  outline: none;
  box-sizing: border-box;
  transition: border-color .2s, box-shadow .2s;

  &::placeholder { color: #445044; }

  &:focus {
    border-color: #959f03;
    box-shadow: 0 0 0 3px rgba(149,159,3,.12);
  }

  &:disabled { opacity: .4; cursor: not-allowed; }
}

.gi-icon {
  position: absolute;
  right: .9rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: .9rem;
  opacity: .5;
}

/* Lista de sugerencias */
.gi-sugerencias {
  position: absolute;
  top: calc(100% + 4px);
  left: 0; right: 0;
  background: #1e271f;
  border: 1px solid rgba(149,159,3,.25);
  border-radius: 3px;
  list-style: none;
  margin: 0; padding: .3rem 0;
  box-shadow: 0 8px 24px rgba(0,0,0,.4);
  z-index: 20;
}

.gi-item {
  display: flex;
  flex-direction: column;
  padding: .55rem 1rem;
  cursor: pointer;
  transition: background .15s;

  &:hover { background: rgba(149,159,3,.12); }
}

.gi-nombre {
  font-weight: 700;
  font-size: .88rem;
  color: #d0d8d0;
  letter-spacing: .5px;
  text-transform: uppercase;
}

.gi-cientifico {
  font-size: .72rem;
  font-style: italic;
  color: #556055;
}

/* Animación lista */
.gi-list-enter-active { transition: opacity .15s, transform .15s; }
.gi-list-leave-active { transition: opacity .1s, transform .1s; }
.gi-list-enter-from   { opacity: 0; transform: translateY(-4px); }
.gi-list-leave-to     { opacity: 0; }
</style>