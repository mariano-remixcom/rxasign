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
          <li class="nav-item">
            <router-link to="/registro-horas" class="nav-link" @click="collapseNavbar">Registro de Horas</router-link>
          </li>
          <li v-if="isAdminUser" class="nav-item">
            <router-link to="/horas" class="nav-link" @click="collapseNavbar">Gestión de Horas</router-link>
          </li>
          <li v-if="isAdminUser" class="nav-item">
            <router-link to="/usuarios" class="nav-link" @click="collapseNavbar">Usuarios</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/valores" class="nav-link" @click="collapseNavbar">Valores</router-link>
          </li>
        </ul>
      </div>

      <!-- Sección derecha: Usuario -->
      <div class="d-flex align-items-center justify-content-end ms-auto user-section">
        <span class="navbar-text text-white me-2">Hola {{ userFirstName }}</span>
        <button class="btn btn-outline-light btn-sm" @click="logout">Salir</button>
      </div>
    </div>
  </nav>
</template>

<script>
import AuthService from '../../services/auth'
import { useSession } from '@/composables/session/useSession'
import { useSetupSession } from '@/composables/session/useSetupSession'

export default {
  setup() {
    return useSetupSession()
  },
  data() {
    return {
      navbarExpanded: false
    }
  },
  methods: {
    collapseNavbar() {
      this.navbarExpanded = false
    },
    toggleNavbar() {
      this.navbarExpanded = !this.navbarExpanded
    },
    async logout() {
      const authService = new AuthService()

      await authService.logout()
      const { setSession } = useSession()

      setSession(false)
      this.$router.push('/login')
    }
  }
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
