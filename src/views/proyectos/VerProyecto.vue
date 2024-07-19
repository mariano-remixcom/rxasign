<template>
  <div v-if="proyecto" class="container">
    <div class="mb-4">
      <div class="d-flex align-items-center justify-content-between">
        <div class="me-2">
          <button class="btn btn-secondary rounded-circle btn-lg">
            <i class="bi bi-arrow-left"></i>
          </button>
        </div>
        <div class="me-auto">
          <h1 class="display-6 fw-bold">{{ proyecto.cliente.nombre }} - {{ proyecto.nombreProyecto }}</h1>
        </div>
        <div class="d-flex">
          <router-link to="#" class="me-2">
            <button class="btn btn-secondary btn-lg">Finalizar</button>
          </router-link>
          <router-link to="#">
            <button class="btn btn-primary btn-lg">Horas proyecto</button>
          </router-link>
        </div>
      </div>
    </div>
    <div class="border-top border-dotted border-gray display-fluid"></div>
    <div id="app"></div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const PROYECTO = {
  nombreProyecto: 'Empleado digital',
  cliente: { nombre: 'Bancor' },
  fechaInicio: new Date('01/06/2024'),
  fechaFin: new Date('31/12/2024'),
  fechaUltimaEdicion: new Date('25/06/24 15:17'),
  horasMensualesContratadas: 160,
  equipo: []
}

const route = useRoute()

const loading = ref(false)
const proyecto = ref(null)
const error = ref(null)

watch(() => route.params.id, fetchData, { immediate: true })

async function fetchData(id) {
  error.value = proyecto.value = null
  loading.value = true

  try {
    // TODO: Des-hardcodear esto.
    proyecto.value = await getProyecto(id)
  } catch (err) {
    error.value = err.toString()
  } finally {
    loading.value = false
  }
}

function getProyecto(id) {
  return Promise.resolve(PROYECTO)
}
</script>
<style scoped>
.btn-secondary {
  --bs-btn-color: var(--color-primary);
  --bs-btn-font-weight: 600;
  --bs-btn-bg: #ebe5fc;
  --bs-btn-border-color: #ebe5fc;
  --bs-btn-hover-color: var(--color-primary);
  --bs-btn-hover-bg: #d5c8fa;
  --bs-btn-hover-border-color: var(--bs-btn-hover-bg);
  --bs-btn-active-color: var(--color-primary);
  --bs-btn-active-bg: #b19bf0;
  --bs-btn-active-border-color: var(--bs-btn-active-bg);
}

.border-dotted {
  --bs-border-style: dashed;
}

.border-gray {
  --bs-border-color: #828282;
}
</style>
