<template>
  <div>
    <BaseToast v-for="toast in toasts" :key="toast.id" :message="toast.message" :color="toast.color" :delay="toast.delay" />
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
