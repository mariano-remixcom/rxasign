<template>
  <td>{{ projectName }}</td>
  <td>{{ getTaskDisplayName(entry.taskType) }}</td>
  <td>{{ entry.description }}</td>
  <td>{{ formatHours(entry.hours) }}</td>
  <td>
    <div class="d-flex">
      <button class="btn btn-link text-primary p-1" @click="startEditEntry">
        <i class="bi bi-pencil"></i>
      </button>
      <button class="btn btn-link text-danger p-1" @click="deleteTimeEntry">
        <i class="bi bi-trash"></i>
      </button>
    </div>
  </td>
</template>
<script>
import { useFormatHours } from './composables/useFormatHours'
import { useGetTaskDisplayName } from '@/composables/constants/taskTypes/useGetTaskDisplayName'

export default {
  props: {
    projectName: {
      type: String,
      required: true
    },
    entry: {
      type: Object,
      required: true
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
    startEditEntry() {
      this.$emit('edit-entry')
    },
    deleteTimeEntry() {
      this.$emit('delete-entry')
    }
  }
}
</script>
