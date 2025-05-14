import AuthService from '@/services/auth'
import { ref } from 'vue'

const session = ref(null)
const authService = new AuthService()
const $promise = ref(null)

export function useSession() {
  const _getSessionWhenNeverCalled = async () => {
    if ($promise.value) {
      return $promise.value
    }

    if (session.value === null) {
      $promise.value = authService.getCurrentUser()
      session.value = await $promise.value
      $promise.value = null
    }
  }

  const getSessionRef = () => {
    return session
  }

  const setSession = (user) => {
    session.value = user
  }

  const getSession = async () => {
    await _getSessionWhenNeverCalled()

    return session.value
  }

  const isAuthenticated = async () => {
    await _getSessionWhenNeverCalled()

    return !!session.value
  }

  const updateIsAuthenticated = async () => {
    session.value = await authService.getCurrentUser()

    return isAuthenticated()
  }

  return { getSessionRef, getSession, setSession, isAuthenticated, updateIsAuthenticated }
}
