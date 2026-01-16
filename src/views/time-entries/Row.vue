<template>
  <ReadRow
    v-if="!isEditing"
    id="read-row-component"
    :entry="entry"
    :project-name="projectName"
    @repeat-task="repeatTask"
    @edit-entry="startEditEntry"
    @delete-entry="deleteTimeEntry"
  />

  <!-- Modo edición en línea -->
  <EditRow v-else :projects="projects" :entry="entry" @update-entry="updateEntry" @finish-edit="finishEditEntry" />
</template>
<script>
import EditRow from './EditRow.vue'
import ReadRow from './ReadRow.vue'

export default {
  components: {
    ReadRow,
    EditRow
  },
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
  emits: ['repeat-task', 'edit-entry', 'delete-entry', 'update-entry'],
  data() {
    return {
      isEditing: false
    }
  },
  computed: {
    projectName() {
      return this.projects.find((project) => project.id === this.entry.idProject)?.name || 'Proyecto no encontrado'
    }
  },
  methods: {
    formatTimeInputForEntry(entry) {
      if (entry.timeInput === null || entry.timeInput === undefined || entry.timeInput <= 0) {
        entry.hours = null

        return
      }
      entry.hours = parseFloat(entry.timeInput)
    },
    repeatTask() {
      this.$emit('repeat-task', this.entry)
    },
    startEditEntry() {
      this.isEditing = true
    },
    deleteTimeEntry() {
      this.$emit('delete-entry', this.entry)
    },
    finishEditEntry() {
      this.isEditing = false
    },
    updateEntry(editedEntry) {
      this.$emit('update-entry', editedEntry)
    }
  }
}
</script>
