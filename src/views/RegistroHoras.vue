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
                    <button class="btn btn-light btn-sm px-2" @click="previousWeek">
                      <i class="bi bi-chevron-compact-left"></i>
                    </button>
                    <div class="btn btn-grey btn-sm px-3" style="cursor: pointer" @click="resetToCurrentWeek">Esta semana</div>
                    <button class="btn btn-light btn-sm px-2" @click="nextWeek">
                      <i class="bi bi-chevron-compact-right"></i>
                    </button>
                    <!-- Días de la semana (solo laborales) -->
                    <div class="d-flex ms-4">
                      <div
                        v-for="(day, index) in workingDays"
                        :key="index"
                        :class="[
                          'px-3 py-1 mx-1 rounded-pill text-nowrap',
                          isSelectedDay(day) ? 'bg-purple text-white fw-semibold' : 'text-secondary cursor-pointer'
                        ]"
                        style="min-width: 100px; text-align: center; cursor: pointer"
                        @click="selectDay(day)"
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
              <!-- Sin registros - mensaje -->
              <tr v-if="timeEntries.length === 0">
                <td colspan="5" class="text-center py-4">
                  <h6>Aún no cargaste horas asociadas a este dia.</h6>
                </td>
              </tr>

              <!-- Filas de registros existentes -->
              <tr v-for="(entry, index) in timeEntries" :key="entry.id || `temp-${index}`">
                <template v-if="!entry.isEditing">
                  <td>{{ getProjectName(entry.idProject) }}</td>
                  <td>{{ getTaskDisplayName(entry.taskType) }}</td>
                  <td>{{ entry.description }}</td>
                  <td>{{ formatHours(entry.time) }}</td>
                  <td>
                    <div class="d-flex">
                      <button class="btn btn-link text-primary p-1" @click="startEditEntry(entry)">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button class="btn btn-link text-danger p-1" @click="deleteTimeEntry(entry)">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </template>

                <!-- Modo edición en línea -->
                <template v-else>
                  <td>
                    <select
                      v-model="entry.idProject"
                      class="form-select"
                      :class="{ 'is-invalid': v$.editingEntries[index]?.idProject.$error }"
                    >
                      <option value="" disabled>Seleccione un proyecto</option>
                      <option v-for="project in projects" :key="project.id" :value="project.id">
                        {{ project.name }}
                      </option>
                    </select>
                    <div v-if="v$.editingEntries[index]?.idProject.$error" class="invalid-feedback">
                      Debe seleccionar un proyecto
                    </div>
                  </td>
                  <td>
                    <select
                      v-model="entry.taskType"
                      class="form-select"
                      :class="{ 'is-invalid': v$.editingEntries[index]?.taskType.$error }"
                    >
                      <option value="" disabled>Seleccione una tarea</option>
                      <option v-for="task in taskTypes" :key="task.key" :value="task.key">{{ task.displayName }}</option>
                    </select>
                    <div v-if="v$.editingEntries[index]?.taskType.$error" class="invalid-feedback">
                      Debe seleccionar una tarea
                    </div>
                  </td>
                  <td>
                    <input
                      v-model="entry.description"
                      type="text"
                      placeholder="Ingrese una descripción..."
                      class="form-control"
                    />
                  </td>
                  <td>
                    <div>
                      <div class="d-flex align-items-center">
                        <input
                          v-model="entry.timeInput"
                          type="text"
                          placeholder="0:00"
                          class="form-control input-fixed-width text-end"
                          :class="{ 'is-invalid': v$.editingEntries[index]?.time.$error }"
                          @blur="formatTimeInputForEntry(entry)"
                        />
                        <span class="mx-1">hs</span>
                      </div>
                      <div v-if="v$.editingEntries[index]?.time.$error" class="invalid-feedback d-block">
                        El tiempo debe ser mayor a 0
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="d-flex">
                      <button class="btn btn-link text-muted p-1" @click="cancelEditInline(entry)">
                        <i class="bi bi-x"></i>
                      </button>
                      <button class="btn btn-link text-success p-1" @click="saveEditedEntry(entry, index)">
                        <i class="bi bi-check"></i>
                      </button>
                    </div>
                  </td>
                </template>
              </tr>

              <!-- Fila de nuevo registro -->
              <tr v-if="showEntryForm">
                <td>
                  <select
                    v-model="currentEntry.idProject"
                    class="form-select"
                    :class="{ 'is-invalid': v$.currentEntry.idProject.$error }"
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
                  />
                </td>
                <td>
                  <div class="d-flex align-items-center">
                    <input
                      v-model="currentEntry.timeInput"
                      type="text"
                      placeholder="0:00"
                      class="form-control input-fixed-width text-end"
                      :class="{ 'is-invalid': v$.currentEntry.time.$error }"
                      @blur="formatTimeInput"
                    />
                    <span class="mx-1">hs</span>
                  </div>

                  <div v-if="v$.currentEntry.time.$error" class="invalid-feedback d-block">El tiempo debe ser mayor a 0</div>
                </td>

                <td>
                  <div class="d-flex">
                    <button class="btn btn-link text-muted p-1" @click="cancelEdit">
                      <i class="bi bi-x"></i>
                    </button>
                    <button class="btn btn-link text-success p-1" @click="saveTimeEntry">
                      <i class="bi bi-check"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Botón agregar y total -->
          <div class="d-flex justify-content-between p-3">
            <button class="btn btn-outline-primary" @click="addNewEntry">Agregar</button>
            <div class="d-flex align-items-center font-weight-bold">
              <span class="me-2">Total:</span>
              <span class="h4 mb-0">{{ formatHours(totalHours) }}</span>
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
import TimeEntriesService from '@/services/time-entries'
import { TASK_TYPES } from '@/constants/TaskType'
import { addDays, endOfWeek, format, isSameDay, isWeekend, parse, startOfWeek, subDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { minValue, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

export default {
  components: {
    DeleteModal
  },

  beforeRouteLeave(to, from, next) {
    this.saveCurrentDraftIfHasValidData()
    next()
  },

  setup() {
    return { v$: useVuelidate() }
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
      taskTypes: TASK_TYPES,
      timeEntries: [],
      editingEntries: [],
      showEntryForm: false,
      isEditing: false,
      currentEntry: {
        id: null,
        idProject: '',
        taskType: '',
        description: '',
        time: 0,
        timeInput: '',
        entryDate: ''
      },
      entriesBackup: [],
      unsavedChanges: false,
      isDeleteModalVisible: false,
      entryToDelete: null,
      deleteMessage: '¿Está seguro que desea eliminar este registro?',
      isInitialized: false,
      isLoadingEntries: false,
      defaultDescription: 'Espacio de trabajo'
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
        return total + (parseFloat(entry.time) || 0)
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
        time: { required, minValue: minValue(0.01) }
      },
      editingEntries: {
        $each: {
          idProject: { required },
          taskType: { required },
          time: { required, minValue: minValue(0.01) }
        }
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
        console.log('Es el mismo día, no se hace nada')

        return
      }
      // Guardar borrador actual SI HAY DATOS VÁLIDOS
      this.saveCurrentDraftIfHasValidData()
      // Limpiar formulario actual
      this.resetCurrentForm()
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

    formatHours(hours) {
      if (hours === undefined || hours === null) return '0:00'
      const numHours = parseFloat(hours)
      const wholeHours = Math.floor(numHours)
      const minutes = Math.round((numHours - wholeHours) * 60)

      return `${wholeHours}:${minutes.toString().padStart(2, '0')}`
    },

    parseHours(timeStr) {
      if (!timeStr) return 0
      const [hours, minutes] = timeStr.split(':').map((part) => parseInt(part, 10) || 0)

      return hours + minutes / 60
    },

    formatTimeInput() {
      let timeStr = this.currentEntry.timeInput || ''

      if (/^\d+$/.test(timeStr)) {
        timeStr = `${timeStr}:00`
      }
      if (!timeStr.includes(':')) {
        timeStr = '0:00'
      }
      const [hours, minutes] = timeStr.split(':').map((part) => parseInt(part, 10) || 0)

      this.currentEntry.timeInput = `${hours}:${minutes.toString().padStart(2, '0')}`
      this.currentEntry.time = this.parseHours(this.currentEntry.timeInput)
    },

    formatTimeInputForEntry(entry) {
      let timeStr = entry.timeInput || ''

      if (/^\d+$/.test(timeStr)) {
        timeStr = `${timeStr}:00`
      }
      if (!timeStr.includes(':')) {
        timeStr = '0:00'
      }
      const [hours, minutes] = timeStr.split(':').map((part) => parseInt(part, 10) || 0)

      entry.timeInput = `${hours}:${minutes.toString().padStart(2, '0')}`
      entry.time = this.parseHours(entry.timeInput)

      const editIndex = this.timeEntries.findIndex((e) => e.id === entry.id)

      if (editIndex !== -1 && this.editingEntries[editIndex]) {
        this.editingEntries[editIndex].time = entry.time
      }
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
        const response = await this.timeEntriesService.getTimeEntriesByDate(targetDate)

        if (response && response.data.data && Array.isArray(response.data.data)) {
          this.timeEntries = response.data.data.map((entry) => ({
            ...entry,
            isEditing: false,
            timeInput: this.formatHours(entry.time)
          }))
          this.editingEntries = JSON.parse(JSON.stringify(this.timeEntries))
        } else {
          this.timeEntries = []
          this.editingEntries = []
        }

        this.checkForDraftForCurrentDay(targetDate)
      } catch (error) {
        console.error('Error al cargar entradas de tiempo:', error)
        this.timeEntries = []
        this.editingEntries = []
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

    getTaskDisplayName(key) {
      const task = TASK_TYPES.find((t) => t.key === key)

      return task ? task.displayName : key
    },

    addNewEntry() {
      this.cancelAllEditing()
      this.resetCurrentForm()
      this.showEntryForm = true
    },

    resetCurrentForm() {
      this.showEntryForm = false
      this.isEditing = false
      this.currentEntry = {
        id: null,
        idProject: '',
        taskType: '',
        description: '',
        time: 0,
        timeInput: '0:00',
        entryDate: this.selectedDateFormatted
      }

      if (this.v$) {
        this.v$.currentEntry.$reset()
      }
    },

    startEditEntry(entry) {
      this.cancelAllEditing()
      this.showEntryForm = false
      this.entriesBackup = JSON.parse(JSON.stringify(this.timeEntries))
      entry.isEditing = true
      entry.timeInput = this.formatHours(entry.time)
      this.editingEntries = JSON.parse(JSON.stringify(this.timeEntries))

      if (this.v$ && this.v$.editingEntries) {
        const index = this.timeEntries.findIndex((e) => e.id === entry.id)

        if (index !== -1 && this.v$.editingEntries[index]) {
          this.v$.editingEntries[index].$reset()
        }
      }
    },

    cancelAllEditing() {
      if (this.entriesBackup.length > 0) {
        this.timeEntries = JSON.parse(JSON.stringify(this.entriesBackup))
        this.entriesBackup = []
      } else {
        this.timeEntries.forEach((entry) => {
          entry.isEditing = false
        })
      }

      if (this.v$ && this.v$.editingEntries) {
        this.v$.editingEntries.$reset()
      }
    },

    cancelEditInline(entry) {
      const originalEntry = this.entriesBackup.find((e) => e.id === entry.id)

      if (originalEntry) {
        const index = this.timeEntries.findIndex((e) => e.id === entry.id)

        if (index !== -1) {
          originalEntry.isEditing = false
          this.timeEntries.splice(index, 1, { ...originalEntry })
          this.editingEntries[index] = { ...originalEntry }
        }
      } else {
        entry.isEditing = false
      }

      if (this.v$ && this.v$.editingEntries) {
        const index = this.timeEntries.findIndex((e) => e.id === entry.id)

        if (index !== -1 && this.v$.editingEntries[index]) {
          this.v$.editingEntries[index].$reset()
        }
      }
    },

    async saveEditedEntry(entry, index) {
      if (this.v$.editingEntries[index]) {
        const result = await this.v$.editingEntries[index].$validate()

        if (!result) {
          return
        }
      }

      this.formatTimeInputForEntry(entry)

      try {
        const entryData = {
          idProject: entry.idProject,
          taskType: entry.taskType,
          description: entry.description || this.defaultDescription,
          time: entry.time,
          entryDate: entry.entryDate || this.selectedDateFormatted
        }

        const response = await this.timeEntriesService.updateTimeEntry(entry.id, entryData)

        if (response && response.data) {
          entry.isEditing = false
          this.entriesBackup = []
          if (this.v$ && this.v$.editingEntries && this.v$.editingEntries[index]) {
            this.v$.editingEntries[index].$reset()
          }
        }
      } catch (error) {
        console.error('Error al guardar entrada de tiempo:', error)
      }
    },

    cancelEdit() {
      this.clearDraftForDate(this.selectedDateFormatted)
      this.resetCurrentForm()
    },

    async saveTimeEntry() {
      const result = await this.v$.currentEntry.$validate()

      if (!result) {
        return
      }

      this.formatTimeInput()

      try {
        const entryData = {
          idProject: this.currentEntry.idProject,
          taskType: this.currentEntry.taskType,
          description: this.currentEntry.description || this.defaultDescription,
          time: this.currentEntry.time,
          entryDate: this.currentEntry.entryDate || this.selectedDateFormatted
        }

        let response

        if (this.isEditing && this.currentEntry.id) {
          response = await this.timeEntriesService.updateTimeEntry(this.currentEntry.id, entryData)
        } else {
          response = await this.timeEntriesService.createTimeEntry(entryData)
        }

        if (response && response.data) {
          this.clearDraftForDate(this.selectedDateFormatted)
          await this.loadTimeEntries()
          this.resetCurrentForm()
        }
      } catch (error) {
        console.error('Error al guardar entrada de tiempo:', error)
      }
    },

    async deleteTimeEntry(entry) {
      this.entryToDelete = entry
      this.isDeleteModalVisible = true
    },

    async confirmDelete() {
      try {
        await this.timeEntriesService.deleteTimeEntry(this.entryToDelete.id)
        await this.loadTimeEntries()
      } catch (error) {
        console.error('Error al eliminar entrada de tiempo:', error)
      } finally {
        this.isDeleteModalVisible = false
        this.entryToDelete = null
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
          this.isEditing = !!entry.id

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
</style>
