<template>
  <td>
    <select
      v-model="selectedProject"
      class="form-select"
      :class="{ 'is-invalid': v$.selectedProject.$error }"
      :disabled="isSaving"
    >
      <option value="" disabled>Seleccione un proyecto</option>
      <option v-for="project in projects" :key="project.id" :value="project.id">
        {{ project.name }}
      </option>
    </select>
    <div v-if="v$.selectedProject.$error" class="invalid-feedback">Debe seleccionar un proyecto</div>
  </td>
  <td>
    <select
      v-model="selectedTaskType"
      class="form-select"
      :class="{ 'is-invalid': v$.selectedTaskType.$error }"
      :disabled="isSaving"
    >
      <option value="" disabled>Seleccione una tarea</option>
      <option v-for="task in taskTypes" :key="task.key" :value="task.key">{{ task.displayName }}</option>
    </select>
    <div v-if="v$.selectedTaskType.$error" class="invalid-feedback">Debe seleccionar una tarea</div>
  </td>
  <td>
    <input
      v-model="description"
      type="text"
      placeholder="Ingrese una descripción..."
      class="form-control"
      :disabled="isSaving"
    />
  </td>
  <td>
    <div>
      <div class="d-flex align-items-center">
        <select
          v-model="timeInput"
          class="form-select input-fixed-width text-end"
          :class="{ 'is-invalid': v$.timeInput.$error }"
          :disabled="isSaving"
        >
          <option v-for="minutes in timeOptions" :key="minutes" :value="minutes / 60">
            {{ formatHours(minutes / 60) }}
          </option>
        </select>
        <span class="mx-1">hs</span>
      </div>
      <div v-if="v$.timeInput.$error" class="invalid-feedback d-block">El tiempo debe ser mayor a 0</div>
    </div>
  </td>
  <td>
    <div class="d-flex">
      <button class="btn btn-link text-muted p-1" @click="cancelEditInline()">
        <i class="bi bi-x"></i>
      </button>
      <button class="btn btn-link text-success p-1" @click="onFormSubmit()">
        <div v-if="isSaving" class="spinner-border spinner-border-sm" role="status">
          <span class="visually-hidden">Guardando...</span>
        </div>
        <i v-else class="bi bi-check"></i>
      </button>
    </div>
  </td>
</template>
<script>
import TimeEntriesService from '@/services/time-entries'
import { minValue, required } from '@vuelidate/validators'
import { useFormatHours } from './composables/useFormatHours'
import { useTaskTypes } from '@/composables/constants/taskTypes/useTaskTypes'
import { useToaster } from '@/composables/alerts/toasts/useToaster'
import { useVuelidate } from '@vuelidate/core'

export default {
  name: 'EditRow',
  props: {
    entry: {
      type: Object,
      required: true
    },
    projects: {
      type: Array,
      required: true
    }
  },
  emits: ['update-entry', 'finish-edit'],
  setup() {
    return {
      v$: useVuelidate(),
      ...useFormatHours(),
      ...useToaster(),
      ...useTaskTypes()
    }
  },
  data() {
    return {
      defaultDescription: 'Espacio de trabajo',
      selectedProject: null,
      selectedTaskType: null,
      description: '',
      timeInput: 0,
      isSaving: false,
      timeOptions: Array.from({ length: 24 }, (_, i) => (i + 1) * 15),
      timeEntriesService: new TimeEntriesService()
    }
  },
  mounted() {
    this.selectedProject = this.entry.idProject
    this.selectedTaskType = this.entry.taskType
    this.description = this.entry.description
    this.timeInput = this.entry.hours
  },
  validations() {
    return {
      selectedProject: { required },
      selectedTaskType: { required },
      timeInput: { required, minValue: minValue(0.01) }
    }
  },
  methods: {
    async onFormSubmit() {
      this.isSaving = true
      this.v$.selectedProject.$touch()
      this.v$.selectedTaskType.$touch()
      this.v$.timeInput.$touch()

      if (!(await this.v$.$validate())) {
        this.isSaving = false

        return
      }

      await this.saveEntry()
    },
    async saveEntry() {
      try {
        const entryData = {
          idProject: this.selectedProject,
          taskType: this.selectedTaskType,
          description: this.description || this.defaultDescription,
          hours: this.timeInput,
          entryDate: this.entry.entryDate
        }

        const response = await this.timeEntriesService.updateTimeEntry(this.entry.id, entryData)

        if (response && response.data && response.data.success) {
          this.$emit('update-entry', response.data.data)
        }
      } catch (error) {
        this.addToast('Error al guardar la entrada de tiempo. Por favor, inténtelo de nuevo.', 'danger')
        console.error('Error al guardar entrada de tiempo:', error)
      } finally {
        this.isSaving = false
        this.$emit('finish-edit')
      }
    },
    cancelEditInline() {
      this.$emit('finish-edit')
    }
  }
}
</script>
<style scoped>
.input-fixed-width {
  width: 90px;
}

/* Animación suave para el spinner en el total */
.h4 .spinner-border-sm {
  margin-left: 8px;
}

/* Mejorar la alineación vertical de los spinners en los botones */
.btn .spinner-border-sm {
  vertical-align: middle;
}

/* Clase para campos con error */
.is-invalid {
  border-color: #dc3545;
}

/* Estilos para los mensajes de error */
.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: #dc3545;
}

/* Personalizar el color del spinner principal */
.spinner-border {
  color: #6f42c1 !important; /* Color púrpura para mantener consistencia */
}
</style>
