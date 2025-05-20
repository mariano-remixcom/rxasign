<template>
  <div class="mb-1 rounded-3">
    <div class="container page-title-separation d-flex align-items-center justify-content-between mb-4">
      <div class="container-fluid">
        <h1 class="h3 mb-4">Gestión de Horas</h1>
      </div>
    </div>
  </div>
  <div id="app">
    <div class="container d-flex flex-column align-items-center justify-content-between">
      <div class="container">
        <div class="row mb-3">
          <div class="col-md-4">
            <label for="periodo" class="form-label">Período</label>
            <select id="periodo" class="form-select">
              <option>Enero 2024</option>
              <option>Febrero 2024</option>
              <option>Marzo 2024</option>
              <option>Abril 2024</option>
              <option>Mayo 2024</option>
              <option>Junio 2024</option>
              <option selected>Julio 2024 (actual)</option>
              <option>Agosto 2024</option>
              <option>Septiembre 2024</option>
              <option>Octubre 2024</option>
              <option>Noviembre 2024</option>
              <option>Diciembre 2024</option>
            </select>
          </div>
          <div class="col-md-8">
            <label for="proyecto" class="form-label">Proyecto</label>
            <select id="proyecto" v-model="selectedProject" class="form-select" @change="onChangeProject">
              <option :value="{ id: -1, name: 'all' }">Todos los proyectos</option>
              <option v-for="project in projects" :key="`project-${project.id}`" :value="project">
                {{ project.client.name }} - {{ project.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-12">
            <TablaGestionHoras v-if="users" :users="users" />
          </div>
        </div>
        <div class="row">
          <div class="col-12 text-end">
            <p class="text-muted">Actualizado: 25/06/24 15:17</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProjectsService from '@/services/projects'
import RegisteredPeriodsService from '@/services/registeredPeriods'
import TablaGestionHoras from '@/components/gestion-horas/TablaGestionHoras.vue'
import moment from 'moment'

export default {
  name: 'App',
  components: {
    TablaGestionHoras
  },
  data() {
    return {
      users: null,
      projects: [],
      selectedProject: { id: -1, name: 'all' },
      startDate: moment().startOf('month').subtract(1, 'month').format('YYYY-MM-DD'),
      endDate: moment().endOf('month').subtract(1, 'month').format('YYYY-MM-DD')
    }
  },
  mounted() {
    this.getResourcesWithHours()
    this.getProjects()
  },
  methods: {
    async onChangeProject() {
      if (this.selectedProject.id === -1) {
        return this.getResourcesWithHours()
      }

      return this.getResourcesWithHours([this.selectedProject.id])
    },
    async getResourcesWithHours(projectIds) {
      const registeredPeriodsService = new RegisteredPeriodsService()

      this.users = (await registeredPeriodsService.getSumaryHoursByUser(this.startDate, this.endDate, projectIds)).data
    },
    async getProjects() {
      const registeredPeriodsService = new ProjectsService()

      this.projects = (await registeredPeriodsService.getAllProjects()).data
    }
  }
}
</script>
