<template v-if="!loading">
  <div class="section-header-primary">Equipo</div>
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
    <tbody class="align-middle">
      <tr v-for="(miembro, index) in equipo" :key="index">
        <td>{{ index + 1 }}</td>
        <td>
          <select class="form-select">
            <option
              v-for="(recurso, recursoIndex) in recursos"
              :key="recursoIndex"
              :value="recurso.id"
              :selected="miembro.idUser === recurso.id"
            >
              {{ recurso.fullName }}
            </option>
          </select>
        </td>
        <td>
          <select class="form-select">
            <option v-for="(rol, rolIndex) in roles" :key="rolIndex" :value="rolIndex" :selected="miembro.rol === rol.key">
              {{ rol.displayName }}
            </option>
          </select>
        </td>
        <td class="text-center">{{ miembro.availableHours }} hs</td>
        <td>
          <input class="form-control" type="number" max="9999" :value="miembro.assignedHours" />
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
    <button class="btn btn-outline-primary" @click="$emit('addResource')">Agregar recurso</button>
    <div class="col d-flex flex-row justify-content-end text-gray align-items-center">
      <i class="bi bi-arrow-repeat"></i>
      <div class="ms-1">{{ formatDate(fechaUltimaEdicion, 'dateAndTime') }}</div>
    </div>
  </div>
</template>
<script>
import FormatDate from '@/mixins/formatting-text/FormatDate.vue'
import { USER_ROLES } from '@/constants/UserRoles'
import { obtenerRecursosActivosParaCombos } from '@/api/users'
import { ref } from 'vue'

export default {
  mixins: [FormatDate],
  props: {
    equipo: {
      type: Array,
      required: true
    },
    fechaUltimaEdicion: {
      type: String,
      required: true
    }
  },
  emits: ['addResource', 'removeResource'],
  setup: function () {
    const loading = ref(false)
    const recursos = ref(null)

    loading.value = true

    obtenerRecursosActivosParaCombos()
      .then((response) => {
        recursos.value = response.data
      })
      .finally(() => {
        loading.value = false
      })

    return {
      loading,
      recursos
    }
  },
  data() {
    return {
      roles: USER_ROLES
    }
  }
}
</script>
<style scoped lang="scss">
.title {
  background-color: #ebe5fc;
}

.icon {
  color: $blue;
  font-size: 24px;
}
.text-gray {
  color: $gray;
}
</style>
