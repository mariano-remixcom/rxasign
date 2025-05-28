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
                :class="{ 'is-invalid': v$.startDate.$error }"
                @blur="v$.startDate.$touch"
                @change="debouncedOnChangeFilters"
              />
              <input
                id="endDate"
                v-model="endDate"
                type="date"
                class="form-control bg-white"
                :class="{ 'is-invalid': v$.endDate.$error }"
                @blur="v$.endDate.$touch"
                @change="debouncedOnChangeFilters"
              />
            </div>
          </div>
          <div class="col-md-3 col-lg-4">
            <label for="proyecto" class="form-label">Proyecto</label>
            <select id="proyecto" v-model="selectedProject" class="form-select" @change="onChangeFilters">
              <option :value="{ id: -1, name: 'all' }">Todos los proyectos</option>
              <option v-for="project in projects" :key="`project-${project.id}`" :value="project">
                {{ project.client.name }} - {{ project.name }}
              </option>
            </select>
          </div>
          <div class="col-md-3 col-lg-2 d-flex align-items-end pt-2">
            <div class="dropdown w-100">
              <button class="btn btn-soft-primary w-100 drowdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                Exportar <i class="bi bi-chevron-down"></i>
              </button>
              <ul class="dropdown-menu w-100">
                <li><button class="dropdown-item" @click="exportData('pdf')">En PDF</button></li>
                <li><button class="dropdown-item" @click="exportData('xls')">En Excel</button></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-12">
            <TablaGestionHoras
              v-if="users"
              :users="users"
              :users-details="usersDetails"
              :selected-users="selectedUsers"
              @show-details="onShowDetail"
              @select-all="onSelectAll"
              @deselect-all="onDeselectAll"
              @select-user="onSelectUser"
              @deselect-user="onDeselectUser"
            />
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
import useVuelidate from '@vuelidate/core'
import { useDebounceFn } from '@vueuse/core'

export default {
  name: 'App',
  components: {
    TablaGestionHoras
  },
  setup() {
    return {
      v$: useVuelidate()
    }
  },
  data() {
    return {
      selectedUsers: [],
      users: null,
      usersDetails: {},
      projects: [],
      selectedProject: { id: -1, name: 'all' },
      startDate: moment().startOf('month').format('YYYY-MM-DD'),
      endDate: moment().endOf('month').format('YYYY-MM-DD'),
      debouncedOnChangeFilters: useDebounceFn(() => {
        this.v$.$validate()

        if (this.v$.$invalid) {
          return
        }

        this.onChangeFilters()
      }, 500)
    }
  },
  validations() {
    return {
      startDate: {
        required: true,
        date: true,
        isValid: (value) => {
          return moment(value).isValid()
        },
        before: (value) => {
          if (!this.areDatesValid()) {
            return true
          }

          return moment(value).isBefore(this.endDate)
        }
      },
      endDate: {
        required: true,
        date: true,
        isValid: (value) => {
          return moment(value).isValid()
        },
        after: (value) => {
          if (!this.areDatesValid()) {
            return true
          }

          return moment(value).isAfter(this.startDate)
        }
      }
    }
  },
  computed: {
    selectedProjectId() {
      if (this.selectedProject.id === -1) {
        return undefined
      }

      return [this.selectedProject.id]
    }
  },
  mounted() {
    this.getResourcesWithHours()
    this.getProjects()
  },
  methods: {
    async onChangeFilters() {
      const $promises = []

      Object.keys(this.usersDetails).forEach((userId) => {
        $promises.push(this.getUserRegisteredHours(userId, this.selectedProjectId))
      })

      $promises.push(this.getResourcesWithHours(this.selectedProjectId))

      return Promise.all($promises)
    },
    async onShowDetail(userId) {
      return this.getUserRegisteredHours(userId, this.selectedProjectId)
    },
    async getResourcesWithHours(projectIds) {
      if (!this.areDatesValid()) return

      const registeredPeriodsService = new RegisteredPeriodsService()

      this.users = (await registeredPeriodsService.getSumaryHoursByUser(this.startDate, this.endDate, projectIds)).data

      this.selectedUsers = this.selectedUsers.filter((userId) => {
        return this.users.some((user) => user.userId === userId)
      })
    },
    async getProjects() {
      const registeredPeriodsService = new ProjectsService()

      this.projects = (await registeredPeriodsService.getAllProjects()).data
    },
    getUserRegisteredHours(userId, projectIds) {
      if (!this.areDatesValid()) return

      const registeredPeriods = new RegisteredPeriodsService()

      return registeredPeriods.getUserDetail(userId, this.startDate, this.endDate, projectIds).then((response) => {
        this.usersDetails[userId] = response.data
      })
    },
    areDatesValid() {
      const start = moment(this.startDate)
      const end = moment(this.endDate)

      return start.isValid() && end.isValid()
    },
    onSelectAll() {
      this.selectedUsers = this.users.map((user) => user.userId)
    },
    onDeselectAll() {
      this.selectedUsers = []
    },
    onSelectUser(userId) {
      this.selectedUsers.push(userId)
    },
    onDeselectUser(userId) {
      this.selectedUsers = this.selectedUsers.filter((id) => id !== userId)
    },
    exportData(format) {
      const registeredPeriods = new RegisteredPeriodsService()

      return registeredPeriods.exportRegisteredHours(
        this.startDate,
        this.endDate,
        this.selectedProjectId,
        this.selectedUsers,
        format
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.dropdown-menu {
  background-color: $primary-light;
  color: $indigo-500;
  border: 0;
}

.dropdown-item {
  background-color: $primary-light;
  color: $indigo-500;

  &:hover,
  &:active {
    background-color: $indigo-100;
  }
}
</style>
