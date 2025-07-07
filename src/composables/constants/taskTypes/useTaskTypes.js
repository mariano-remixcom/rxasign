import { TASK_TYPES } from '@/constants/TaskType'
import { ref } from 'vue'

export const useTaskTypes = () => {
  const taskTypes = ref(TASK_TYPES)

  return { taskTypes }
}
