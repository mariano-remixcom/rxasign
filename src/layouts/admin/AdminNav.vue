<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-primary fixed-top">
    <div class="container d-flex justify-content-between align-items-center">
      <!-- Marca y enlaces de navegación -->
      <router-link to="/" class="navbar-brand" @click="collapseNavbar">
        <img src="@/assets/logoAsignaciones.svg" alt="Logo de la app" />
        <div class="d-flex flex-row"></div>
      </router-link>
      <!-- Sección de login del usuario -->
      <!-- <div class="d-flex align-items-center">
        <span class="navbar-text text-white me-2">Hola</span>
        <router-link to="/login" class="btn btn-outline-light">Salir</router-link>
      </div> -->
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
