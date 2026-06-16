import { ref, computed } from 'vue'

const TAXONOMY_KEYS = ['reino', 'filo', 'clase', 'orden', 'familia', 'genero', 'especie']
const MAX_INTENTOS = 15

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
  const loadError     = ref(null)

  const animalesUsados = computed(() =>
    new Set(intentos.value.map(i => i.animal.id))
  )

  const animalesDisponibles = computed(() =>
    animales.value.filter(a => !animalesUsados.value.has(a.id))
  )

  async function iniciarJuego() {
    // Carga por defecto sin estado previo
    isLoading.value = true
    intentos.value  = []
    isGameOver.value = false
    isWon.value     = false
    loadError.value = null

    try {
      const res = await fetch(`${import.meta.env.BASE_URL}data/animals.json`)
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)

      animales.value = await res.json()
      const indiceAleatorio = Math.floor(Math.random() * animales.value.length)
      secreto.value = animales.value[indiceAleatorio]
    } catch (error) {
      console.error('Error al cargar animales:', error)
      animales.value = []
      secreto.value = null
      loadError.value = error.message || 'No se pudo cargar los animales.'
    } finally {
      isLoading.value = false
    }
  }

  // Inicia juego con posibilidad de restaurar estado previo (secreto + intentos)
  async function iniciarJuegoConEstado(resume = null) {
    isLoading.value = true
    loadError.value = null

    try {
      const res = await fetch(`${import.meta.env.BASE_URL}data/animals.json`)
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
      animales.value = await res.json()

      if (resume && resume.secreto) {
        // Intentar mapear el secreto por id si viene sólo referencia
        const found = animales.value.find(a => a.id === resume.secreto.id)
        secreto.value = found ?? resume.secreto
        intentos.value = resume.intentos ?? []
        isGameOver.value = !!resume.isGameOver || intentos.value.length >= MAX_INTENTOS
        isWon.value = !!resume.isWon || intentos.value.some(i => i.isGanador)
      } else {
        const indiceAleatorio = Math.floor(Math.random() * animales.value.length)
        secreto.value = animales.value[indiceAleatorio]
        intentos.value = []
        isGameOver.value = false
        isWon.value = false
      }
    } catch (error) {
      console.error('Error al cargar animales:', error)
      animales.value = []
      secreto.value = null
      loadError.value = error.message || 'No se pudo cargar los animales.'
    } finally {
      isLoading.value = false
    }
  }

  function hacerIntento(animal) {
    if (isGameOver.value) return

    // Limitar el número de intentos
    if (intentos.value.length >= MAX_INTENTOS) {
      isGameOver.value = true
      isWon.value = false
      return
    }

    const resultado = construirResultadoIntento(secreto.value, animal)
    intentos.value = [resultado, ...intentos.value]

    if (resultado.isGanador) {
      isGameOver.value = true
      isWon.value = true
      return
    }

    if (intentos.value.length >= MAX_INTENTOS) {
      isGameOver.value = true
      isWon.value = false
    }
  }

  return {
    animales,
    secreto,
    intentos,
    isLoading,
    isGameOver,
    isWon,
    loadError,
    animalesDisponibles,
    iniciarJuego,
    iniciarJuegoConEstado,
    hacerIntento,
    maxIntentos: MAX_INTENTOS
  }
}