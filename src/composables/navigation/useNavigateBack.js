import { ref } from 'vue'
import { useRouter } from 'vue-router'

const localHistory = ref(0)

export function useNavigateBack() {
  const router = useRouter()

  const goBack = () => {
    if (localHistory.value > 1) {
      router.go(-1)
    } else {
      router.push('/')
    }
  }

  return {
    goBack
  }
}

export function useLocalHistory() {
  const incrementLocalHistory = () => {
    localHistory.value += 1
  }

  return {
    incrementLocalHistory
  }
}
