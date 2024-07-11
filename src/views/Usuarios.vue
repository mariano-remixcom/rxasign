<template>
  <div class="mb-1 rounded-3">
    <div class="container d-flex align-items-center justify-content-between">
      <div class="container-fluid">
        <h1 class="display-6 fw-bold">Usuarios</h1>
        <p class="text-muted">Lista de usuarios y sus horas asignadas.</p>
      </div>
      <router-link to="/nuevo-usuario">
        <button class="btn btn-primary btn-lg">Nuevo</button>
      </router-link>
    </div>
  </div>
  <div id="app">
    <UsuariosTable />
  </div>
</template>

<script>
import UsuariosTable from '@/components/UsuariosTable.vue'

export default {
  name: 'App',
  components: {
    UsuariosTable
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
