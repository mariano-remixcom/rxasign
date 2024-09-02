<template>
  <div v-if="error?.status === 404">
    <proyecto-no-encontrado></proyecto-no-encontrado>
  </div>
  <div v-if="!loading && !error" class="container">
    <div class="pb-4 mb-4 page-title-separation">
      <div class="d-flex align-items-center justify-content-between">
        <div class="me-2">
          <button class="btn btn-soft-primary rounded-circle" @click="goBack()">
            <i class="bi bi-arrow-left"></i>
          </button>
        </div>
        <div class="me-auto">
          <h1 class="h3 mb-0 fw-semibold">{{ proyecto.client.name }} - {{ proyecto.name }}</h1>
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
      <proyecto-summary :proyecto="proyecto" @fetch-project="fetchProyectoData" />
    </div>

    <div class="mb-4">
      <equipo-summary
        :equipo="proyecto.squad.resources"
        :fecha-ultima-edicion="proyecto.squad.updatedAt"
        @add-resource="addResource"
      />
    </div>
  </div>
</template>
<script>
import EquipoSummary from '@/components/proyectos/EquipoSummary.vue'
import NavigateBack from '@/mixins/navigation/NavigateBack.vue'
import ProjectsService from '@/services/projects'
import ProyectoNoEncontrado from './ProyectoNoEncontrado.vue'
import ProyectoSummary from '@/components/proyectos/ProyectoSummary.vue'
import ResourcesService from '@/services/resources'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'VerProyecto',
  components: {
    ProyectoSummary,
    EquipoSummary,
    ProyectoNoEncontrado
  },
  mixins: [NavigateBack],
  setup: function () {
    const route = useRoute()

    const loading = ref(false)
    const proyecto = ref(null)
    const error = ref(null)

    watch(() => route.params.id, fetchProyectoData, { immediate: true })

    function fetchProyectoData(id) {
      error.value = proyecto.value = null
      loading.value = true

      new ProjectsService()
        .getProjectById(id)
        .then((response) => {
          proyecto.value = response.data
        })
        .catch((err) => {
          error.value = err.response
        })
        .finally(() => {
          loading.value = false
        })
      console.log(proyecto, 'proyecto')
    }

    return {
      loading,
      proyecto,
      fetchProyectoData
    }
  },
  methods: {
    addResource: function (miembro) {
      // this.proyecto.equipo.miembros.push({ horasDisponibles: 160 })
      // console.log(miembro, 'miembro2')
      // console.log(this.proyecto)
      const newMember = {
        rol: miembro.rol,
        assignedHours: miembro.assignedHours,
        idSquad: this.proyecto.squad.id,
        idUser: miembro.idUser,
        startDate: new Date().toISOString()
      }

      // console.log(newMember, 'new member')
      new ResourcesService()
        .createResource(newMember)
        .then((response) => {
          console.log(response, 'recurso creado')
        })
        .catch((err) => {
          this.error = err.response
        })
    }
    // onRemoveResource: function (index) {
    // this.proyecto.equipo.miembros.splice(index, 1)
    // }
  }
}
</script>
