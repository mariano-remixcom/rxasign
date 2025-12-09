<template>
  <div class="mb-1 rounded-3">
    <div class="container d-flex align-items-center justify-content-between">
      <div class="container-fluid">
        <h1 class="h3">Usuarios</h1>
        <p>Información de perfil y estado de usuarios.</p>
      </div>
      <div v-if="isAdminUser" class="d-flex gap-2 align-items-center">
        <div class="form-check form-switch">
          <input
            id="activeUsersSwitch"
            v-model="showActiveUsers"
            class="form-check-input"
            type="checkbox"
            @change="filterUsers"
          />
          <label class="form-check-label" for="activeUsersSwitch">
            {{ showActiveUsers ? 'Mostrar Activos' : 'Mostrar Inactivos' }}
          </label>
        </div>
        <router-link to="/agregar">
          <button class="btn btn-primary btn-sm">Nuevo usuario</button>
        </router-link>
      </div>
    </div>
  </div>

  <!-- Tab Content -->
  <div id="app">
    <PerfilTable :show-active="showActiveUsers" />
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
import PerfilTable from '@/components/PerfilTable.vue'
import { useSetupSession } from '@/composables/session/useSetupSession'

export default {
  name: 'App',
  components: {
    PerfilTable,
    AgregarUsuario,
    BaseModal
  },
  setup() {
    return useSetupSession()
  },
  data() {
    return {
      isAdding: false,
      title: '',
      showModal: false,
      large: false,
      showActiveUsers: true
    }
  },
  methods: {
    addUser() {
      this.showModal = true
      this.isAdding = true
      this.title = 'Agregar usuario'
      this.large = true
    },
    filterUsers() {
      // El filtrado se maneja en PerfilTable mediante la prop
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

.nav-tabs {
  border-bottom: 2px solid #dee2e6;
}

.nav-link {
  cursor: pointer;
  color: #6c757d;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border: none;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #495057;
  border-bottom-color: #dee2e6;
}

.nav-link.active {
  color: #6f42c1;
  border-bottom-color: #6f42c1;
  background-color: transparent;
}
</style>
