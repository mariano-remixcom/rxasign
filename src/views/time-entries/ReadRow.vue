<template>
  <td>{{ entry.projectName }}</td>
  <td>{{ getTaskDisplayName(entry.taskType) }}</td>
  <td>{{ entry.description }}</td>
  <td>{{ formatHours(entry.hours) }}</td>
  <td>
    <div class="d-flex">
      <button class="btn btn-link text-primary p-1" :disabled="isLoadingEntries" @click="startEditEntry(entry)">
        <i class="bi bi-pencil"></i>
      </button>
      <button class="btn btn-link text-danger p-1" :disabled="isLoadingEntries" @click="deleteTimeEntry(entry)">
        <i class="bi bi-trash"></i>
      </button>
    </div>
  </td>
</template>
<script>
import { useFormatHours } from './composables/useFormatHours'
import { useGetTaskDisplayName } from '@/composables/constants/useGetTaskDisplayName'

export default {
  props: {
    entry: {
      type: Object,
      required: true
    },
    isLoadingEntries: {
      type: Boolean,
      default: false
    }
  },
  emits: ['edit-entry', 'delete-entry'],
  setup() {
    return {
      ...useFormatHours(),
      ...useGetTaskDisplayName()
    }
  },
  computed: {
    formattedHours() {
      return this.formatHours(this.entry.hours)
    }
  },
  methods: {
    startEditEntry(entry) {
      this.$emit('edit-entry', entry)
    },
    deleteTimeEntry(entry) {
      this.$emit('delete-entry', entry)
    }
  }
}
</script>
