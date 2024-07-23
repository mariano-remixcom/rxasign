<template>
  <transition name="modal">
    <div v-if="isVisible" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="text-16 mb-0">{{ title }}</h4>
          <button class="modal-close" @click="$emit('close')">&times;</button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer">
          <slot name="footer">
            <button class="btn button-claro" @click="$emit('close')">Cancelar</button>
            <button class="btn button-oscuro" @click="handleSave">Confirmar</button>
          </slot>
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
      default: () => null
    },
    title: {
      type: String,
      default: () => null
    }
  },
  emits: ['close', 'save'], // Declara los eventos que se emiten
  methods: {
    handleSave() {
      this.$emit('save')
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
  border-radius: 15px;
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
}

.modal-footer {
  padding: 15px;
  text-align: right;
  border-top: 1px solid #eee;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
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
