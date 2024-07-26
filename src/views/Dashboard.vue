<template>
  <div class="container">
    <!-- inicio card proyectos-->
    <div class="row align-items-center mb-3">
      <div class="card bg-white container w-75">
        <div class="card-body d-flex align-items-center">
          <!-- Columna del icono -->
          <div class="icon-column text-primary">
            <i class="bi bi-folder color-secondary" style="font-size: 1.7rem"></i>
            <!-- Ejemplo de Bootstrap Icon -->
          </div>
          <!-- Columna del título y subtítulo -->
          <div class="text-column flex-grow-1 ms-3">
            <h5 class="card-title mb-0">Proyectos</h5>
            <p class="card-text text-secondary">Lista de proyectos por cliente con su equipo.</p>
          </div>
          <!-- Columna de los links -->
          <div class="d-flex gap-2">
            <router-link to="/proyectos/agregar">
              <button class="btn btn-secondary">Agregar</button>
            </router-link>
            <router-link to="/proyectos">
              <button class="btn btn-primary">Abrir</button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <!-- inicio card horas -->
    <div class="row align-items-center mb-3">
      <div class="card bg-white container w-75">
        <div class="card-body d-flex align-items-center">
          <!-- Columna del icono -->
          <div class="icon-column text-primary">
            <i class="bi bi-stopwatch" style="font-size: 1.7rem"></i>
            <!-- Ejemplo de Bootstrap Icon -->
          </div>
          <!-- Columna del título y subtítulo -->
          <div class="text-column flex-grow-1 ms-3">
            <h5 class="card-title mb-0">Seguimiento de horas</h5>
            <p class="card-text text-secondary">Tabla con recursos por proyecto y el registro de horas semanal.</p>
          </div>
          <!-- Columna de los links -->
          <div class="link-column">
            <a class="btn btn-primary">
              <router-link to="/horas" class="nav-link">Abrir</router-link>
            </a>
          </div>
        </div>
      </div>
    </div>
    <!-- inicio card usuarios-->
    <div class="row align-items-center mb-3">
      <div class="card bg-white container w-75">
        <div class="card-body d-flex align-items-center">
          <!-- Columna del icono -->
          <div class="icon-column text-primary">
            <i class="bi bi-person" style="font-size: 1.7rem"></i>
            <!-- Ejemplo de Bootstrap Icon -->
          </div>
          <!-- Columna del título y subtítulo -->
          <div class="text-column flex-grow-1 ms-3">
            <h5 class="card-title mb-0">Usuarios</h5>
            <p class="card-text text-secondary">Lista de usuarios y administradores del sistema.</p>
          </div>
          <!-- Columna de los links -->
          <div class="link-column">
            <a href="#" class="btn btn-secondary m-2" @click="addUser">Agregar</a>
            <a class="btn btn-primary">
              <router-link to="/usuarios" class="nav-link">Abrir</router-link>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Modal
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
  </Modal>
</template>

<script>
import AgregarUsuario from '@/components/AgregarUsuario.vue'
import Modal from '@/components/shared/ModalModal.vue'

export default {
  name: 'DashboardAsignaciones',
  components: {
    Modal,
    AgregarUsuario
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

<style>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
