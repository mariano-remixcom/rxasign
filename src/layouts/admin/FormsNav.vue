<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-primary fixed-top">
    <div class="container d-flex justify-content-between align-items-center">
      <!-- Marca y enlaces de navegación -->
      <router-link to="/" class="navbar-brand" @click="collapseNavbar">
        <img src="@/assets/logoAsignaciones.svg" alt="Logo de la app" />
        <div class="d-flex flex-row"></div>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const navbarExpanded = ref(false)

const collapseNavbar = () => {
  navbarExpanded.value = false
}
</script>
