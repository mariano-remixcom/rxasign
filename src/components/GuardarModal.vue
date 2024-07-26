<template>
  <transition name="modal">
    <div v-if="isVisible" class="modal-overlay">
      <div class="modal-content modal-small">
        <div class="modal-header">
          <h4 class="text-16 mb-0">Confirmar</h4>
          <button class="modal-close" @click="cancel">×</button>
        </div>
        <div class="modal-body">
          <p>¿Estás seguro de que quieres guardar los cambios?</p>
        </div>
        <div class="modal-footer">
          <button class="btn button-claro me-2" @click="cancel">Cancelar</button>
          <button class="btn button-oscuro" @click="confirm">Confirmar</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['confirm', 'cancel'],
  methods: {
    confirm() {
      this.$emit('confirm')
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>
<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.modal-close {
  background: none;
  border: none;
  font-size: 20px;
}
.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}
.modal-large {
  max-width: 800px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
  background: var(--dark-grey);
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
}

.modal-body {
  padding: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-body-content {
  width: 100%;
}

.modal-footer {
  padding: 15px;
  text-align: right;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: white;
}
.button-claro {
  background-color: #b4aeae;
}

.button-oscuro {
  background-color: #7c59cc;
}
</style>
