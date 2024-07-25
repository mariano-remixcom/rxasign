<template>
  <div class="alert alert-primary fw-bold px-3 py-2">Equipo</div>
  <table class="table mb-3">
    <thead class="table-light">
      <tr>
        <th scope="col">#</th>
        <th scope="col">Recurso</th>
        <th scope="col">Rol</th>
        <th scope="col" class="text-center">Disponibles</th>
        <th scope="col" class="col-2">Asignadas</th>
        <th scope="col" class="text-center">Acciones</th>
      </tr>
    </thead>
    <tbody class="table-group-divider align-middle">
      <tr v-for="(miembro, index) in equipo" :key="index" class="h5">
        <td>{{ index + 1 }}</td>
        <td>
          <select class="form-select">
            <option
              v-for="(recurso, recursoIndex) in recursos"
              :key="recursoIndex"
              :value="recursoIndex"
              :selected="miembro.nombre == recurso"
            >
              {{ recurso }}
            </option>
          </select>
        </td>
        <td>
          <select class="form-select">
            <option v-for="(rol, rolIndex) in roles" :key="rolIndex" :value="rolIndex" :selected="miembro.rol == rol">
              {{ rol }}
            </option>
          </select>
        </td>
        <td class="text-center">{{ miembro.horasDisponibles }} hs</td>
        <td>
          <input class="form-control" type="number" max="9999" :value="miembro.horasAsignadas" />
        </td>
        <td class="text-center">
          <button class="btn icon" @click="$emit('removeResource', index)">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="d-flex flex-row px-3">
    <button class="btn btn-outline-primary btn-lg" @click="$emit('addResource')">Agregar recurso</button>
    <div class="col d-flex flex-row justify-content-end text-black-50 fw-light h5">
      <i class="bi bi-arrow-repeat"></i>
      <div class="fecha ms-1">{{ formatDate(fechaUltimaEdicion, 'dateAndTime') }}</div>
    </div>
  </div>
</template>
<script>
import FormatDate from '@/mixins/formatting-text/FormatDate.vue'

export default {
  mixins: [FormatDate],
  props: {
    equipo: {
      type: Array,
      required: true
    },
    fechaUltimaEdicion: {
      type: Date,
      required: true
    }
  },
  emits: ['addResource', 'removeResource'],
  data() {
    return {
      recursos: ['Rodrigo Loza', 'Yanina Silva', 'Mariano Soulé', 'Joaquin Zanardi', 'Yoana Gerling', 'Patricio Sabatini'],
      roles: ['QA', 'CEO', 'CTO', 'DEV', 'ADMIN']
    }
  }
}
</script>
<style scoped>
.title {
  background-color: #ebe5fc;
}

.icon {
  color: var(--bs-blue);
  font-size: 1.5rem;
}
</style>
