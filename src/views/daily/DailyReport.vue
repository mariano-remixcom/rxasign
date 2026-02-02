<template>
  <div class="daily-report-container">
    <div class="card shadow-sm">
      <div class="card-body">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h4 class="mb-0 fw-semibold">Daily Report</h4>
          <div class="d-flex align-items-center gap-3">
            <span class="text-muted">
              último líder: <strong>{{ lastLeader || 'N/A' }}</strong>
            </span>
            <input v-model="selectedDate" type="date" class="form-control" style="width: auto" @change="loadReportsByDate" />
          </div>
        </div>

        <!-- Alert si ya existen reportes -->
        <div v-if="existingReports.length > 0" class="alert alert-info" role="alert">
          <i class="bi bi-info-circle me-2"></i>
          Ya existen {{ existingReports.length }} reportes para esta fecha.
        </div>

        <!-- Leader Selection -->
        <div class="mb-4">
          <label class="form-label fw-semibold">Líder:</label>
          <select v-model="selectedLeader" class="form-select" @change="onLeaderChange">
            <option value="">Selecciona al líder</option>
            <option v-for="user in dailyUsers" :key="user.id" :value="user.id">{{ user.firstName }}</option>
          </select>
        </div>

        <!-- Assistants Selection -->
        <div class="mb-4">
          <label class="form-label fw-semibold">Asistentes:</label>
          <div class="d-flex flex-wrap justify-content-start gap-3">
            <div v-for="user in dailyUsers" :key="user.id" style="min-width: 150px">
              <div class="form-check">
                <input
                  :id="`assistant-${user.id}`"
                  v-model="selectedAssistants"
                  class="form-check-input"
                  type="checkbox"
                  :value="user.id"
                  :disabled="user.id === selectedLeader"
                />
                <label class="form-check-label" :for="`assistant-${user.id}`"> {{ user.firstName }} </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Projects Table -->
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
              <tr v-if="activeProjects.length === 0">
                <td colspan="3" class="text-center text-muted">No hay proyectos activos</td>
              </tr>
              <tr v-for="project in activeProjects" :key="project.id">
                <td class="project-name">
                  <div class="d-flex align-items-center gap-2">
                    <span>{{ project.name }}</span>
                  </div>
                </td>
                <td>
                  <textarea
                    v-model="reportData[project.id].completedTasks"
                    class="form-control textarea-field"
                    rows="3"
                    placeholder="Describe el estado actual..."
                  ></textarea>
                </td>
                <td>
                  <textarea
                    v-model="reportData[project.id].plannedTasks"
                    class="form-control textarea-field"
                    rows="3"
                    placeholder="Describe nuevas tareas..."
                  ></textarea>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Action Buttons -->
        <div class="d-flex justify-content-end gap-2 mt-4">
          <button class="btn btn-outline-secondary" :disabled="isSaving" @click="resetForm">Cancelar</button>
          <button class="btn btn-primary" :disabled="!isFormValid || isSaving" @click="saveDailyReports">
            <span v-if="isSaving">
              <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Guardando...
            </span>
            <span v-else>Guardar Daily Report</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
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

export default {
  name: 'DailyReport',

  data() {
    return {
      // Services
      projectsService: new ProjectsService(),
      usersService: new UsersService(),
      dailyReportService: new DailyReportService(),

      // Data
      activeProjects: [],
      dailyUsers: [],
      existingReports: [],

      // Form data
      selectedDate: this.getTodayDate(),
      selectedLeader: '',
      lastLeader: '',
      selectedAssistants: [],
      reportData: {},

      // States
      isLoading: false,
      isSaving: false,

      // Modal
      selectedProject: null
    }
  },

  computed: {
    isFormValid() {
      // Validar que haya líder, asistentes y al menos un proyecto con contenido
      if (!this.selectedLeader || this.selectedAssistants.length === 0) {
        return false
      }

      // Verificar que al menos un proyecto tenga contenido
      const hasContent = this.activeProjects.some((project) => {
        const data = this.reportData[project.id]

        return data && (data.completedTasks || data.plannedTasks)
      })

      return hasContent
    }
  },

  watch: {
    selectedLeader(newVal, oldVal) {
      // Si el nuevo líder estaba en los asistentes, lo removemos
      if (newVal && this.selectedAssistants.includes(newVal)) {
        this.selectedAssistants = this.selectedAssistants.filter((id) => id !== newVal)
      }

      // Si el líder anterior no está seleccionado como asistente, lo agregamos automáticamente
      if (oldVal && !this.selectedAssistants.includes(oldVal) && oldVal !== '') {
        this.selectedAssistants.push(oldVal)
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
        console.log('Iniciando carga de datos...')

        // Cargar proyectos activos
        console.log('Cargando proyectos activos...')
        const projectsResponse = await this.projectsService.getActiveProjects()

        console.log('Proyectos recibidos:', projectsResponse.data)
        this.activeProjects = projectsResponse.data || []

        // Inicializar reportData para cada proyecto (sin $set)
        const newReportData = {}

        this.activeProjects.forEach((project) => {
          newReportData[project.id] = {
            completedTasks: '',
            plannedTasks: ''
          }
        })
        this.reportData = newReportData
        console.log('reportData inicializado:', this.reportData)

        // Cargar usuarios para daily
        console.log('Cargando usuarios para daily...')
        const usersResponse = await this.usersService.getDailyUsers()

        console.log('Usuarios recibidos:', usersResponse.data)
        this.dailyUsers = usersResponse.data || []

        // Marcar todos los usuarios como asistentes por defecto
        this.selectedAssistants = this.dailyUsers.map((user) => user.id)
        console.log('Asistentes seleccionados por defecto:', this.selectedAssistants)

        // Cargar último líder
        console.log('Cargando último líder...')
        await this.loadLastLeader()

        // Cargar reportes de la fecha seleccionada
        console.log('Cargando reportes por fecha...')
        await this.loadReportsByDate()

        console.log('Carga de datos completada exitosamente')
      } catch (error) {
        console.error('Error completo:', error)
        console.error('Error message:', error.message)
        console.error('Error response:', error.response)
        this.showErrorNotification('Error al cargar los datos: ' + error.message)
      } finally {
        this.isLoading = false
      }
    },

    async loadLastLeader() {
      try {
        const response = await this.dailyReportService.getLastLeader()

        console.log('Response último líder:', response)
        if (response.data) {
          this.lastLeader = `${response.data.firstName} ${response.data.lastName}`
        }
      } catch (error) {
        // Si no hay reportes previos, es un error 404 y está bien
        console.log('No hay líder previo o error:', error.response?.status)
        if (error.response?.status !== 404) {
          console.error('Error inesperado al cargar líder:', error)
        }
      }
    },

    async loadReportsByDate() {
      try {
        const response = await this.dailyReportService.getDailyReportsByDate(this.selectedDate)

        console.log('Response reportes por fecha:', response)
        this.existingReports = response.data || []
      } catch (error) {
        console.error('Error cargando reportes por fecha:', error)
        // No es crítico si no hay reportes
        this.existingReports = []
      }
    },

    getTodayDate() {
      const today = new Date()

      return today.toISOString().split('T')[0]
    },

    onLeaderChange() {
      console.log('Líder seleccionado:', this.selectedLeader)
    },

    async saveDailyReports() {
      if (!this.isFormValid) {
        this.showErrorNotification('Por favor completa todos los campos requeridos')

        return
      }

      this.isSaving = true

      try {
        // Crear un reporte por cada proyecto que tenga contenido
        const reportsToCreate = this.activeProjects
          .filter((project) => {
            const data = this.reportData[project.id]

            return data && (data.completedTasks || data.plannedTasks)
          })
          .map((project) => ({
            date: this.selectedDate,
            leaderId: this.selectedLeader,
            assistants: this.selectedAssistants,
            projectId: project.id,
            completedTasks: this.reportData[project.id].completedTasks || null,
            plannedTasks: this.reportData[project.id].plannedTasks || null
          }))

        // Guardar todos los reportes
        const promises = reportsToCreate.map((report) => this.dailyReportService.createDailyReport(report))

        await Promise.all(promises)

        this.showSuccessNotification(`${reportsToCreate.length} Daily Report(s) guardado(s) exitosamente`)

        // Recargar datos
        await this.loadReportsByDate()

        // Opcional: Limpiar formulario o mantener datos
        // this.resetForm()
      } catch (error) {
        console.error('Error guardando daily reports:', error)

        if (error.response?.data?.error) {
          this.showErrorNotification(error.response.data.error)
        } else {
          this.showErrorNotification('Error al guardar los Daily Reports')
        }
      } finally {
        this.isSaving = false
      }
    },

    resetForm() {
      this.selectedDate = this.getTodayDate()
      this.selectedLeader = ''
      this.selectedAssistants = []
      this.existingReports = []

      // Limpiar reportData
      this.activeProjects.forEach((project) => {
        this.reportData[project.id] = {
          completedTasks: '',
          plannedTasks: ''
        }
      })

      this.loadReportsByDate()
    },

    showSuccessNotification(message) {
      // Implementa tu sistema de notificaciones
      alert(message)
    },

    showErrorNotification(message) {
      // Implementa tu sistema de notificaciones
      alert(message)
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
  padding: 20px;
  position: relative;
  min-height: 100vh;
  background-color: $gray-100;
}

.card {
  border: none;
  border-radius: 8px;

  .card-body {
    padding: 2rem;
  }
}

.header-violet {
  background-color: #ebe5fc !important; // Color lila claro similar a la imagen
  color: #7749f8 !important; // Texto violeta
  padding: 16px !important;
  font-weight: $font-weight-semibold !important;
  vertical-align: middle !important;
  border: 1px solid #d4c5f9 !important; // Borde lila más claro
  font-size: 14px !important;
}

.table {
  margin-bottom: 0;

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
}

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

.btn-primary {
  background-color: $primary;
  border-color: $primary;

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
  &:hover:not(:disabled) {
    background-color: $secondary;
    border-color: $secondary;
    color: $white;
  }
}

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

.text-muted {
  color: $gray !important;
}

.alert {
  border-radius: 6px;
}

@media (max-width: 768px) {
  .daily-report-container {
    padding: 10px;
  }

  .card-body {
    padding: 1rem !important;
  }

  .table-responsive {
    font-size: 14px;
  }

  .d-flex.gap-3 {
    flex-direction: column;
    gap: 0.5rem !important;

    .form-control {
      width: 100% !important;
    }
  }

  // Asistentes en 2 columnas en móvil
  .col-md-3 {
    flex: 0 0 50%;
    max-width: 50%;
  }
}
</style>
