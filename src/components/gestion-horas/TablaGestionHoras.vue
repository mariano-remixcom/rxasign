<template>
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
.table td {
  padding: 0.75rem;
}

.input-fixed-width {
  width: 80px;
}
</style>
