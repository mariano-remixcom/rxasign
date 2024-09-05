<template>
  <BaseModal
    :is-visible="isVisible"
    title="Confirmación"
    confirm-text="Confirmar"
    cancel-text="Cancelar"
    @close="handleClose"
    @confirm="handleConfirm"
  >
    <p>{{ message }}</p>
  </BaseModal>
</template>

<script>
import BaseModal from './BaseModal.vue'

export default {
  components: { BaseModal },
  props: {
    isVisible: Boolean,
    message: String
  },
  emits: ['close', 'confirm'],
  methods: {
    handleClose() {
      this.$emit('close')
    },
    handleConfirm() {
      this.$emit('confirm')
    }
  }
}
</script>
