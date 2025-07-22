<template>
  <div class="mb-1 mt-3 rounded-3">
    <div class="container page-title-separation d-flex align-items-center justify-content-between">
      <div class="container-fluid">
        <h1 class="h3">Registro de horas</h1>
      </div>
    </div>
  </div>
  <div class="container mt-4">
    <div class="container">
      <div class="container">
        <div class="table-responsive">
          <table class="table">
            <thead class="table-light">
              <tr>
                <th></th>
              </tr>
            </thead>
            <tbody class="align-middle">
              <tr>
                <td>
                  <div class="d-flex align-items-center">
                    <button class="btn btn-light btn-sm px-2" :disabled="isLoadingEntries" @click="previousWeek">
                      <i class="bi bi-chevron-compact-left"></i>
                    </button>
                    <div
                      class="btn btn-grey btn-sm px-3"
                      style="cursor: pointer"
                      :class="{ disabled: isLoadingEntries }"
                      @click="resetToCurrentWeek"
                    >
                      Esta semana
                    </div>
                    <button class="btn btn-light btn-sm px-2" :disabled="isLoadingEntries" @click="nextWeek">
                      <i class="bi bi-chevron-compact-right"></i>
                    </button>
                    <!-- Días de la semana (solo laborales) -->
                    <div class="d-flex ms-4">
                      <div
                        v-for="(day, index) in workingDays"
                        :key="index"
                        :class="[
                          'px-3 py-1 mx-1 rounded-pill text-nowrap',
                          isSelectedDay(day) ? 'bg-purple text-white fw-semibold' : 'text-secondary cursor-pointer',
                          isLoadingEntries ? 'disabled' : ''
                        ]"
                        style="min-width: 100px; text-align: center; cursor: pointer"
                        @click="!isLoadingEntries && selectDay(day)"
                      >
                        {{ formatDayText(day) }}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tabla de registros -->
      <div class="container">
        <div class="table-responsive">
          <table class="table">
            <thead class="table-light">
              <tr>
                <th scope="col">Proyecto</th>
                <th scope="col">Tarea</th>
                <th scope="col">Descripción</th>
                <th scope="col">Tiempo</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody class="align-middle">
              <!-- Loader mientras se cargan las entradas -->
              <tr v-if="isLoadingEntries">
                <td colspan="5" class="text-center py-4">
                  <div class="d-flex justify-content-center align-items-center">
                    <div class="spinner-border spinner-border-sm text-primary me-2" role="status">
                      <span class="visually-hidden">Cargando...</span>
                    </div>
                    <span>Cargando registros...</span>
                  </div>
                </td>
              </tr>

              <!-- Sin registros - mensaje -->
              <tr v-else-if="timeEntries.length === 0">
                <td colspan="5" class="text-center py-4">
                  <h6>Aún no cargaste horas asociadas a este dia.</h6>
                </td>
              </tr>

              <!-- Filas de registros existentes -->
              <tr v-for="(entry, index) in timeEntries" :key="entry.id || `temp-${index}`">
                <Row
                  :entry="entry"
                  :projects="projects"
                  @edit-entry="startEditEntry(entry)"
                  @delete-entry="(entry) => deleteTimeEntry(entry)"
                  @update-entry="(updatedEntry) => updateEntry(updatedEntry, index)"
                />
              </tr>

              <!-- Fila de nuevo registro -->
              <tr v-if="showEntryForm">
                <td>
                  <select
                    v-model="currentEntry.idProject"
                    class="form-select"
                    :class="{ 'is-invalid': v$.currentEntry.idProject.$error }"
                    :disabled="isSavingNewEntry"
                  >
                    <option value="" disabled>Seleccione un proyecto</option>
                    <option v-for="project in projects" :key="project.id" :value="project.id">
                      {{ project.name }}
                    </option>
                  </select>
                  <div v-if="v$.currentEntry.idProject.$error" class="invalid-feedback">Debe seleccionar un proyecto</div>
                </td>
                <td>
                  <select
                    v-model="currentEntry.taskType"
                    class="form-select"
                    :class="{ 'is-invalid': v$.currentEntry.taskType.$error }"
                    :disabled="isSavingNewEntry"
                  >
                    <option value="" disabled>Seleccione una tarea</option>
                    <option v-for="task in taskTypes" :key="task.key" :value="task.key">
                      {{ task.displayName }}
                    </option>
                  </select>
                  <div v-if="v$.currentEntry.taskType.$error" class="invalid-feedback">Debe seleccionar una tarea</div>
                </td>
                <td>
                  <input
                    v-model="currentEntry.description"
                    type="text"
                    placeholder="Ingrese una descripción..."
                    class="form-control"
                    :disabled="isSavingNewEntry"
                  />
                </td>
                <td>
                  <div class="d-flex align-items-center">
                    <select
                      v-model="currentEntry.timeInput"
                      class="form-select input-fixed-width text-end"
                      :class="{ 'is-invalid': v$.currentEntry.hours.$error }"
                      :disabled="isSavingNewEntry"
                      @change="formatTimeInput"
                    >
                      <option v-for="minutes in timeOptions" :key="minutes" :value="formatHours(minutes / 60)">
                        {{ formatHours(minutes / 60) }}
                      </option>
                    </select>
                    <span class="mx-1">hs</span>
                  </div>

                  <div v-if="v$.currentEntry.hours.$error" class="invalid-feedback d-block">El tiempo debe ser mayor a 0</div>
                </td>

                <td>
                  <div class="d-flex">
                    <button class="btn btn-link text-muted p-1" :disabled="isSavingNewEntry" @click="cancelCreate">
                      <i class="bi bi-x fs-3"></i>
                    </button>
                    <button class="btn btn-link text-success p-1" :disabled="isSavingNewEntry" @click="saveTimeEntry">
                      <div v-if="isSavingNewEntry" class="spinner-border spinner-border-sm" role="status">
                        <span class="visually-hidden">Guardando...</span>
                      </div>
                      <i v-else class="bi bi-check fs-3"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Botón agregar y total -->
          <div class="d-flex justify-content-between p-3">
            <button class="btn btn-outline-primary" :disabled="isLoadingEntries || showEntryForm" @click="addNewEntry">
              <span v-if="isLoadingEntries" class="spinner-border spinner-border-sm me-2" role="status">
                <span class="visually-hidden">Cargando...</span>
              </span>
              Agregar
            </button>
            <div class="d-flex align-items-center font-weight-bold">
              <span class="me-2">Total:</span>
              <span class="h4 mb-0">
                <span v-if="isLoadingEntries" class="spinner-border spinner-border-sm" role="status">
                  <span class="visually-hidden">Calculando...</span>
                </span>
                <span v-else>{{ formatHours(totalHours) }} hs</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <DeleteModal
      :is-visible="isDeleteModalVisible"
      title="Eliminar"
      confirm-text="Eliminar"
      cancel-text="Cancelar"
      :message="deleteMessage"
      :is-loading="isDeletingEntry"
      @close="isDeleteModalVisible = false"
      @confirm="confirmDelete"
    >
      <p>{{ deleteMessage }}</p>
    </DeleteModal>
  </div>
</template>

<script>
import DeleteModal from '@/components/shared/DeleteModal.vue'
import ProjectsService from '@/services/projects'
import Row from './time-entries/Row.vue'
import TimeEntriesService from '@/services/time-entries'
import { addDays, endOfWeek, format, isSameDay, isWeekend, parse, startOfWeek, subDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { minValue, required } from '@vuelidate/validators'
import { useFormatHours } from './time-entries/composables/useFormatHours'
import { useTaskTypes } from '@/composables/constants/taskTypes/useTaskTypes'
import { useVuelidate } from '@vuelidate/core'

export default {
  components: {
    DeleteModal,
    Row
  },
  beforeRouteLeave(to, from, next) {
    this.saveCurrentDraftIfHasValidData()
    next()
  },
  setup() {
    return {
      v$: useVuelidate(),
      ...useFormatHours(),
      ...useTaskTypes()
    }
  },
  data() {
    return {
      projectsService: new ProjectsService(),
      timeEntriesService: new TimeEntriesService(),
      loading: false,
      today: new Date(),
      selectedDay: new Date(),
      weekStart: startOfWeek(new Date(), { weekStartsOn: 1 }),
      weekEnd: endOfWeek(new Date(), { weekStartsOn: 1 }),
      projects: [],
      timeEntries: [],
      showEntryForm: false,
      currentEntry: {
        id: null,
        idProject: '',
        taskType: '',
        description: '',
        hours: 0,
        timeInput: '',
        entryDate: ''
      },
      unsavedChanges: false,
      isDeleteModalVisible: false,
      entryToDelete: null,
      deleteMessage: '¿Está seguro que desea eliminar este registro?',
      isInitialized: false,
      isLoadingEntries: false,
      defaultDescription: 'Espacio de trabajo',
      isSavingNewEntry: false,
      isDeletingEntry: false,
      timeOptions: Array.from({ length: 24 }, (_, i) => (i + 1) * 15)
    }
  },
  computed: {
    weekDays() {
      const days = []
      let currentDay = this.weekStart

      while (currentDay <= this.weekEnd) {
        days.push(new Date(currentDay))
        currentDay = addDays(currentDay, 1)
      }

      return days
    },

    workingDays() {
      return this.weekDays.filter((day) => !isWeekend(day))
    },

    totalHours() {
      return this.timeEntries.reduce((total, entry) => {
        return total + (parseFloat(entry.hours) || 0)
      }, 0)
    },

    selectedDateFormatted() {
      return format(this.selectedDay, 'yyyy-MM-dd')
    }
  },

  validations() {
    return {
      currentEntry: {
        idProject: { required },
        taskType: { required },
        hours: { required, minValue: minValue(0.01) }
      }
    }
  },

  async created() {
    try {
      await this.getProjects()
      await this.initializeComponent()
    } catch (error) {
      console.error('Error durante la inicialización:', error)
      this.initializeWithCurrentDay()
    }
    window.addEventListener('beforeunload', this.handleBeforeUnload)
    window.addEventListener('pagehide', this.handlePageHide)
  },

  beforeUnmount() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload)
    window.removeEventListener('pagehide', this.handlePageHide)
  },

  methods: {
    handleBeforeUnload(event) {
      this.saveCurrentDraftIfHasValidData()
    },

    handlePageHide(event) {
      this.saveCurrentDraftIfHasValidData()
    },

    async initializeComponent() {
      const restored = await this.restoreFromLocalStorage()

      if (!restored) {
        this.initializeWithCurrentDay()
      }

      this.isInitialized = true
    },

    initializeWithCurrentDay() {
      const today = new Date()

      this.selectedDay = new Date(today)
      this.weekStart = startOfWeek(today, { weekStartsOn: 1 })
      this.weekEnd = endOfWeek(today, { weekStartsOn: 1 })
      this.loadTimeEntries()
    },

    previousWeek() {
      this.weekStart = subDays(this.weekStart, 7)
      this.weekEnd = subDays(this.weekEnd, 7)
      this.changeSelectedDay(this.workingDays[0]) // Lunes de la nueva semana
    },

    nextWeek() {
      this.weekStart = addDays(this.weekStart, 7)
      this.weekEnd = addDays(this.weekEnd, 7)
      this.changeSelectedDay(this.workingDays[0]) // Lunes de la nueva semana
    },

    resetToCurrentWeek() {
      const today = new Date()

      this.weekStart = startOfWeek(today, { weekStartsOn: 1 })
      this.weekEnd = endOfWeek(today, { weekStartsOn: 1 })
      this.changeSelectedDay(new Date(today))
    },

    selectDay(day) {
      // console.log(`SELECCIONANDO DÍA: ${format(day, 'yyyy-MM-dd')}`)
      // Verificar si necesitamos cambiar la semana visible
      const dayIsInVisibleWeek = this.workingDays.some((workingDay) => isSameDay(new Date(workingDay), new Date(day)))

      if (!dayIsInVisibleWeek) {
        this.weekStart = startOfWeek(day, { weekStartsOn: 1 })
        this.weekEnd = endOfWeek(day, { weekStartsOn: 1 })
      }

      this.changeSelectedDay(new Date(day))
    },

    // Método centralizado para cambiar de día
    changeSelectedDay(newDay) {
      const newDateStr = format(newDay, 'yyyy-MM-dd')
      const currentDateStr = this.selectedDateFormatted

      // Solo proceder si es un día diferente
      if (newDateStr === currentDateStr) {
        // Es el mismo día, no hacer nada
        return
      }
      // Guardar borrador actual SI HAY DATOS VÁLIDOS
      this.saveCurrentDraftIfHasValidData()
      // Limpiar formulario actual
      this.resetCurrentForm()
      this.timeEntries = []
      // Cambiar el día seleccionado
      this.selectedDay = new Date(newDay)
      // Cargar datos del nuevo día
      this.loadTimeEntries()
    },

    isSelectedDay(day) {
      if (!day || !this.selectedDay) return false

      return isSameDay(new Date(day), new Date(this.selectedDay))
    },

    formatDayText(day) {
      return format(day, 'EEE d MMM', { locale: es })
    },

    parseHours(timeStr) {
      if (!timeStr) return 0
      const [hours, minutes] = timeStr.split(':').map((part) => parseInt(part, 10) || 0)

      return hours + minutes / 60
    },

    formatTimeInput() {
      const timeStr = this.currentEntry.timeInput || '0:00'

      this.currentEntry.hours = this.parseHours(timeStr)
    },
    async loadTimeEntries() {
      // Prevenir llamadas múltiples
      if (this.isLoadingEntries) {
        return
      }

      this.isLoadingEntries = true
      const targetDate = this.selectedDateFormatted

      try {
        this.loading = true
        this.timeEntries = []
        const response = await this.timeEntriesService.getTimeEntriesByDate(targetDate)

        if (response && response.data.data && Array.isArray(response.data.data)) {
          this.timeEntries = response.data.data
        } else {
          this.timeEntries = []
        }

        this.checkForDraftForCurrentDay(targetDate)
      } catch (error) {
        console.error('Error al cargar entradas de tiempo:', error)
        this.timeEntries = []
      } finally {
        this.loading = false
        this.isLoadingEntries = false
      }
    },

    async getProjects() {
      try {
        const response = await this.projectsService.getAllProjects()

        if (response && response.data && Array.isArray(response.data)) {
          this.projects = response.data
        }
      } catch (error) {
        console.error('Error al recuperar los proyectos:', error)
      }
    },

    getProjectName(projectId) {
      const project = this.projects.find((p) => p.id === projectId)

      return project ? project.name : 'Proyecto desconocido'
    },
    addNewEntry() {
      this.resetCurrentForm()
      this.showEntryForm = true
    },
    resetCurrentForm() {
      this.showEntryForm = false
      this.currentEntry = {
        id: null,
        idProject: '',
        taskType: '',
        description: '',
        hours: 0,
        timeInput: '0:00',
        entryDate: this.selectedDateFormatted
      }

      if (this.v$) {
        this.v$.currentEntry.$reset()
      }
    },
    cancelCreate() {
      this.clearDraftForDate(this.selectedDateFormatted)
      this.resetCurrentForm()
    },
    async saveTimeEntry() {
      const result = await this.v$.currentEntry.$validate()

      if (!result) {
        return
      }

      this.formatTimeInput()
      this.isSavingNewEntry = true

      try {
        const entryData = {
          idProject: this.currentEntry.idProject,
          taskType: this.currentEntry.taskType,
          description: this.currentEntry.description || this.defaultDescription,
          hours: this.currentEntry.hours,
          entryDate: this.currentEntry.entryDate || this.selectedDateFormatted
        }

        const response = await this.timeEntriesService.createTimeEntry(entryData)

        if (response && response.data) {
          this.clearDraftForDate(this.selectedDateFormatted)
          // Hacer esto en vez de consultar el back evita que cancelen los edit y
          // se pierdan entradas que no se hayan guardado
          this.timeEntries.push(response.data.data)
          this.resetCurrentForm()
        }
      } catch (error) {
        console.error('Error al guardar entrada de tiempo:', error)
      } finally {
        this.isSavingNewEntry = false
      }
    },
    async updateEntry(updatedEntry, index) {
      this.timeEntries[index] = updatedEntry
    },
    async deleteTimeEntry(entry) {
      this.entryToDelete = entry
      this.isDeleteModalVisible = true
    },

    async confirmDelete() {
      this.isDeletingEntry = true
      try {
        await this.timeEntriesService.deleteTimeEntry(this.entryToDelete.id)
        await this.loadTimeEntries()
      } catch (error) {
        console.error('Error al eliminar entrada de tiempo:', error)
      } finally {
        this.isDeleteModalVisible = false
        this.entryToDelete = null
        this.isDeletingEntry = false
      }
    },

    saveCurrentDraftIfHasValidData() {
      if (this.showEntryForm && this.hasValidDraftData()) {
        const dateStr = this.selectedDateFormatted
        const draftKey = `timeEntry_draft_${dateStr}`

        const dataToSave = {
          entry: { ...this.currentEntry },
          selectedDate: dateStr,
          weekStart: format(this.weekStart, 'yyyy-MM-dd'),
          weekEnd: format(this.weekEnd, 'yyyy-MM-dd')
        }

        localStorage.setItem(draftKey, JSON.stringify(dataToSave))
        localStorage.setItem('lastTimeEntryDraft', dateStr)
      }
    },

    hasValidDraftData() {
      return (
        this.currentEntry.idProject ||
        this.currentEntry.taskType ||
        (this.currentEntry.description && this.currentEntry.description.trim()) ||
        (this.currentEntry.timeInput && this.currentEntry.timeInput !== '0:00')
      )
    },

    async restoreFromLocalStorage() {
      const lastDraftDate = localStorage.getItem('lastTimeEntryDraft')

      if (!lastDraftDate) {
        return false
      }
      const draftKey = `timeEntry_draft_${lastDraftDate}`
      const savedData = localStorage.getItem(draftKey)

      if (!savedData) {
        localStorage.removeItem('lastTimeEntryDraft')

        return false
      }

      try {
        const { entry, selectedDate, weekStart, weekEnd } = JSON.parse(savedData)

        if (!entry || !selectedDate) {
          this.clearDraftForDate(lastDraftDate)

          return false
        }

        if (!this.hasValidDraftDataInEntry(entry)) {
          this.clearDraftForDate(lastDraftDate)

          return false
        }

        this.selectedDay = parse(selectedDate, 'yyyy-MM-dd', new Date())
        if (weekStart && weekEnd) {
          this.weekStart = new Date(weekStart)
          this.weekEnd = new Date(weekEnd)
        } else {
          this.weekStart = startOfWeek(new Date(selectedDate), { weekStartsOn: 1 })
          this.weekEnd = endOfWeek(new Date(selectedDate), { weekStartsOn: 1 })
        }

        await this.loadTimeEntries()

        return true
      } catch (error) {
        console.error('Error al restaurar borrador:', error)
        this.clearDraftForDate(lastDraftDate)

        return false
      }
    },

    checkForDraftForCurrentDay(targetDate) {
      const dateToCheck = targetDate || this.selectedDateFormatted
      const draftKey = `timeEntry_draft_${dateToCheck}`
      const savedData = localStorage.getItem(draftKey)

      if (!savedData) {
        return
      }

      try {
        const { entry } = JSON.parse(savedData)

        if (!entry || !this.hasValidDraftDataInEntry(entry)) {
          this.clearDraftForDate(dateToCheck)

          return
        }
        if (dateToCheck === this.selectedDateFormatted) {
          this.currentEntry = {
            ...entry,
            entryDate: dateToCheck
          }
          this.showEntryForm = true

          if (this.v$) {
            this.v$.currentEntry.$reset()
          }
        }
      } catch (error) {
        console.error('Error al verificar borrador:', error)
        this.clearDraftForDate(dateToCheck)
      }
    },

    hasValidDraftDataInEntry(entry) {
      return (
        entry.idProject ||
        entry.taskType ||
        (entry.description && entry.description.trim()) ||
        (entry.timeInput && entry.timeInput !== '0:00')
      )
    },

    clearDraftForDate(dateStr) {
      const draftKey = `timeEntry_draft_${dateStr}`

      localStorage.removeItem(draftKey)
      if (localStorage.getItem('lastTimeEntryDraft') === dateStr) {
        localStorage.removeItem('lastTimeEntryDraft')
      }
    },
    clearAllDrafts() {
      const keys = Object.keys(localStorage)

      keys.forEach((key) => {
        if (key.startsWith('timeEntry_draft_')) {
          localStorage.removeItem(key)
        }
      })
      localStorage.removeItem('lastTimeEntryDraft')
    }
  }
}
</script>
<style scoped lang="scss">
.time-tracking-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
    sans-serif;
}

.nav-item {
  cursor: pointer;
  padding: 0.25rem 0;
}

select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
}

.table td {
  padding: 0.75rem;
}
.input-fixed-width {
  width: 80px;
}
.bg-purple {
  background-color: #5227cc !important;
}

.rounded-pill {
  border-radius: 20rem !important;
}
/* Estilos para los mensajes de error */
.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: #dc3545;
}

/* Clase para campos con error */
.is-invalid {
  border-color: #dc3545;
}

/* Ancho fijo para el campo de tiempo */
.input-fixed-width {
  max-width: 80px;
}

/* Color de fondo para día seleccionado */
.bg-purple {
  background-color: #6610f2;
}
/* Personalizar el color del spinner principal */
.spinner-border {
  color: #6f42c1 !important; /* Color púrpura para mantener consistencia */
}

/* Suavizar la transición cuando aparecen/desaparecen elementos */
.table tbody tr {
  transition: opacity 0.2s ease-in-out;
}

/* Estilo para elementos deshabilitados durante la carga */
.disabled {
  opacity: 0.6;
  pointer-events: none;
  cursor: not-allowed !important;
}

/* Mejorar el aspecto del botón "Esta semana" cuando está deshabilitado */
.btn-grey.disabled {
  background-color: #e9ecef;
  border-color: #dee2e6;
  color: #6c757d;
}

/* Estilo para los días de la semana cuando están deshabilitados */
.cursor-pointer.disabled {
  cursor: not-allowed !important;
  opacity: 0.5;
}

/* Animación suave para el spinner en el total */
.h4 .spinner-border-sm {
  margin-left: 8px;
}

/* Mejorar la alineación vertical de los spinners en los botones */
.btn .spinner-border-sm {
  vertical-align: middle;
}

/* Estilo para las filas de la tabla durante la carga */
.table tbody tr.loading {
  background-color: rgba(0, 0, 0, 0.02);
}
</style>
