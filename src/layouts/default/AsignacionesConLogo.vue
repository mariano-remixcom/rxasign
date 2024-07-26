<template>
  <router-link :to="!route ? '/' : route" class="navbar-brand">
    <i class="bi bi-hexagon"></i>
    Asignaciones
  </router-link>
</template>

<script>
export default {
  props: {
    route: {
      type: String,
      default: null
    }
  }
}
</script>
