<template>
  <div class="mb-1 rounded-3">
    <div class="container page-title-separation d-flex align-items-center justify-content-between mb-4">
      <div class="container-fluid">
        <h1 class="h3">Gestión de Horas</h1>
      </div>
    </div>
  </div>
  <div id="app">
    <div class="container d-flex flex-column align-items-center justify-content-between">
      <div class="container">
        <div class="row mb-3">
          <div class="col-md-4">
            <label for="periodo" class="form-label">Período</label>
            <select id="periodo" class="form-select">
              <option>Enero 2024</option>
              <option>Febrero 2024</option>
              <option>Marzo 2024</option>
              <option>Abril 2024</option>
              <option>Mayo 2024</option>
              <option>Junio 2024</option>
              <option selected>Julio 2024 (actual)</option>
              <option>Agosto 2024</option>
              <option>Septiembre 2024</option>
              <option>Octubre 2024</option>
              <option>Noviembre 2024</option>
              <option>Diciembre 2024</option>
              <!-- Agregar otras opciones aquí -->
            </select>
          </div>
          <div class="col-md-8">
            <label for="proyecto" class="form-label">Proyecto</label>
            <select id="proyecto" class="form-select">
              <option selected>Bancor - Empleado digital</option>
              <option>Hoklan - Odoo dev</option>
              <option>Checkpet - Desarrollo App</option>
              <option>FUDU - Discovery</option>
              <option>Remix - Asignaciones</option>
              <option>Remix - Redes</option>
              <!-- Agregar otras opciones aquí -->
            </select>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-12">
            <TablaGestionHoras />
          </div>
        </div>
        <div class="row">
          <div class="col-12 text-end">
            <p class="text-muted">Actualizado: 25/06/24 15:17</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TablaGestionHoras from '@/components/gestion-horas/TablaGestionHoras.vue'

export default {
  name: 'App',
  components: {
    TablaGestionHoras
  },
  mounted() {},
  methods: {
    getResourcesWithHours() {}
  }
}
</script>
