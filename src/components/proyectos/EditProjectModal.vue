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
      <ProjectAddForm
        ref="ProjectAddForm"
        :project-edit="projectEdit"
        @update-data="updateDataEdit"
        @save-changes="saveChanges"
      />
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
      if (this.$refs.ProjectAddForm && typeof this.$refs.ProjectAddForm.submitForm === 'function') {
        this.$refs.ProjectAddForm.submitForm()
      } else {
        console.error('El método submitForm no está definido en ProjectAddForm')
      }
    },
    saveChanges() {
      this.$emit('save')
      this.isVisibleConfirm = false
    }
  }
}
</script>
