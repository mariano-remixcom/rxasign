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
          <li class="nav-item dropdown">
            <a
              id="dailyDropdown"
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Daily
            </a>
            <ul class="dropdown-menu custom-dropdown" aria-labelledby="dailyDropdown">
              <li>
                <router-link to="/ruleta" class="dropdown-item" @click="collapseNavbar">Ruleta</router-link>
              </li>
              <li>
                <router-link to="/daily" class="dropdown-item" @click="collapseNavbar">Daily Report</router-link>
              </li>
              <li>
                <router-link to="/monthly" class="dropdown-item" @click="collapseNavbar">Monthly Report</router-link>
              </li>
            </ul>
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

<style scoped lang="scss">
$primary: #7749f8;
$primary-dark: #5227cc;
$primary-light: #ebe5fc;
$primary-medium: #9b7df5;

/* Aseguramos que el logo no desborde en dispositivos pequeños */
.logo-img {
  max-height: 40px;
}

/* Espaciado en la sección del usuario */
.user-section {
  position: relative;
  z-index: 1;
}

/* Estilos personalizados para el dropdown */
.custom-dropdown {
  background-color: $primary-light !important;
  border: 1px solid rgba(119, 73, 248, 0.2) !important;
  border-radius: 6px !important;
  padding: 0.25rem !important;
  box-shadow: 0 2px 8px rgba(119, 73, 248, 0.15) !important;
  min-width: 180px !important;
  margin-top: 0.25rem !important;
}

.custom-dropdown .dropdown-item {
  color: $primary !important;
  font-weight: 500 !important;
  padding: 0.5rem 1rem !important;
  transition: all 0.15s ease-in-out !important;
  border-radius: 4px !important;
  margin: 0.15rem !important;
  font-size: 0.95rem !important;

  &:hover,
  &:focus {
    background-color: rgba(119, 73, 248, 0.12) !important;
    color: $primary-dark !important;
  }

  &.router-link-active,
  &:active {
    background-color: $primary !important;
    color: white !important;
  }
}

// Ajustar el espacio del dropdown cuando está activo
.nav-item.dropdown .dropdown-menu {
  overflow: hidden;
}
</style>
