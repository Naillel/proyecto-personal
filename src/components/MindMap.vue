<script setup>
import { ref, onMounted } from 'vue'

const phyla = ref([])
const animals = ref([])
const errorLoading = ref(false)

async function loadData() {
  try {
    const [pRes, aRes] = await Promise.all([
      fetch(`${import.meta.env.BASE_URL}data/phyla.json`),
      fetch(`${import.meta.env.BASE_URL}data/animals.json`)
    ])
    phyla.value = await pRes.json()
    animals.value = await aRes.json()
  } catch (e) {
    console.error('Error cargando datos del mapa:', e)
    errorLoading.value = true
  }
}

onMounted(loadData)

function groupByPhylum() {
  const map = {}
  animals.value.forEach(a => {
    const f = a.taxonomia.filo || 'Desconocido'
    if (!map[f]) map[f] = []
    map[f].push(a)
  })
  return map
}
</script>

<template>
  <div class="mindmap">
    <div v-if="errorLoading" class="mm-error">No se pudo cargar la información del mapa.</div>
    <svg v-else viewBox="0 0 1200 800" class="mm-svg">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity="0.12"/>
        </filter>
      </defs>

      <!-- Root -->
      <g>
        <circle cx="120" cy="60" r="40" fill="#2d6a4f" />
        <text x="120" y="66" fill="#fff" font-size="14" font-weight="700" text-anchor="middle">Animalia</text>
      </g>

      <!-- Phyla and animals -->
      <g v-for="(p, idx) in phyla" :key="p.filo">
        <g :transform="`translate(320, ${80 + idx * 160})`">
          <line x1="-180" y1="-20" x2="-40" y2="-20" stroke="#cfefe0" stroke-width="2" />
          <rect x="-20" y="-36" width="220" height="56" rx="10" fill="#ffffff" stroke="#d9f2e6" />
          <text x="90" y="0" fill="#0f3d2e" font-size="14" font-weight="700" text-anchor="middle">{{ p.nombre }}</text>
        </g>

        <!-- Animals for this phylum -->
        <g v-if="(groupByPhylum()[p.filo] || []).length" :transform="`translate(580, ${80 + idx * 160})`">
          <g v-for="(a, j) in groupByPhylum()[p.filo]" :key="a.id" :transform="`translate(${(j%6)*120}, ${Math.floor(j/6)*56})`">
            <line x1="-260" y1="0" :x2="-20" y2="0" stroke="#e6f5ec" stroke-width="1.5" />
            <rect x="0" y="-18" width="110" height="36" rx="8" fill="#f7fffb" stroke="#e6f5ec" />
            <text x="55" y="6" fill="#0f3d2e" font-size="12" text-anchor="middle">{{ a.nombre }}</text>
          </g>
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.mindmap { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
.mm-svg { width: 100%; height: 100%; max-height: 720px; background: transparent; }
.mm-error { color: #a94442; }
</style>
