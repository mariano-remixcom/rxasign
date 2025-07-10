import { TASK_TYPES } from '@/constants/TaskType'
import { ref } from 'vue'

const taskDictionary = ref(null)

export const useGetTaskDisplayName = function () {
  const _setup = () => {
    if (taskDictionary.value) return

    taskDictionary.value = TASK_TYPES.reduce((acc, task) => {
      acc[task.key] = task.displayName

      return acc
    }, {})
  }

  _setup()

  const getTaskDisplayName = (key) => {
    return taskDictionary.value[key] || key
  }

  return { getTaskDisplayName }
}
