<template>
  <div class="container">
    <div class="alert alert-primary w-75" role="alert">Datos del proyecto</div>
    <div class="project-add-form w-75 mb-4">
      <form @submit.prevent="submitForm">
        <div class="mb-3 row">
          <label for="cliente" class="col-sm-2 col-form-label">Cliente</label>
          <div class="col-sm-10">
            <select id="cliente" v-model="form.cliente" class="form-select" required>
              <option value="" disabled>Seleccione un cliente</option>
              <option v-for="option in clientes" :key="option" :value="option">{{ option }}</option>
            </select>
          </div>
        </div>

        <div class="mb-3 row">
          <label for="proyecto" class="col-sm-2 col-form-label">Nombre del proyecto</label>
          <div class="col-sm-10">
            <input
              id="proyecto"
              v-model="form.proyecto"
              type="text"
              class="form-control"
              placeholder="Recaudaciones"
              required
            />
          </div>
        </div>

        <div class="mb-3 row">
          <label for="horas" class="col-sm-2 col-form-label">Horas</label>
          <div class="col-sm-10">
            <div class="input-group">
              <input id="horas" v-model="form.horas" type="number" class="form-control" min="0" required />
              <span class="input-group-text">
                <input v-model="form.contratoAbierto" type="checkbox" />
                Contrato abierto
              </span>
            </div>
            <small class="form-text text-muted">Cantidad de horas contratadas por mes</small>
          </div>
        </div>

        <div class="mb-3 row">
          <label for="vigencia" class="col-sm-2 col-form-label">Vigencia</label>
          <div class="col-sm-10">
            <div class="row">
              <div class="col">
                <input
                  id="inicio"
                  v-model="form.vigencia.inicio"
                  type="date"
                  class="form-control"
                  placeholder="Desde"
                  required
                />
              </div>
              <div class="col">
                <input id="fin" v-model="form.vigencia.fin" type="date" class="form-control" placeholder="Hasta" required />
              </div>
            </div>
            <small class="form-text text-muted">Inicio y fin del proyecto. Necesario para la funcionalidad de períodos.</small>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectAddForm',
  data() {
    return {
      form: {
        cliente: '',
        proyecto: '',
        horas: 0,
        contratoAbierto: false,
        vigencia: {
          inicio: '',
          fin: ''
        }
      },
      clientes: ['Bancor', 'Otro Cliente', 'Más Clientes'] // Agrega más clientes según sea necesario
    }
  },
  methods: {
    submitForm() {
      // Emitir el formulario completo al componente padre
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
}
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
}
</style>
