<template>
  <div class="container-fluid px-3">
    <!-- inicio card proyectos -->
    <div id="projects-card" class="row justify-content-center mt-4 mb-3">
      <div class="card bg-white col-12 col-md-8 col-lg-6">
        <div class="card-body d-flex flex-column flex-sm-row align-items-center">
          <div class="icon-column text-primary mb-3 mb-sm-0">
            <i class="bi bi-folder" style="font-size: 1.7rem"></i>
          </div>
          <div class="text-column flex-grow-1 ms-sm-3 text-center text-sm-start">
            <h5 class="card-title mb-0">Proyectos</h5>
            <p class="card-text text-secondary">Lista de proyectos por cliente con su equipo.</p>
          </div>
          <div class="d-flex flex-column flex-sm-row gap-2">
            <router-link v-if="isAdminUser" id="add-project-button" to="/proyectos/agregar">
              <button class="btn btn-secondary btn-sm mt-2">Agregar</button>
            </router-link>
            <router-link id="open-project-button" to="/proyectos">
              <button class="btn btn-primary btn-sm mt-2">Abrir</button>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isAdminUser" id="hour-tracking-card" class="row justify-content-center mb-3">
      <div class="card bg-white col-12 col-md-8 col-lg-6">
        <div class="card-body d-flex flex-column flex-sm-row align-items-center">
          <div class="icon-column text-primary mb-3 mb-sm-0">
            <i class="bi bi-stopwatch" style="font-size: 1.7rem"></i>
          </div>
          <div class="text-column flex-grow-1 ms-sm-3 text-center text-sm-start">
            <h5 class="card-title mb-0">Seguimiento de horas</h5>
            <p class="card-text text-secondary">Tabla con recursos por proyecto y el registro de horas semanal.</p>
          </div>
          <div class="d-flex flex-column flex-sm-row gap-3">
            <router-link id="open-hour-tracking-button" to="/horas">
              <button class="btn btn-primary btn-sm mt-2">Abrir</button>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- inicio card usuarios -->
    <div v-if="isAdminUser" id="users-card" class="row justify-content-center mb-3">
      <div class="card bg-white col-12 col-md-8 col-lg-6">
        <div class="card-body d-flex flex-column flex-sm-row align-items-center">
          <div class="icon-column text-primary mb-3 mb-sm-0">
            <i class="bi bi-person" style="font-size: 1.7rem"></i>
          </div>
          <div class="text-column flex-grow-1 ms-sm-3 text-center text-sm-start">
            <h5 class="card-title mb-0">Usuarios</h5>
            <p class="card-text text-secondary">Lista de usuarios y administradores del sistema.</p>
          </div>
          <div class="d-flex flex-column flex-sm-row gap-2">
            <router-link id="add-user-button" to="/agregar">
              <button class="btn btn-secondary btn-sm mt-2">Agregar</button>
            </router-link>
            <router-link id="open-user-button" to="/usuarios">
              <button class="btn btn-primary btn-sm mt-2">Abrir</button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useSetupSession } from '@/composables/session/useSetupSession'

export default {
  setup() {
    return useSetupSession()
  }
}
</script>

<style scoped>
.greeting {
  font-weight: bold;
}

.icon-column {
  font-size: 1.7rem;
}
</style>
