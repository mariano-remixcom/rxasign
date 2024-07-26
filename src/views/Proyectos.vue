<template>
  <div class="mb-4 rounded-3">
    <div class="container d-flex align-items-center justify-content-between page-title-separation">
      <div class="container-fluid">
        <h1 class="h3 fw-semibold">Proyectos</h1>
        <p>Lista de proyectos por cliente con su equipo.</p>
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
