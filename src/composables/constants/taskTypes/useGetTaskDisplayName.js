import { TASK_TYPES } from '@/constants/TaskType'
import { ref } from 'vue'

export const useGetTaskDisplayName = function (taskTypes = TASK_TYPES) {
  const taskDictionary = ref(null)

  const _setup = () => {
    if (taskDictionary.value) return

    taskDictionary.value = taskTypes.reduce((acc, task) => {
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
