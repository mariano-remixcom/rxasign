<template>
  <div
    ref="toastEl"
    class="toast text-white"
    :class="`bg-${color}`"
    data-bs-animation="true"
    :data-bs-delay="delay"
    data-bs-autohide="true"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
  >
    <div class="d-flex">
      <div class="toast-body">{{ message }}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" aria-label="Close" data-bs-dismiss="toast"></button>
    </div>
  </div>
</template>
<script>
import { Toast } from 'bootstrap'

export default {
  props: {
    message: {
      type: String,
      required: true
    },
    delay: {
      type: Number,
      default: 5000
    },
    color: {
      type: String,
      default: 'primary'
    }
  },
  data() {
    return { toast: null }
  },
  mounted() {
    this.toast = new Toast(this.$refs.toastEl)
    this.toast.show()
  }
}
</script>
<style lang="scss" scoped>
.toast {
  z-index: 1050;
}
</style>
