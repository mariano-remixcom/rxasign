<template>
  <div class="mb-1 rounded-3">
    <div class="container d-flex align-items-center justify-content-between">
      <div class="container-fluid">
        <h1 class="display-6 fw-bold">Proyectos</h1>
        <p class="text-muted">Lista de proyectos por cliente con su equipo.</p>
      </div>
      <!-- Acciones inicio -->
      <div class="d-flex gap-2">
        <router-link to="/proyectos/agregar">
          <button class="btn btn-primary btn-lg">Nuevo</button>
        </router-link>
      </div>
      <!-- Acciones fin -->
    </div>
  </div>
  <div id="app">
    <ProyectosTable />
  </div>
</template>

<script>
import ProyectosTable from '@/components/ProyectosTable.vue'

export default {
  name: 'App',
  components: {
    ProyectosTable
  }
}
</script>
