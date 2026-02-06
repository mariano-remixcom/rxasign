<template>
  <div class="monthly-report-container">
    <div class="content-wrapper">
      <div class="page-header">
        <h2 class="page-title">Monthly Report</h2>
      </div>
      <div class="filters-card">
        <div class="card">
          <div class="card-body">
            <div class="row g-3 align-items-end">
              <div class="col-md-4">
                <label class="form-label fw-semibold">Mes:</label>
                <input
                  v-model="selectedMonth"
                  type="month"
                  class="form-control"
                  :max="getCurrentMonth()"
                  @change="onFilterChange"
                />
              </div>
              <div class="col-md-5">
                <label class="form-label fw-semibold">Proyecto:</label>
                <select v-model="selectedProjectId" class="form-select" @change="onFilterChange">
                  <option value="">Todos los proyectos</option>
                  <option v-for="project in projects" :key="project.id" :value="project.id">
                    {{ project.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-3">
                <button class="btn btn-primary w-100" :disabled="!selectedMonth || isLoading" @click="loadMonthlyReports">
                  <span v-if="isLoading">
                    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Cargando...
                  </span>
                  <span v-else>
                    <i class="bi bi-search me-2"></i>
                    Buscar
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="hasSearched" class="results-section">
        <div v-if="groupedReports.length === 0" class="alert alert-warning" role="alert">
          <div class="d-flex align-items-center">
            <i class="bi bi-exclamation-triangle me-3" style="font-size: 1.5rem"></i>
            <div>
              <strong>No hay datos disponibles</strong>
              <p class="mb-0 mt-1">
                No se encontraron daily reports para {{ selectedProjectId ? 'el proyecto seleccionado' : 'ningún proyecto' }} en
                {{ getMonthName() }}.
              </p>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="results-header mb-3">
            <h5 class="section-title mb-0">
              {{ selectedProjectId ? getSelectedProjectName() : 'Todos los proyectos' }} - {{ getMonthName() }}
            </h5>
          </div>
          <div v-for="projectGroup in groupedReports" :key="projectGroup.projectId" class="project-group mb-4">
            <div class="project-group-header">
              <h6 class="project-name mb-0">{{ projectGroup.projectName }}</h6>
              <span class="badge bg-primary">{{ projectGroup.reports.length }} registros</span>
            </div>

            <div class="table-responsive">
              <table class="table table-bordered mb-0">
                <thead>
                  <tr>
                    <th class="header-violet" style="width: 12%">Fecha</th>
                    <th class="header-violet" style="width: 12%">Líder</th>
                    <th class="header-violet" style="width: 38%">Check actual del proyecto</th>
                    <th class="header-violet" style="width: 38%">Nuevas tareas del día</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="report in projectGroup.reports" :key="report.id">
                    <td class="date-cell">
                      {{ formatDate(report.dailyReport.date) }}
                    </td>
                    <td class="leader-cell">
                      {{ report.dailyReport.leader.firstName }}
                    </td>
                    <td>
                      <div class="report-content">
                        {{ report.completedTasks || '' }}
                      </div>
                    </td>
                    <td>
                      <div class="report-content">
                        {{ report.plannedTasks || '' }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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
import { useToaster } from '@/composables/alerts/toasts/useToaster'

export default {
  name: 'MonthlyReport',

  setup() {
    const { addToast } = useToaster()

    return { addToast }
  },

  data() {
    return {
      dailyReportService: new DailyReportService(),
      projectsService: new ProjectsService(),
      projects: [],
      monthlyReports: [],
      selectedMonth: this.getCurrentMonth(),
      selectedProjectId: '',
      isLoading: false,
      hasSearched: false
    }
  },

  computed: {
    groupedReports() {
      if (!this.monthlyReports || this.monthlyReports.length === 0) {
        return []
      }

      const groups = {}

      this.monthlyReports.forEach((report) => {
        const projectId = report.project.id

        if (!groups[projectId]) {
          groups[projectId] = {
            projectId,
            projectName: report.project.name,
            reports: []
          }
        }

        groups[projectId].reports.push(report)
      })

      Object.values(groups).forEach((group) => {
        group.reports.sort((a, b) => {
          return new Date(b.dailyReport.date) - new Date(a.dailyReport.date)
        })
      })

      return Object.values(groups).sort((a, b) => a.projectName.localeCompare(b.projectName))
    }
  },

  mounted() {
    this.loadProjects()
    this.loadMonthlyReports()
  },

  methods: {
    async loadProjects() {
      try {
        const response = await this.projectsService.getAllProjects()

        this.projects = response.data || []
      } catch (error) {
        console.error('Error cargando proyectos:', error)
        this.showErrorNotification('Error al cargar los proyectos')
      }
    },

    async loadMonthlyReports() {
      if (!this.selectedMonth) {
        return
      }

      this.isLoading = true
      this.hasSearched = true

      try {
        const [year, month] = this.selectedMonth.split('-')
        const startDate = `${year}-${month}-01`
        const lastDay = new Date(year, month, 0).getDate()
        const endDate = `${year}-${month}-${lastDay}`

        if (this.selectedProjectId) {
          const response = await this.dailyReportService.getProjectReportsByDateRange(
            this.selectedProjectId,
            startDate,
            endDate
          )

          this.monthlyReports = response.data || []
        } else {
          const response = await this.dailyReportService.getAllProjectReportsByDateRange(startDate, endDate)

          this.monthlyReports = response.data || []
        }
      } catch (error) {
        console.error('Error cargando reportes mensuales:', error)
        this.showErrorNotification('Error al cargar los reportes')
        this.monthlyReports = []
      } finally {
        this.isLoading = false
      }
    },

    onFilterChange() {
      this.loadMonthlyReports()
    },

    getCurrentMonth() {
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, '0')

      return `${year}-${month}`
    },

    getMonthName() {
      if (!this.selectedMonth) return ''

      const [year, month] = this.selectedMonth.split('-')
      const date = new Date(year, parseInt(month) - 1)

      return date.toLocaleDateString('es-ES', {
        month: 'long',
        year: 'numeric'
      })
    },

    getSelectedProjectName() {
      if (!this.selectedProjectId) return ''
      const project = this.projects.find((p) => p.id === parseInt(this.selectedProjectId))

      return project ? project.name : ''
    },

    formatDate(dateString) {
      if (!dateString) return ''

      let date

      if (dateString instanceof Date) {
        date = dateString
      } else {
        const dateOnly = dateString.split('T')[0]

        date = new Date(dateOnly + 'T00:00:00')
      }

      if (isNaN(date.getTime())) {
        console.error('Fecha inválida:', dateString)

        return 'Fecha inválida'
      }

      return date.toLocaleDateString('es-ES', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit'
      })
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

.monthly-report-container {
  min-height: 100vh;
  background-color: $gray-100;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
}

// Header principal
.page-header {
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
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

// Filtros - Contenedor compacto
.filters-card {
  margin-bottom: 2rem;

  .card {
    border: none;
    border-radius: 12px;
    background-color: $white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  }

  .card-body {
    padding: 1.25rem 1.5rem;

    @media (max-width: 768px) {
      padding: 1rem;
    }
  }
}

// Sección de resultados
.results-section {
  margin-top: 2rem;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 2px solid #dee2e6;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: $gray-800;
}

// Grupo de proyecto
.project-group {
  background-color: $white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.project-group-header {
  background-color: $primary-light;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #d4c5f9;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
}

.project-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: $primary;
}

// Tabla
.header-violet {
  background-color: #ebe5fc !important;
  color: #7749f8 !important;
  padding: 12px 16px !important;
  font-weight: $font-weight-semibold !important;
  vertical-align: middle !important;
  border: 1px solid #d4c5f9 !important;
  font-size: 0.9rem !important;
}

.table {
  margin-bottom: 0;

  td {
    padding: 12px 16px;
    vertical-align: top;
    background-color: $white;
    color: $headings-color;
    font-size: 0.9rem;
  }

  .date-cell {
    font-weight: $font-weight-semibold;
    color: $gray-800;
    white-space: nowrap;
  }

  .leader-cell {
    color: $gray-800;
  }
}

.report-content {
  max-height: 120px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.5;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: $gray-100;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: $gray;
    border-radius: 3px;

    &:hover {
      background: $gray-600;
    }
  }
}

// Formularios
.form-select,
.form-control {
  border-radius: 6px;
  border: 1px solid #dee2e6;
  font-size: 0.95rem;

  &:focus {
    border-color: $primary;
    box-shadow: 0 0 0 0.2rem rgba($primary, 0.25);
  }
}

.form-label {
  margin-bottom: 0.5rem;
  color: $gray-800;
  font-size: 0.9rem;
}

// Botones
.btn-primary {
  background-color: $primary;
  border-color: $primary;
  padding: 0.5rem 1.5rem;
  font-weight: 500;

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

// Badges
.badge {
  font-size: 0.8rem;
  padding: 0.35em 0.65em;
  font-weight: 500;
}

// Loading Overlay
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

// Alerts
.alert {
  border-radius: 8px;
  margin-bottom: 2rem;
}

// Utilidades
.text-muted {
  color: $gray !important;
  font-size: 0.9rem;
}

// Responsive
@media (max-width: 768px) {
  .table-responsive {
    font-size: 0.85rem;
  }

  .project-name {
    font-size: 1rem;
  }

  .section-title {
    font-size: 1.25rem;
  }

  .header-violet {
    font-size: 0.8rem !important;
    padding: 10px 12px !important;
  }

  .table td {
    padding: 10px 12px;
    font-size: 0.85rem;
  }

  .report-content {
    max-height: 100px;
    font-size: 0.85rem;
  }
}
</style>
