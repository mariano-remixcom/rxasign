<template>
  <div class="mb-1 rounded-3">
    <div class="container d-flex justify-content-between">
      <div>
        <h1 class="display-6 fw-bold">Editar proyecto</h1>
      </div>
      <!-- Acciones inicio -->
      <div class="d-flex gap-2">
        <router-link to="/">
          <button class="btn btn-secondary">Cancelar</button>
        </router-link>
        <button class="btn btn-primary" @click="addProject">Guardar</button>
      </div>
      <!-- Acciones fin -->
    </div>
  </div>
  <div id="app">
    <div class="container d-flex flex-column">
      <ProjectAddForm @submit="handleFormSubmit" />
      <ProjectAddTeam />
    </div>
  </div>
  <Modal
    :is-visible="showModal"
    :title="title"
    @close="
      () => {
        showModal = false
      }
    "
  >
    <Guardar v-if="isSaving" :ente="ente" />
  </Modal>
</template>

<script>
import Guardar from '@/components/GuardarModal.vue'
import Modal from '@/layouts/default/ModalModal.vue'
import ProjectAddForm from '@/components/ProjectAddForm.vue'
import ProjectAddTeam from '@/components/ProjectAddTeam.vue'

export default {
  name: 'EditProject',
  components: {
    ProjectAddForm,
    ProjectAddTeam,
    Modal,
    Guardar
  },
  data() {
    return {
      showModal: false,
      isSaving: false,

      title: '',
      ente: ''
    }
  },
  methods: {
    handleFormSubmit(form) {
      // Lógica para manejar el formulario enviado
      console.log('Formulario recibido', form)
    },
    addProject() {
      // Llamar a handleFormSubmit para manejar la lógica de guardar el proyecto
      // Aquí puedes agregar más lógica para guardar el proyecto si es necesario
      console.log('Guardar proyecto')
      this.showModal = true
      this.isSaving = true
      this.title = 'Guardar cambios'
      this.ente = 'proyecto'
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
