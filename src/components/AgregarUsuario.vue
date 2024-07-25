<template>
  <div class="container">
    <div class="alert alert-primary w-75" role="alert">Datos del usuario</div>
    <div class="project-add-form w-75 mb-4">
      <form @submit.prevent="submitForm">
        <div class="mb-3 row">
          <label for="proyecto" class="col-sm-2 col-form-label">Nombre</label>
          <div class="col-sm-10">
            <input v-model="nombre" type="text" class="form-control" required />
          </div>
        </div>
        <div class="mb-3 row">
          <label for="proyecto" class="col-sm-2 col-form-label">Apellido</label>
          <div class="col-sm-10">
            <input v-model="apellido" type="text" class="form-control" required />
          </div>
        </div>
        <div class="mb-3 row">
          <label for="horas" class="col-sm-2 col-form-label">Horas</label>
          <div class="col-sm-10">
            <div class="input-group">
              <input v-model="horas" type="number" class="form-control" min="0" required />
            </div>
            <small class="form-text text-muted">Cantidad de horas contratadas por mes</small>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AgregarUsuarioForm',
  data() {
    return {
      nombre: '',
      apellido: '',
      horas: 0
    }
  },
  methods: {
    submitForm() {
      this.$emit('submit', this.form)
    }
  }
}
</script>

<style scoped>
.project-add-form {
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: 0 auto; /* Centra el formulario horizontalmente */
  width: 100%;
}
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
}
</style>
