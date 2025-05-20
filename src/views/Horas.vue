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
          <div class="col-md-6">
            <label class="form-label">Período</label>
            <div class="d-flex">
              <input
                id="startDate"
                v-model="startDate"
                type="date"
                class="form-control bg-white me-2"
                @change="debouncedOnChangeFilters"
              />
              <input
                id="endDate"
                v-model="endDate"
                type="date"
                class="form-control bg-white"
                @change="debouncedOnChangeFilters"
              />
            </div>
          </div>
          <div class="col-md-6">
            <label for="proyecto" class="form-label">Proyecto</label>
            <select id="proyecto" v-model="selectedProject" class="form-select" @change="onChangeFilters">
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
      </div>
    </div>
  </div>
</template>

<script>
import ProjectsService from '@/services/projects'
import RegisteredPeriodsService from '@/services/registeredPeriods'
import TablaGestionHoras from '@/components/gestion-horas/TablaGestionHoras.vue'
import moment from 'moment'
import { useDebounceFn } from '@vueuse/core'

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
      startDate: moment().startOf('month').format('YYYY-MM-DD'),
      endDate: moment().endOf('month').format('YYYY-MM-DD'),
      debouncedOnChangeFilters: useDebounceFn(() => {
        this.onChangeFilters()
      }, 500)
    }
  },
  mounted() {
    this.getResourcesWithHours()
    this.getProjects()
  },
  methods: {
    async onChangeFilters() {
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
