import { ref, computed } from 'vue'

const TAXONOMY_KEYS = ['reino', 'filo', 'clase', 'orden', 'familia', 'genero', 'especie']

// 'correct' | 'warm' | 'cold'
function calcularCalor(secreto, intento, nivel) {
  const nivelIndex = TAXONOMY_KEYS.indexOf(nivel)

  if (secreto.taxonomia[nivel] === intento.taxonomia[nivel]) return 'correct'

  const isAncestroComun = TAXONOMY_KEYS
    .slice(0, nivelIndex)
    .every(k => secreto.taxonomia[k] === intento.taxonomia[k])

  return isAncestroComun ? 'warm' : 'cold'
}

function construirResultadoIntento(secreto, intento) {
  const niveles = TAXONOMY_KEYS.map(nivel => ({
    nivel,
    valor: intento.taxonomia[nivel],
    calor: calcularCalor(secreto, intento, nivel)
  }))

  const isGanador = niveles.every(n => n.calor === 'correct')

  return { animal: intento, niveles, isGanador }
}

export function useGameLogic() {
  const animales      = ref([])
  const secreto       = ref(null)
  const intentos      = ref([])
  const isLoading     = ref(true)
  const isGameOver    = ref(false)
  const isWon         = ref(false)

  const animalesUsados = computed(() =>
    new Set(intentos.value.map(i => i.animal.id))
  )

  const animalesDisponibles = computed(() =>
    animales.value.filter(a => !animalesUsados.value.has(a.id))
  )

  async function iniciarJuego() {
    isLoading.value = true
    intentos.value  = []
    isGameOver.value = false
    isWon.value     = false

    const res  = await fetch('/proyecto-personal/data/animals.json')
    animales.value = await res.json()

    const indiceAleatorio = Math.floor(Math.random() * animales.value.length)
    secreto.value = animales.value[indiceAleatorio]

    isLoading.value = false
  }

  function hacerIntento(animal) {
    if (isGameOver.value) return

    const resultado = construirResultadoIntento(secreto.value, animal)
    intentos.value = [resultado, ...intentos.value]

    if (resultado.isGanador) {
      isGameOver.value = true
      isWon.value = true
    }
  }

  return {
    animales,
    secreto,
    intentos,
    isLoading,
    isGameOver,
    isWon,
    animalesDisponibles,
    iniciarJuego,
    hacerIntento
  }
}