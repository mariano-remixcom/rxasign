<template>
  <div aria-live="polite" aria-atomic="true">
    <div class="toast-container bottom-0 start-0 p-3">
      <BaseToast v-for="toast in toasts" :key="toast.id" :message="toast.message" :color="toast.color" :delay="toast.delay" />
    </div>
  </div>
</template>
<script>
import BaseToast from '@/components/shared/BaseToast.vue'
import { useToaster } from '@/composables/useToaster'

export default {
  name: 'ToasterComponent',
  components: {
    BaseToast
  },
  setup() {
    const { toasts } = useToaster()

    return { toasts }
  }
}
</script>
