import { useGetTaskDisplayName } from '@/composables/constants/taskTypes/useGetTaskDisplayName'

const TEST_TASK_TYPES = [
  { key: 'taskType1', displayName: 'Task Type 1' },
  { key: 'taskType2', displayName: 'Task Type 2' },
  { key: 'taskType3', displayName: 'Task Type 3' }
]

describe('useGetTaskDisplayName', () => {
  it('should return correct display name for given task key', () => {
    const { getTaskDisplayName } = useGetTaskDisplayName(TEST_TASK_TYPES)

    const displayName = getTaskDisplayName('taskType1')

    expect(displayName).toBe('Task Type 1')
  })

  it('should return the key itself if task key is not found', () => {
    const { getTaskDisplayName } = useGetTaskDisplayName(TEST_TASK_TYPES)

    const displayName = getTaskDisplayName('unknownTaskType')

    expect(displayName).toBe('unknownTaskType')
  })

  it('should use TASK_TYPES by default if no argument is provided', () => {
    const { getTaskDisplayName } = useGetTaskDisplayName()

    const displayName = getTaskDisplayName('InvestigacionDesarrollo')

    expect(displayName).toBe('I+D')
  })
})
