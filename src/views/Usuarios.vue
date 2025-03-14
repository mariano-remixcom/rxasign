<template>
  <div class="mb-1 rounded-3">
    <div class="container page-title-separation d-flex align-items-center justify-content-between">
      <div class="container-fluid">
        <h1 class="h3">Usuarios</h1>
        <p>Lista de usuarios y sus horas asignadas.</p>
      </div>
      <!-- <button class="btn btn-primary btn-lg" @click="addUser">Nuevo</button> -->
    </div>
  </div>
  <div id="app">
    <UsuariosTable />
  </div>
  <BaseModal
    :is-visible="showModal"
    :title="title"
    :large="large"
    @close="
      () => {
        ;(showModal = false), (isAdding = false), (large = false)
      }
    "
  >
    <AgregarUsuario v-if="isAdding" />
  </BaseModal>
</template>

<script>
import AgregarUsuario from '@/components/AgregarUsuario.vue'
import BaseModal from '@/components/shared/BaseModal.vue'
import UsuariosTable from '@/components/UsuariosTable.vue'

export default {
  name: 'App',
  components: {
    UsuariosTable,
    AgregarUsuario,
    BaseModal
  },
  data() {
    return {
      isAdding: false,
      title: '',
      showModal: false,
      large: false
    }
  },
  methods: {
    addUser() {
      this.showModal = true
      this.isAdding = true
      this.title = 'Agregar usuario'
      this.large = true
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
