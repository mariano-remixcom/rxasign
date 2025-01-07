<template>
  <div v-if="error?.status === 404">
    <proyecto-no-encontrado></proyecto-no-encontrado>
  </div>
  <div v-if="!loading && !error" class="container main-container">
    <!-- Título y Botones -->
    <div class="pb-4 mb-4 page-title-separation">
      <div class="d-flex align-items-center justify-content-between flex-wrap">
        <!-- Botón "Volver" -->
        <div class="me-2">
          <button class="btn btn-soft-primary rounded-circle" @click="goBack()">
            <i class="bi bi-arrow-left"></i>
          </button>
        </div>
        <!-- Título del proyecto -->
        <div class="me-auto">
          <h1 class="h3 mb-0 fw-semibold text-break">{{ proyecto.client.name }} - {{ proyecto.name }}</h1>
        </div>
        <!-- Botones Acciones -->
        <div class="d-flex gap-2">
          <router-link to="#" class="me-2">
            <button class="btn btn-soft-primary w-100 w-sm-auto">Finalizar</button>
          </router-link>
          <router-link to="#">
            <button class="btn btn-primary w-100 w-sm-auto">Horas proyecto</button>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Resumen del Proyecto -->
    <div class="mb-3">
      <proyecto-summary :proyecto="proyecto" @fetch-project="fetchProyectoData" />
    </div>

    <!-- Resumen del Equipo -->
    <div class="mb-4">
      <equipo-summary
        :equipo="proyecto.squad.resources"
        :fecha-ultima-edicion="proyecto.squad.updatedAt"
        :id-squad="proyecto.squad.id"
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
    // addResource: function (miembro) {
    //   // this.proyecto.equipo.miembros.push({ horasDisponibles: 160 })
    //   // console.log(miembro, 'miembro2')
    //   // console.log(this.proyecto)
    //   const newMember = {
    //     rol: miembro.rol,
    //     assignedHours: miembro.assignedHours,
    //     idSquad: this.proyecto.squad.id,
    //     idUser: miembro.idUser,
    //     startDate: new Date().toISOString()
    //   }
    //   // console.log(newMember, 'new member')
    //   new ResourcesService()
    //     .createResource(newMember)
    //     .then((response) => {
    //       console.log(response, 'recurso creado')
    //     })
    //     .catch((err) => {
    //       this.error = err.response
    //     })
    // }
    // onRemoveResource: function (index) {
    // this.proyecto.equipo.miembros.splice(index, 1)
    // }
  }
}
</script>

<style scoped>
/* Asegura que los botones ocupen el mismo tamaño en pantallas pequeñas */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  /* Asegura que el contenido se ajuste a pantallas pequeñas */
  .d-flex.flex-wrap {
    flex-wrap: wrap;
  }

  /* Los botones ocupan todo el ancho en pantallas pequeñas */
  .btn {
    width: 100%;
  }

  /* Evita que los botones se estiren en pantallas grandes */
  .w-sm-auto {
    width: auto !important;
  }
}

/* Solución al corte debajo de la barra de navegación */
.main-container {
  padding-top: calc(var(--navbar-height, 15px) + 1rem); /* Ajusta el valor por defecto de la altura del navbar */
}

@media (max-width: 768px) {
  .main-container {
    padding-top: calc(var(--navbar-height, 56px) + 0.5rem);
  }
}
</style>
