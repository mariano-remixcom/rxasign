import { EXCLUDED_URLS } from '@/services/interceptors/excluded-urls.const'
import { checkSessionExpired } from '@/services/interceptors/checkSessionExpired'
import { router } from '@/router'
import { useSession } from '@/composables/session/useSession'
import { useToaster } from '@/composables/alerts/toasts/useToaster'

vi.mock('@/composables/session/useSession', () => {
  return {
    useSession: vi.fn()
  }
})

vi.mock('@/composables/alerts/toasts/useToaster', () => {
  return {
    useToaster: vi.fn()
  }
})

vi.mock('@/router', () => {
  return {
    router: {
      push: vi.fn()
    }
  }
})

describe('checkSessionExpired', () => {
  EXCLUDED_URLS.forEach((url) => {
    it(`should throw same error if responseURL is ${url}`, async () => {
      const error = {
        request: {
          responseURL: `${import.meta.env.VITE_HOST_API}/auth/login`
        }
      }

      await expect(checkSessionExpired(error)).rejects.toEqual(error)
    })
  })

  it('should throw same error if status is not 401', async () => {
    const error = {
      request: {
        responseURL: `${import.meta.env.VITE_HOST_API}/some/other/url`
      },
      response: {
        status: 500
      }
    }

    await expect(checkSessionExpired(error)).rejects.toEqual(error)
  })

  it('should set session to false, add toast and redirect to login on 401 error', async () => {
    useSession.mockReturnValue({
      setSession: vi.fn()
    })

    useToaster.mockReturnValue({
      addToast: vi.fn().mockReturnValue(1),
      getToast: vi.fn().mockReturnValue(null)
    })

    const error = {
      request: {
        responseURL: `${import.meta.env.VITE_HOST_API}/some/other/url`
      },
      response: {
        status: 401
      }
    }

    await expect(checkSessionExpired(error)).rejects.toThrow('Session expired')

    expect(useSession().setSession).toHaveBeenCalledWith(false)
    expect(useToaster().addToast).toHaveBeenCalledWith('Expiró la sesión. Por favor, inicia sesión nuevamente.', 'danger')
    expect(router.push).toHaveBeenCalledWith({ name: 'Login' })
  })
})
