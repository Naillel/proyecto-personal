import { ref, computed } from 'vue'

// Niveles taxonómicos en orden de generalidad (de más amplio a más específico)
const TAXONOMY_LEVELS = ['reino', 'filo', 'clase', 'orden', 'familia', 'genero', 'especie']

/**
 * Calcula el color de cada nivel taxonómico comparando
 * el animal adivinado contra el animal secreto.
 *
 * 🟩 verde   → ese nivel coincide exactamente
 * 🟨 amarillo → ese nivel NO coincide pero algún nivel SUPERIOR sí coincide
 * ⬜ gris    → no hay ninguna coincidencia en ese nivel ni en superiores
 */
function buildTaxonomyResult(guess, secret) {
  // Encontramos el índice del nivel más profundo donde coinciden
  const lastMatchIndex = TAXONOMY_LEVELS.reduce((lastMatch, level, index) => {
    return guess.taxonomia[level] === secret.taxonomia[level] ? index : lastMatch
  }, -1)

  return TAXONOMY_LEVELS.map((level, index) => ({
    nivel: level,
    valor: guess.taxonomia[level],
    estado:
      guess.taxonomia[level] === secret.taxonomia[level] ? 'correcto'   // 🟩
      : index <= lastMatchIndex                            ? 'cercano'   // 🟨
      :                                                     'lejano'    // ⬜
  }))
}

export function useGameLogic() {
  const animals      = ref([])
  const secretAnimal = ref(null)
  const guesses      = ref([])        // [{ animal, result }]
  const isLoading    = ref(true)
  const hasError     = ref(false)
  const isWon        = ref(false)

  // Lista de IDs ya intentados para deshabilitar opciones en el dropdown
  const guessedIds = computed(() =>
    guesses.value.map(g => g.animal.id)
  )

  // Animales que todavía no se han intentado
  const availableAnimals = computed(() =>
    animals.value.filter(a => !guessedIds.value.includes(a.id))
  )

  async function loadAnimals() {
    try {
      const response = await fetch('/src/data/animals.json')
      const data     = await response.json()
      animals.value  = data

      // Elegir animal secreto aleatorio
      const randomIndex  = Math.floor(Math.random() * data.length)
      secretAnimal.value = data[randomIndex]
    } catch {
      hasError.value = true
    } finally {
      isLoading.value = false
    }
  }

  function submitGuess(animal) {
    // Evitar duplicados
    if (guessedIds.value.includes(animal.id)) return

    const result = buildTaxonomyResult(animal, secretAnimal.value)

    guesses.value = [
      { animal, result },
      ...guesses.value   // los nuevos intentos van arriba
    ]

    if (animal.id === secretAnimal.value.id) {
      isWon.value = true
    }
  }

  function resetGame() {
    guesses.value  = []
    isWon.value    = false
    isLoading.value = true
    loadAnimals()
  }

  return {
    animals,
    secretAnimal,
    guesses,
    isLoading,
    hasError,
    isWon,
    availableAnimals,
    guessedIds,
    loadAnimals,
    submitGuess,
    resetGame
  }
}