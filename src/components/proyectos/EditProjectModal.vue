<template>
  <BaseModal
    :is-visible="isVisible"
    title="Editar proyecto"
    confirm-text="Guardar Cambios"
    :large="large"
    @close="handleClose"
    @confirm="handleSave"
  >
    <div class="modal-body-content">
      <ProjectAddForm :project-edit="projectEdit" @update-data="updateDataEdit" />
    </div>
    <ConfirmModal
      :is-visible="isVisibleConfirm"
      message="¿Estás seguro que deseas guardar los cambios?"
      @close="handleClose"
      @confirm="confirmChanges"
    >
    </ConfirmModal>
  </BaseModal>
</template>

<script>
import BaseModal from '@/components/shared/BaseModal.vue'
import ConfirmModal from '@/components/shared/ConfirmModal.vue'
import ProjectAddForm from '@/components/ProjectAddForm.vue'

export default {
  components: { BaseModal, ProjectAddForm, ConfirmModal },
  props: {
    isVisible: Boolean,
    projectEdit: Object,
    large: Boolean
  },
  emits: ['close', 'save', 'updateDataEdit'],
  data() {
    return {
      projectWithChanges: {},
      isVisibleConfirm: false
    }
  },
  methods: {
    updateDataEdit(project) {
      this.projectWithChanges = project
      this.$emit('updateDataEdit', this.projectWithChanges)
    },
    handleClose() {
      this.isVisibleConfirm = false
      this.$emit('close')
    },
    handleSave() {
      this.isVisibleConfirm = true
    },
    confirmChanges() {
      this.$emit('save')
      this.isVisibleConfirm = false
    }
  }
}
</script>
