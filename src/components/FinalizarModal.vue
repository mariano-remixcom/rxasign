<template>
  <div class="container">
    <p class="centered-text">¿Está seguro que desea finalizar el {{ ente }}?</p>
  </div>
</template>
<script>
export default {
  name: 'FinalizarModal',
  props: {
    ente: {
      type: String,
      default: () => null
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>
<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.centered-text {
  font-size: 18px;
  text-align: center;
}
</style>
