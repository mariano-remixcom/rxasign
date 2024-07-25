<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-primary fixed-top">
    <div class="container d-flex justify-content-between align-items-center">
      <!-- Marca y enlaces de navegación -->
      <AsignacionesConLogo @click="collapseNavbar" />

      <!-- Sección de login del usuario -->
      <div class="d-flex align-items-center">
        <span class="navbar-text text-white me-2">Hola, Mariano</span>
        <router-link to="/login" class="btn btn-outline-light">Salir</router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import AsignacionesConLogo from '../default/AsignacionesConLogo.vue'
import { ref } from 'vue'

const navbarExpanded = ref(false)

const collapseNavbar = () => {
  navbarExpanded.value = false
}
</script>
