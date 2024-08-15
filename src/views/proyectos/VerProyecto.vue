<template>
  <div v-if="!!proyecto" class="container">
    <div class="pb-4 mb-4 page-title-separation">
      <div class="d-flex align-items-center justify-content-between">
        <div class="me-2">
          <button class="btn btn-soft-primary rounded-circle" @click="goBack()">
            <i class="bi bi-arrow-left"></i>
          </button>
        </div>
        <div class="me-auto">
          <h1 class="h3 mb-0 fw-semibold">{{ proyecto.cliente.nombre }} - {{ proyecto.nombre }}</h1>
        </div>
        <div class="d-flex">
          <router-link to="#" class="me-2">
            <button class="btn btn-soft-primary">Finalizar</button>
          </router-link>
          <router-link to="#">
            <button class="btn btn-primary">Horas proyecto</button>
          </router-link>
        </div>
      </div>
    </div>
    <div class="mb-3">
      <proyecto-summary :proyecto="proyecto" />
    </div>

    <div class="mb-4">
      <equipo-summary
        :equipo="proyecto.equipo.miembros"
        :fecha-ultima-edicion="proyecto.equipo.fechaUltimaEdicion"
        @add-resource="onAddResource"
        @remove-resource="onRemoveResource"
      />
    </div>
  </div>
</template>
<script>
import EquipoSummary from '@/components/proyectos/EquipoSummary.vue'
import NavigateBack from '@/mixins/navigation/NavigateBack.vue'
import ProyectoSummary from '@/components/proyectos/ProyectoSummary.vue'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const PROYECTO = {
  nombre: 'Empleado digital',
  cliente: { nombre: 'Bancor' },
  fechaInicio: new Date('06/01/2024'),
  fechaFin: new Date('12/31/2024'),
  fechaUltimaEdicion: new Date('06/25/24 15:17'),
  horasMensualesContratadas: 160,
  equipo: {
    miembros: [
      {
        nombre: 'Yoana Gerling',
        rol: 'QA',
        horasDisponibles: 80,
        horasAsignadas: 40
      },
      {
        nombre: 'Patricio Sabatini',
        rol: 'CEO',
        horasDisponibles: 120,
        horasAsignadas: 10
      },
      {
        nombre: 'Rodrigo Loza',
        rol: 'CTO',
        horasDisponibles: 100,
        horasAsignadas: 40
      },
      {
        nombre: 'Joaquin Zanardi',
        rol: 'DEV',
        horasDisponibles: 160,
        horasAsignadas: 40
      },
      {
        nombre: 'Yoana Gerling',
        rol: 'ADMIN',
        horasDisponibles: 160,
        horasAsignadas: 40
      }
    ],
    fechaUltimaEdicion: new Date('06/25/24 18:24')
  }
}

export default {
  name: 'VerProyecto',
  components: {
    ProyectoSummary,
    EquipoSummary
  },
  mixins: [NavigateBack],
  setup: function () {
    const route = useRoute()

    const loading = ref(false)
    const proyecto = ref(null)
    const error = ref(null)

    watch(() => route.params.id, fetchProyectoData, { immediate: true })

    async function fetchProyectoData(id) {
      error.value = proyecto.value = null
      loading.value = true

      try {
        proyecto.value = await getProyecto(id)
      } catch (err) {
        error.value = err.toString()
      } finally {
        loading.value = false
      }
    }

    async function getProyecto(id) {
      return Promise.resolve(PROYECTO)
    }

    return {
      loading,
      proyecto,
      error
    }
  },
  methods: {
    onAddResource: function () {
      this.proyecto.equipo.miembros.push({ horasDisponibles: 160 })
    },
    onRemoveResource: function (index) {
      this.proyecto.equipo.miembros.splice(index, 1)
    }
  }
}
</script>
