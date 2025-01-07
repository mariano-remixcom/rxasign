<template>
  <div v-if="isVisible" class="modal-overlay">
    <div :class="['modal-content', { 'modal-large': large }]">
      <header class="modal-header">
        <h4 class="modal-title">{{ title }}</h4>
        <button class="modal-close" @click="$emit('close')">&times;</button>
      </header>
      <div class="modal-body">
        <div class="modal-body-content">
          <slot></slot>
          <!-- Slot para contenido personalizado -->
        </div>
      </div>
      <footer class="modal-footer">
        <button type="button" class="btn btn-secondary me-2" @click="$emit('close')">Cancelar</button>
        <button type="button" class="btn btn-primary" @click="handleConfirm">{{ confirmText }}</button>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    confirmText: {
      type: String,
      default: 'Confirmar'
    },
    large: {
      type: Boolean,
      default: false
    }
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
  max-height: 90%; /* Asegura que no exceda el 90% de la altura de la pantalla */
  overflow-y: auto; /* Permite desplazamiento vertical si es necesario */
}

.modal-large {
  max-width: 1000px;
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

@media (max-width: 768px) {
  .modal-content {
    width: 90%;
    max-width: 90%; /* Asegura que el modal no ocupe más del 90% del ancho */
    max-height: 80%; /* Limita la altura máxima en pantallas pequeñas */
    border-radius: 5px;
    overflow-y: auto; /* Permite el desplazamiento si el contenido es demasiado largo */
  }

  .modal-header {
    padding: 10px;
  }

  .modal-footer {
    padding: 10px;
    text-align: center;
    flex-direction: column;
  }

  .modal-footer .btn {
    width: 100%;
    margin-bottom: 10px;
  }

  .modal-close {
    font-size: 18px;
  }
}
</style>
