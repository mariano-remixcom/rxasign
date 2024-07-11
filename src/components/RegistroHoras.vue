<template>
  <div class="container d-flex align-items-center justify-content-between">
    <div class="container">
      <!-- Fila para Período y Proyecto -->
      <div class="row mb-3">
        <div class="col-md-4">
          <label for="periodo" class="form-label">Período</label>
          <select id="periodo" class="form-select">
            <option>Enero 2024</option>
            <option>Febrero 2024</option>
            <option>Marzo 2024</option>
            <option>Abril 2024</option>
            <option>Mayo 2024</option>
            <option>Junio 2024</option>
            <option selected>Julio 2024 (actual)</option>
            <option>Agosto 2024</option>
            <option>Septiembre 2024</option>
            <option>Octubre 2024</option>
            <option>Noviembre 2024</option>
            <option>Diciembre 2024</option>
            <!-- Agregar otras opciones aquí -->
          </select>
        </div>
        <div class="col-md-8">
          <label for="proyecto" class="form-label">Proyecto</label>
          <select id="proyecto" class="form-select">
            <option selected>Bancor - Empleado digital</option>
            <option>Hoklan - Odoo dev</option>
            <option>Checkpet - Desarrollo App</option>
            <option>FUDU - Discovery</option>
            <option>Remix - Asignaciones</option>
            <option>Remix - Redes</option>
            <!-- Agregar otras opciones aquí -->
          </select>
        </div>
      </div>

      <!-- Fila para la Tabla -->
      <div class="row mb-3">
        <div class="col-12">
          <table class="table">
            <thead class="table-light">
              <tr>
                <th>Usuario</th>
                <th>Asignadas</th>
                <th>Registradas</th>
                <th>Semana 1</th>
                <th>Semana 2</th>
                <th>Semana 3</th>
                <th>Semana 4</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="recurso in recursos" :key="recurso.id" class="table">
                <td>{{ recurso.nombre }}</td>
                <td>{{ recurso.asignadas }} hs</td>
                <td>{{ recurso.registradas }} hs</td>
                <td>
                  <input v-model="recurso.semana1" type="number" class="form-control input-fixed-width" />
                </td>
                <td>
                  <input v-model="recurso.semana2" type="number" class="form-control input-fixed-width" />
                </td>
                <td>
                  <input v-model="recurso.semana3" type="number" class="form-control input-fixed-width" />
                </td>
                <td>
                  <input v-model="recurso.semana4" type="number" class="form-control input-fixed-width" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Fila para Fecha de Actualización -->
      <div class="row">
        <div class="col-12 text-end">
          <p class="text-muted">Actualizado: 25/06/24 15:17</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      recursos: [
        { id: 1, nombre: 'Yoana Gerling', asignadas: 40, registradas: 0, semana1: 0, semana2: 0, semana3: 0, semana4: 0 },
        { id: 2, nombre: 'Patricio Sabatini', asignadas: 10, registradas: 0, semana1: 0, semana2: 0, semana3: 0, semana4: 0 },
        { id: 3, nombre: 'Rodrigo Loza', asignadas: 40, registradas: 0, semana1: 0, semana2: 0, semana3: 0, semana4: 0 },
        { id: 4, nombre: 'Joaquín Zanardi', asignadas: 40, registradas: 0, semana1: 0, semana2: 0, semana3: 0, semana4: 0 },
        { id: 5, nombre: 'Norelys Rodríguez', asignadas: 40, registradas: 0, semana1: 0, semana2: 0, semana3: 0, semana4: 0 }
      ]
    }
  }
}
</script>

<style scoped>
.table {
  width: 100%;
  margin-bottom: 1rem;
  color: #212529;
  border-collapse: collapse;
}
.table th,
.table td {
  padding: 0.75rem;
  vertical-align: top;
  border-top: 1px solid #dee2e6;
}
.table thead th {
  vertical-align: bottom;
  border-bottom: 2px solid #dee2e6;
}
.table tbody + tbody {
  border-top: 2px solid #dee2e6;
}
.input-fixed-width {
  width: 80px;
}
</style>
