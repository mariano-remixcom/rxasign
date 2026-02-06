<template>
  <div class="daily-report-container">
    <div class="content-wrapper">
      <div class="page-header">
        <h2 class="page-title">Daily Report</h2>
        <div class="header-info">
          <span v-if="!viewMode" class="last-leader-info">
            Último líder: <strong>{{ lastLeader || '' }}</strong>
          </span>
          <input
            v-model="selectedDate"
            type="date"
            class="form-control date-input"
            :max="getTodayDate()"
            @change="onDateChange"
          />
        </div>
      </div>
      <div v-if="noDataForDate && !hasExistingReport" class="alert alert-warning" role="alert">
        <div class="d-flex align-items-center">
          <i class="bi bi-exclamation-triangle me-3" style="font-size: 1.5rem"></i>
          <div>
            <strong>No hay datos disponibles</strong>
            <p class="mb-0 mt-1">No se encontró ningún Daily Report para la fecha {{ formatDate(selectedDate) }}.</p>
          </div>
        </div>
      </div>
      <div v-if="hasExistingReport && !viewMode && !noDataForDate" class="alert alert-info" role="alert">
        <div class="d-flex align-items-center">
          <i class="bi bi-info-circle me-3" style="font-size: 1.5rem"></i>
          <div>
            <strong>Daily Report existente</strong>
            <p class="mb-0 mt-1">
              Ya existe un Daily Report guardado para {{ formatDate(selectedDate) }}. Puedes editarlo y guardar los cambios.
            </p>
          </div>
        </div>
      </div>
      <div v-if="showForm" class="info-card">
        <div class="card">
          <div class="card-body">
            <div class="mb-4 leader-container">
              <label class="form-label fw-semibold">Líder:</label>
              <input v-if="viewMode" type="text" class="form-control leader-input" :value="getLeaderName()" readonly />
              <select v-else v-model="selectedLeader" class="form-select leader-input" @change="onLeaderChange">
                <option value="">Selecciona al líder</option>
                <option v-for="user in dailyUsers" :key="user.id" :value="user.id">{{ user.firstName }}</option>
              </select>
              <small v-if="leaderLoadedFromDate && !viewMode" class="text-success d-block mt-1">
                <i class="bi bi-check-circle me-1"></i>
                Líder cargado automáticamente para esta fecha
              </small>
            </div>
            <div>
              <label class="form-label fw-semibold">Asistentes:</label>
              <div v-if="viewMode" class="assistants-view">
                <span v-for="userId in selectedAssistants" :key="userId" class="badge bg-primary me-2 mb-2">
                  {{ getUserName(userId) }}
                </span>
              </div>
              <div v-else class="assistants-grid">
                <div v-for="user in dailyUsers" :key="user.id" class="form-check">
                  <input
                    :id="`assistant-${user.id}`"
                    v-model="selectedAssistants"
                    class="form-check-input"
                    type="checkbox"
                    :value="user.id"
                  />
                  <label class="form-check-label" :for="`assistant-${user.id}`"> {{ user.firstName }} </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="showForm" class="projects-section">
        <div class="projects-container">
          <div class="projects-header">
            <h5 class="section-title">Proyectos</h5>
            <div v-if="!viewMode" class="form-check form-switch">
              <input
                id="activeProjectsSwitch"
                v-model="showActiveProjects"
                class="form-check-input"
                type="checkbox"
                @change="filterProjects"
              />
              <label class="form-check-label" for="activeProjectsSwitch">
                {{ showActiveProjects ? 'Mostrar Activos' : 'Mostrar Otros Estados' }}
              </label>
            </div>
          </div>
          <div class="table-responsive">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th class="header-violet" style="width: 20%">Proyecto</th>
                  <th class="header-violet" style="width: 40%">
                    Check actual del proyecto, reuniones ya calendarizadas, tareas ya programadas
                  </th>
                  <th class="header-violet" style="width: 40%">
                    ¿Hay que agendar algo para hoy? ¿Nuevas tareas de hoy que salieron en la daily?
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="displayedProjects.length === 0">
                  <td colspan="3" class="text-center text-muted">
                    {{
                      viewMode
                        ? 'No hay proyectos registrados'
                        : `No hay proyectos ${showActiveProjects ? 'activos' : 'en otros estados'}`
                    }}
                  </td>
                </tr>
                <tr v-for="project in displayedProjects" :key="project.id">
                  <td class="project-name">
                    <div class="d-flex align-items-center gap-2">
                      <span>{{ project.name }}</span>
                      <span
                        v-if="project.currentState && project.currentState.currentState !== 'Active'"
                        class="badge"
                        :class="getStateBadgeClass(project.currentState.currentState)"
                      >
                        {{ getStateLabel(project.currentState.currentState) }}
                      </span>
                    </div>
                  </td>
                  <td>
                    <textarea
                      v-model="reportData[project.id].completedTasks"
                      class="form-control textarea-field"
                      rows="3"
                      placeholder="Describe el estado actual..."
                      :readonly="viewMode"
                    ></textarea>
                  </td>
                  <td>
                    <textarea
                      v-model="reportData[project.id].plannedTasks"
                      class="form-control textarea-field"
                      rows="3"
                      placeholder="Describe nuevas tareas..."
                      :readonly="viewMode"
                    ></textarea>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="!viewMode" class="d-flex justify-content-end gap-2 mt-4">
            <button class="btn btn-outline-secondary" :disabled="isSaving" @click="resetForm">Cancelar</button>
            <button class="btn btn-primary" :disabled="!isFormValid || isSaving" @click="saveDailyReports">
              <span v-if="isSaving">
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Guardando...
              </span>
              <span v-else>{{ hasExistingReport ? 'Actualizar Daily Report' : 'Guardar Daily Report' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
  </div>
</template>

<script>
import DailyReportService from '@/services/daily-report'
import ProjectsService from '@/services/projects'
import UsersService from '@/services/users'
import { useToaster } from '@/composables/alerts/toasts/useToaster'

export default {
  name: 'DailyReport',

  setup() {
    const { addToast } = useToaster()

    return { addToast }
  },

  data() {
    return {
      projectsService: new ProjectsService(),
      usersService: new UsersService(),
      dailyReportService: new DailyReportService(),
      allProjects: [],
      filteredProjects: [],
      dailyUsers: [],
      existingReports: [],
      selectedDate: this.getTodayDate(),
      selectedLeader: '',
      lastLeader: '',
      selectedAssistants: [],
      reportData: {},
      leaderLoadedFromDate: false,
      showActiveProjects: true,
      viewMode: false,
      noDataForDate: false,
      hasExistingReport: false,
      showForm: true,
      isLoading: false,
      isSaving: false
    }
  },

  computed: {
    isFormValid() {
      if (!this.selectedLeader || this.selectedAssistants.length === 0) {
        return false
      }
      const hasContent = this.allProjects.some((project) => {
        const data = this.reportData[project.id]

        return data && ((data.completedTasks && data.completedTasks.trim()) || (data.plannedTasks && data.plannedTasks.trim()))
      })

      return hasContent
    },

    displayedProjects() {
      if (this.viewMode) {
        return this.allProjects.filter((project) => {
          const data = this.reportData[project.id]

          return data && (data.completedTasks || data.plannedTasks)
        })
      }

      return this.filteredProjects
    }
  },

  watch: {
    watch: {
      selectedLeader(newVal, oldVal) {
        if (newVal && !this.selectedAssistants.includes(newVal)) {
          this.selectedAssistants.push(newVal)
        }
      }
    }
  },

  mounted() {
    this.loadData()
  },

  methods: {
    async loadData() {
      this.isLoading = true

      try {
        const projectsResponse = await this.projectsService.getAllProjects()

        this.allProjects = projectsResponse.data || []
        const newReportData = {}

        this.allProjects.forEach((project) => {
          newReportData[project.id] = {
            completedTasks: '',
            plannedTasks: ''
          }
        })
        this.reportData = newReportData

        this.filterProjects()

        const usersResponse = await this.usersService.getDailyUsers()

        this.dailyUsers = usersResponse.data || []

        await this.loadLastLeader()

        await this.loadLeaderByDate()

        await this.loadReportsByDate()

        if (!this.viewMode && !this.hasExistingReport && this.selectedAssistants.length === 1) {
          this.selectedAssistants = this.dailyUsers.map((user) => user.id)
        } else if (this.selectedLeader && !this.selectedAssistants.includes(this.selectedLeader)) {
          this.selectedAssistants.push(this.selectedLeader)
        }
      } catch (error) {
        console.error('Error cargando datos:', error)
        this.showErrorNotification('Error al cargar los datos: ' + error.message)
      } finally {
        this.isLoading = false
      }
    },

    filterProjects() {
      if (this.showActiveProjects) {
        this.filteredProjects = this.allProjects.filter((project) => project.currentState.currentState === 'Active')
      } else {
        this.filteredProjects = this.allProjects.filter((project) => project.currentState.currentState !== 'Active')
      }
    },

    async loadLastLeader() {
      try {
        const response = await this.dailyReportService.getLastLeader()

        if (response.data) {
          this.lastLeader = `${response.data.firstName}`
        }
      } catch (error) {
        console.log('No hay líder previo')
      }
    },

    async loadLeaderByDate() {
      try {
        const response = await this.dailyReportService.getLeaderByDate(this.selectedDate)

        if (response.data) {
          this.selectedLeader = response.data.id
          this.leaderLoadedFromDate = true

          if (!this.selectedAssistants.includes(response.data.id)) {
            this.selectedAssistants.push(response.data.id)
          }
        } else {
          this.leaderLoadedFromDate = false
        }
      } catch (error) {
        console.log('No hay líder asignado para esta fecha')
        this.leaderLoadedFromDate = false
      }
    },

    async loadReportsByDate() {
      try {
        const response = await this.dailyReportService.getDailyReportByDate(this.selectedDate)

        const dailyReport = response.data

        if (dailyReport && dailyReport.projectReports) {
          this.existingReports = dailyReport.projectReports.map((pr) => ({
            id: pr.id,
            completedTasks: pr.completedTasks,
            plannedTasks: pr.plannedTasks,
            project: pr.project,
            leader: dailyReport.leader,
            assistants: dailyReport.assistants || []
          }))
        } else {
          this.existingReports = []
        }

        const isToday = this.isToday()
        const isWithinEditableRange = this.isDateWithinEditableRange()

        if (this.existingReports.length > 0) {
          this.hasExistingReport = true

          if (isToday) {
            this.viewMode = false
            this.noDataForDate = false
            this.showForm = true
            await this.loadExistingReportData()
          } else if (isWithinEditableRange) {
            this.viewMode = false
            this.noDataForDate = false
            this.showForm = true
            await this.loadExistingReportData()
          } else {
            this.viewMode = true
            this.noDataForDate = false
            this.showForm = true
            await this.loadExistingReportData()
          }
        } else {
          this.hasExistingReport = false

          if (isToday) {
            this.viewMode = false
            this.noDataForDate = false
            this.showForm = true
          } else if (isWithinEditableRange) {
            this.viewMode = false
            this.noDataForDate = true
            this.showForm = true
          } else {
            this.viewMode = false
            this.noDataForDate = true
            this.showForm = false
          }
        }
      } catch (error) {
        console.error('Error cargando reportes por fecha:', error)

        if (error.response?.status === 404) {
          const isToday = this.isToday()
          const isWithinEditableRange = this.isDateWithinEditableRange()

          this.existingReports = []
          this.hasExistingReport = false
          this.selectedLeader = ''
          this.selectedAssistants = []

          if (isToday) {
            this.viewMode = false
            this.noDataForDate = false
            this.showForm = true
          } else if (isWithinEditableRange) {
            this.viewMode = false
            this.noDataForDate = true
            this.showForm = true
          } else {
            this.viewMode = false
            this.noDataForDate = true
            this.showForm = false
          }

          return
        }
        this.existingReports = []
        this.hasExistingReport = false
        const isToday = this.isToday()
        const isWithinEditableRange = this.isDateWithinEditableRange()

        if (isToday) {
          this.viewMode = false
          this.noDataForDate = false
          this.showForm = true
        } else if (isWithinEditableRange) {
          this.viewMode = false
          this.noDataForDate = true
          this.showForm = true
        } else {
          this.viewMode = false
          this.noDataForDate = true
          this.showForm = false
        }
      }
    },
    isToday() {
      const today = new Date()

      today.setHours(0, 0, 0, 0)

      const selectedDateObj = new Date(this.selectedDate + 'T00:00:00')

      selectedDateObj.setHours(0, 0, 0, 0)

      return today.getTime() === selectedDateObj.getTime()
    },

    async loadExistingReportData() {
      try {
        const reportsByProject = {}
        let dailyReportAssistants = []

        this.existingReports.forEach((report) => {
          if (report.project) {
            reportsByProject[report.project.id] = {
              completedTasks: report.completedTasks || '',
              plannedTasks: report.plannedTasks || ''
            }
          }
          if (!this.selectedLeader && report.leader) {
            this.selectedLeader = report.leader.id
          }

          if (dailyReportAssistants.length === 0 && report.assistants && report.assistants.length > 0) {
            dailyReportAssistants = report.assistants
          }
        })
        if (dailyReportAssistants.length > 0) {
          this.selectedAssistants = dailyReportAssistants
            .map((assistant) => {
              if (typeof assistant === 'number') {
                return assistant
              }

              return assistant.id || null
            })
            .filter((id) => id !== null && !isNaN(id))
        }

        this.allProjects.forEach((project) => {
          if (reportsByProject[project.id]) {
            this.reportData[project.id] = reportsByProject[project.id]
          }
        })
      } catch (error) {
        console.error('Error cargando datos de reportes existentes:', error)
      }
    },

    async onDateChange() {
      this.isLoading = true
      this.selectedLeader = ''
      this.selectedAssistants = []
      this.leaderLoadedFromDate = false
      this.hasExistingReport = false
      this.allProjects.forEach((project) => {
        this.reportData[project.id] = {
          completedTasks: '',
          plannedTasks: ''
        }
      })
      await this.loadLeaderByDate()
      await this.loadReportsByDate()

      if (!this.viewMode && !this.hasExistingReport && this.selectedAssistants.length === 1) {
        this.selectedAssistants = this.dailyUsers.map((user) => user.id)
      } else if (this.selectedLeader && !this.selectedAssistants.includes(this.selectedLeader)) {
        this.selectedAssistants.push(this.selectedLeader)
      }

      this.isLoading = false
    },

    getTodayDate() {
      const today = new Date()

      return today.toISOString().split('T')[0]
    },

    isDateWithinEditableRange() {
      const today = new Date()

      today.setHours(0, 0, 0, 0)

      const selectedDateObj = new Date(this.selectedDate + 'T00:00:00')

      selectedDateObj.setHours(0, 0, 0, 0)

      const diffTime = today - selectedDateObj
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

      return diffDays >= 1 && diffDays <= 7
    },

    onLeaderChange() {
      this.leaderLoadedFromDate = false
    },

    getStateBadgeClass(state) {
      const classes = {
        Draft: 'bg-warning',
        Active: 'bg-success',
        Finished: 'bg-info',
        Canceled: 'bg-danger'
      }

      return classes[state] || 'bg-secondary'
    },

    getStateLabel(state) {
      const labels = {
        Draft: 'Borrador',
        Active: 'Activo',
        Finished: 'Finalizado',
        Canceled: 'Cancelado'
      }

      return labels[state] || state
    },

    getLeaderName() {
      if (!this.selectedLeader) return ''
      const leader = this.dailyUsers.find((u) => u.id === this.selectedLeader)

      return leader ? `${leader.firstName}` : ''
    },

    getUserName(userId) {
      if (!userId) return ''

      if (typeof userId === 'object' && userId !== null && userId.firstName) {
        return userId.firstName
      }
      const numericId = typeof userId === 'number' ? userId : parseInt(userId)

      const user = this.dailyUsers.find((u) => u.id === numericId)

      return user ? user.firstName : `Usuario ${numericId}`
    },

    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString + 'T00:00:00')

      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },

    async saveDailyReports() {
      if (!this.isFormValid) {
        this.showErrorNotification('Por favor completa todos los campos requeridos')

        return
      }

      this.isSaving = true

      // Definir dailyReportData aquí, antes del try
      const projects = this.allProjects
        .filter((project) => {
          const data = this.reportData[project.id]

          return (
            data && ((data.completedTasks && data.completedTasks.trim()) || (data.plannedTasks && data.plannedTasks.trim()))
          )
        })
        .map((project) => ({
          projectId: project.id,
          completedTasks: this.reportData[project.id].completedTasks?.trim() || '',
          plannedTasks: this.reportData[project.id].plannedTasks?.trim() || ''
        }))

      if (projects.length === 0) {
        this.showErrorNotification('Debes completar al menos un proyecto')
        this.isSaving = false

        return
      }

      const dailyReportData = {
        date: this.selectedDate,
        leaderId: parseInt(this.selectedLeader),
        assistants: this.selectedAssistants.map((id) => parseInt(id)),
        projects
      }

      try {
        if (this.hasExistingReport) {
          await this.dailyReportService.updateDailyReport(this.selectedDate, dailyReportData)
          this.showSuccessNotification('✓ Daily Report actualizado exitosamente')
        } else {
          await this.dailyReportService.createDailyReport(dailyReportData)
          this.showSuccessNotification('✓ Daily Report guardado exitosamente')
        }
        await this.loadReportsByDate()
      } catch (error) {
        console.error('Error guardando daily reports:', error)
        console.error('Detalles del error:', {
          response: error.response,
          data: error.response?.data,
          status: error.response?.status
        })

        let errorMessage = 'Error al guardar el Daily Report'

        if (error.response?.status === 400) {
          if (error.response?.data?.error?.includes('Ya existe')) {
            try {
              await this.dailyReportService.updateDailyReport(this.selectedDate, dailyReportData)
              this.showSuccessNotification('✓ Daily Report actualizado exitosamente')
              await this.loadReportsByDate()
              this.isSaving = false

              return
            } catch (updateError) {
              console.error('Error al actualizar en segundo intento:', updateError)
              errorMessage =
                'Error al actualizar el Daily Report: ' + (updateError.response?.data?.error || updateError.message)
            }
          } else {
            errorMessage = error.response.data.error || errorMessage
          }
        } else if (error.response?.status === 404) {
          errorMessage = 'No se encontró el Daily Report para actualizar'
        } else if (error.response?.status === 500) {
          errorMessage = 'Error interno del servidor. Por favor intenta nuevamente'
        } else if (error.response?.data?.error) {
          errorMessage = error.response.data.error
        } else if (error.message) {
          errorMessage += ': ' + error.message
        }

        this.showErrorNotification('✗ ' + errorMessage)
      } finally {
        this.isSaving = false
      }
    },

    resetForm() {
      this.selectedDate = this.getTodayDate()
      this.selectedLeader = ''
      this.selectedAssistants = []
      this.existingReports = []
      this.leaderLoadedFromDate = false
      this.showActiveProjects = true
      this.viewMode = false
      this.noDataForDate = false
      this.hasExistingReport = false
      this.showForm = true

      this.allProjects.forEach((project) => {
        this.reportData[project.id] = {
          completedTasks: '',
          plannedTasks: ''
        }
      })

      this.filterProjects()
      this.loadLeaderByDate()
      this.loadReportsByDate()
    },

    showSuccessNotification(message) {
      this.addToast(message, 'success')
    },

    showErrorNotification(message) {
      this.addToast(message, 'danger')
    }
  }
}
</script>

<style scoped lang="scss">
$primary: #7749f8;
$primary-dark: #5227cc;
$primary-light: #ebe5fc;
$secondary: #6c757d;
$gray: #adb5bd;
$gray-100: #f8f9fa;
$gray-600: #6c757d;
$gray-800: #343a40;
$headings-color: $gray-800;
$white: #fff;
$font-weight-semibold: 600;

.daily-report-container {
  min-height: auto;
  background-color: $gray-100;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
    padding-bottom: 3rem;
  }
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
}

// Header principal
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}

.page-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: $gray-800;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
}

.header-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    width: 100%;
  }
}

.last-leader-info {
  color: $gray-600;
  font-size: 0.95rem;

  strong {
    color: $gray-800;
  }
}

.date-input {
  width: 180px;

  @media (max-width: 768px) {
    width: 100%;
  }
}

.info-card {
  margin-bottom: 2rem;

  .card {
    border: none;
    border-radius: 12px;
    background-color: $white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  }

  .card-body {
    padding: 2rem;

    @media (max-width: 768px) {
      padding: 1.5rem;
    }
  }
}

.leader-container {
  .leader-input {
    max-width: 300px;

    @media (max-width: 768px) {
      max-width: 100%;
    }
  }
}

.assistants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.75rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.assistants-view {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  .badge {
    font-size: 0.9rem;
    padding: 0.5em 0.8em;
    font-weight: normal;
  }
}

.projects-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: $gray-800;
  margin: 0;
}

// Tabla
.header-violet {
  background-color: #ebe5fc !important;
  color: #7749f8 !important;
  padding: 16px !important;
  font-weight: $font-weight-semibold !important;
  vertical-align: middle !important;
  border: 1px solid #d4c5f9 !important;
  font-size: 14px !important;
}

.table {
  margin-bottom: 0;
  background-color: $white;
  border-radius: 8px;
  overflow: hidden;

  td {
    padding: 12px;
    vertical-align: middle;
    background-color: $white;
    color: $headings-color;
  }

  .project-name {
    font-weight: $font-weight-semibold;
    color: $headings-color;
  }
}

.textarea-field {
  resize: vertical;
  min-height: 80px;
  border: 1px solid #dee2e6;
  border-radius: 6px;

  &:focus {
    border-color: $primary;
    box-shadow: 0 0 0 0.2rem rgba($primary, 0.25);
  }

  &:read-only {
    background-color: $gray-100;
    cursor: default;
  }
}

// Formularios
.form-select,
.form-control {
  border-radius: 6px;
  border: 1px solid #dee2e6;

  &:focus {
    border-color: $primary;
    box-shadow: 0 0 0 0.2rem rgba($primary, 0.25);
  }
}

.form-check-input {
  &:checked {
    background-color: $primary;
    border-color: $primary;
  }

  &:focus {
    border-color: $primary;
    box-shadow: 0 0 0 0.2rem rgba($primary, 0.25);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.form-check-label {
  cursor: pointer;
  user-select: none;
}

.badge {
  font-size: 0.75rem;
  padding: 0.25em 0.6em;
}

// Botones
.btn-primary {
  background-color: $primary;
  border-color: $primary;
  padding: 0.5rem 1.5rem;

  &:hover:not(:disabled) {
    background-color: $primary-dark;
    border-color: $primary-dark;
  }

  &:disabled {
    background-color: lighten($primary, 20%);
    border-color: lighten($primary, 20%);
    cursor: not-allowed;
  }
}

.btn-outline-secondary {
  padding: 0.5rem 1.5rem;

  &:hover:not(:disabled) {
    background-color: $secondary;
    border-color: $secondary;
    color: $white;
  }
}

// Overlay de carga
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

// Utilidades
.text-muted {
  color: $gray !important;
}

.text-success {
  color: #28a745 !important;
}

.alert {
  border-radius: 8px;
  margin-bottom: 2rem;
}
</style>
