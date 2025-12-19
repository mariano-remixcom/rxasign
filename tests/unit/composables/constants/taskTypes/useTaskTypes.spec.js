import { TASK_TYPES } from '@/constants/TaskType'
import { useTaskTypes } from '@/composables/constants/taskTypes/useTaskTypes'

describe('useTaskTypes', () => {
  it('should return task types', () => {
    const { taskTypes } = useTaskTypes()

    expect(taskTypes).toHaveLength(TASK_TYPES.length)
  })
})
