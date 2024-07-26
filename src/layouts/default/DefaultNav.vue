<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-primary fixed-top">
    <div class="container d-flex justify-content-between align-items-center">
      <!-- Sección de la izquierda: Marca y enlaces de navegación -->
      <div class="d-flex">
        <AsignacionesConLogo @click="collapseNavbar" />
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

      <div id="navbarDefault" :class="['collapse navbar-collapse', navbarExpanded && 'show']">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link to="/" class="nav-link" @click="collapseNavbar">Inicio</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/proyectos" class="nav-link" @click="collapseNavbar">Proyectos</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/horas" class="nav-link" @click="collapseNavbar">Horas</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/usuarios" class="nav-link" @click="collapseNavbar">Usuarios</router-link>
          </li>
        </ul>
      </div>

      <!-- Sección del login del usuario -->
      <div class="d-flex align-items-center">
        <span class="navbar-text text-white me-2">Hola, Mariano</span>
        <router-link to="/login" class="btn btn-outline-light">Salir</router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
// import { ref } from 'vue'

// const navbarExpanded = ref(false)

// const toggleNavbar = () => {
//   navbarExpanded.value = !navbarExpanded.value
// }

// const collapseNavbar = () => {
//   navbarExpanded.value = false
// }
import AsignacionesConLogo from './Brand.vue'
import { ref } from 'vue'
// import { useRouter } from 'vue-router';

const navbarExpanded = ref(false)
// const router = useRouter();

const toggleNavbar = () => {
  navbarExpanded.value = !navbarExpanded.value
}

const collapseNavbar = () => {
  navbarExpanded.value = false
}
</script>
