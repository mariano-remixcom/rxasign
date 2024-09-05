<template>
  <BaseModal
    :is-visible="isVisible"
    title="Eliminar"
    confirm-text="Confirmar"
    cancel-text="Cancelar"
    @close="handleClose"
    @confirm="handleDelete"
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
  emits: ['close', 'delete'],
  methods: {
    handleClose() {
      this.$emit('close')
    },
    handleDelete() {
      this.$emit('delete')
    }
  }
}
</script>
