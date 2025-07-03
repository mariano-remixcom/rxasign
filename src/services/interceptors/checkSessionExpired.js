import { router } from '@/router/index'
import { useSession } from '@/composables/session/useSession'
import { useToaster } from '@/composables/alerts/toasts/useToaster'

export async function checkSessionExpired(error) {
  const EXCLUDED_URLS = ['/auth/login', '/auth/request-password-reset']

  if (EXCLUDED_URLS.some((url) => url === error.request.url)) {
    return Promise.reject(error)
  }

  if (error.response.status !== 401) {
    return Promise.reject(error)
  }

  const { setSession } = useSession()

  setSession(false)

  const { addToast } = useToaster()

  addToast('Expiró la sesión. Por favor, inicia sesión nuevamente.', 'danger')

  await router.push({
    name: 'Login'
  })

  return Promise.reject(new Error('Session expired'))
}
