<template>
  <tr>
    <td>{{ formattedDate }}</td>
    <td>{{ clientName }} - {{ projectName }}</td>
    <td>{{ formattedTaskType }}</td>
    <td>{{ description }}</td>
    <td>{{ formattedHours }}</td>
  </tr>
</template>
<script>
import moment from 'moment'
import { useGetTaskDisplayName } from '@/composables/constants/useGetTaskDisplayName'

export default {
  props: {
    date: {
      type: String,
      required: true
    },
    clientName: {
      type: String,
      required: true
    },
    projectName: {
      type: String,
      required: true
    },
    taskType: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    hours: {
      type: Number,
      required: true
    }
  },
  setup() {
    return useGetTaskDisplayName()
  },
  computed: {
    formattedHours() {
      if (this.hours === undefined || this.hours === null || this.hours === '' || this.hours === 0) {
        return '0 min'
      }

      const minutes = Math.round(this.hours * 60)

      return `${minutes} min`
    },
    formattedTaskType() {
      return this.getTaskDisplayName(this.taskType)
    },
    formattedDate() {
      return moment(this.date).format('DD/MM/YY')
    }
  }
}
</script>
