<template>
  <router-link :to="!route ? '/' : route" class="navbar-brand">
    <div class="d-flex flex-row">
      <i class="bi bi-hexagon align-content-center"></i>
      <h6 class="fw-bold m-0 ms-1 align-content-center">Asignaciones</h6>
    </div>
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
