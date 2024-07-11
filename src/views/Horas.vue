<template>
  <div class="mb-1 rounded-3">
    <div class="container d-flex align-items-center justify-content-between">
      <div class="container-fluid">
        <h1 class="display-6 fw-bold">Seguimiento de horas</h1>
        <p class="col-md-8 text-secondary">Tabla con recursos por proyecto y el registro de horas semanal.</p>
      </div>
      <router-link to="/registrarhoras">
        <button class="btn btn-primary btn-lg">Agregar</button>
      </router-link>
    </div>
  </div>
  <div id="app">
    <RegistroHoras />
  </div>
</template>

<script>
import RegistroHoras from '@/components/RegistroHoras.vue'

export default {
  name: 'App',
  components: {
    RegistroHoras
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
