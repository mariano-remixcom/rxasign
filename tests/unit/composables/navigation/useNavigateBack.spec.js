import { localHistory, useLocalHistory, useNavigateBack } from '@/composables/navigation/useNavigateBack'
import { useRouter } from 'vue-router'

describe('useNavigateBack', () => {
  beforeEach(() => {
    vi.mock('vue-router', () => ({
      useRouter: vi.fn()
    }))

    localHistory.value = 0
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('should navigate back in history if local history is greater than 1', () => {
    const push = vi.fn()
    const go = vi.fn()

    useRouter.mockReturnValue({
      push,
      go
    })
    localHistory.value = 2

    const { goBack } = useNavigateBack()

    goBack()

    expect(go).toHaveBeenCalledWith(-1)
    expect(push).not.toHaveBeenCalled()
  })

  it('should navigate to home if local history is 1 or less', () => {
    const push = vi.fn()
    const go = vi.fn()

    useRouter.mockReturnValue({
      push,
      go
    })

    const { goBack } = useNavigateBack()

    goBack()

    expect(push).toHaveBeenCalledWith('/')
    expect(go).not.toHaveBeenCalled()
  })
})

describe('useLocalHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
    localHistory.value = 0
  })

  it('should increment local history count', () => {
    const { incrementLocalHistory } = useLocalHistory()

    incrementLocalHistory()
    incrementLocalHistory()

    expect(localHistory.value).toBe(2)
  })
})
