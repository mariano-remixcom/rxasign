import { EXCLUDED_URLS } from '@/services/interceptors/excluded-urls.const'
import { router } from '@/router/index'
import { useSession } from '@/composables/session/useSession'
import { useToaster } from '@/composables/alerts/toasts/useToaster'

let toastId = null

export async function checkSessionExpired(error) {
  const BASE_URL = import.meta.env.VITE_HOST_API

  if (EXCLUDED_URLS.some((url) => `${BASE_URL}${url}` === error.request.responseURL)) {
    return Promise.reject(error)
  }

  if (error.response.status !== 401) {
    return Promise.reject(error)
  }

  const { addToast, getToast } = useToaster()

  const toast = getToast(toastId)

  if (!toast) {
    const { setSession } = useSession()

    setSession(false)

    toastId = addToast('Expiró la sesión. Por favor, inicia sesión nuevamente.', 'danger')

    await router.push({
      name: 'Login'
    })
  }

  return Promise.reject(new Error('Session expired'))
}
