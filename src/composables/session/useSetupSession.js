import { computed } from 'vue'
import { useSession } from './useSession'

export function useSetupSession() {
  const { getSession, getSessionRef } = useSession()
  const session = getSessionRef()

  getSession()

  const isAdminUser = computed(() => {
    if (!session.value) {
      return false
    }

    return session.value.type === 'ADMIN' || session.value.type === 'SUPERADMIN'
  })

  const userFirstName = computed(() => {
    return session.value ? session.value.firstName : ''
  })

  const userFullName = computed(() => {
    return session.value ? session.value.fullName : ''
  })

  return {
    session,
    isAdminUser,
    userFirstName,
    userFullName
  }
}
