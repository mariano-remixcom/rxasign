import { ref } from 'vue'

const counter = ref(0)
const toasts = ref([])

export function useToaster() {
  const addToast = (message, color = 'primary', delay = 5000) => {
    counter.value++
    const id = counter.value

    toasts.value.push({
      id,
      message,
      color,
      delay
    })
    setTimeout(() => removeToast(id), delay + 1000)
  }

  const removeToast = (id) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  return { toasts, removeToast, addToast }
}
