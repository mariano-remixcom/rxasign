<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-primary fixed-top">
    <div class="container">
      <!-- Sección de la izquierda: Marca y enlaces de navegación -->
      <div class="d-flex align-items-center">
        <!-- Logo y Marca -->
        <router-link to="/" class="navbar-brand d-flex align-items-center" @click="collapseNavbar">
          <img src="@/assets/logoAsignaciones.svg" alt="Logo de la app" class="logo-img" />
        </router-link>
        <!-- Botón para colapsar el menú -->
        <button
          :class="['navbar-toggler', !navbarExpanded && 'collapsed']"
          type="button"
          aria-controls="navbarDefault"
          :aria-expanded="navbarExpanded"
          aria-label="Toggle navigation"
          @click="toggleNavbar"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>

      <!-- Sección central: Enlaces de navegación -->
      <div id="navbarDefault" :class="['collapse navbar-collapse', navbarExpanded && 'show']">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link to="/" class="nav-link" @click="collapseNavbar">Inicio</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/proyectos" class="nav-link" @click="collapseNavbar">Proyectos</router-link>
          </li>
          <!-- <li class="nav-item">
            <router-link to="/horas" class="nav-link" @click="collapseNavbar">Horas</router-link>
          </li> -->
          <li class="nav-item">
            <router-link to="/usuarios" class="nav-link" @click="collapseNavbar">Usuarios</router-link>
          </li>
        </ul>
      </div>

      <!-- Sección derecha: Usuario -->
      <!-- <div class="d-flex align-items-center justify-content-end ms-auto user-section">
        <span class="navbar-text text-white me-2">Hola</span>
        <router-link to="/login" class="btn btn-outline-light btn-sm">Salir</router-link>
      </div> -->
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const navbarExpanded = ref(false)

const toggleNavbar = () => {
  navbarExpanded.value = !navbarExpanded.value
}

const collapseNavbar = () => {
  navbarExpanded.value = false
}
</script>

<style scoped>
/* Aseguramos que el logo no desborde en dispositivos pequeños */
.logo-img {
  max-height: 40px;
}

/* Espaciado en la sección del usuario */
.user-section {
  position: relative;
  z-index: 1;
}
</style>
