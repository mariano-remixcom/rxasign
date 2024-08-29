<template v-if="!loading">
  <div class="section-header-primary">Equipo</div>

  <!-- Tabla de recursos existentes -->
  <table v-if="equipo.length > 0" class="table mb-3">
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
        <td v-if="!miembro.editing">
          {{ miembro.fullName }}
        </td>
        <td v-if="miembro.editing">
          <select v-model="miembro.idUser" class="form-select" @change="fetchAvailableHours(miembro.idUser, miembro)">
            <option v-for="(recurso, recursoIndex) in recursos" :key="recursoIndex" :value="recurso.id">
              {{ recurso.fullName }}
            </option>
          </select>
        </td>
        <td v-if="!miembro.editing">
          {{ miembro.rolDisplayName }}
        </td>
        <td v-if="miembro.editing">
          <select v-model="miembro.rol" class="form-select">
            <option v-for="(rol, rolIndex) in roles" :key="rolIndex" :value="rol.key">
              {{ rol.displayName }}
            </option>
          </select>
        </td>
        <td class="text-center">{{ miembro.availableHours }} hs</td>
        <td v-if="!miembro.editing">
          {{ miembro.assignedHours }}
        </td>
        <td v-if="miembro.editing">
          <input v-model="miembro.assignedHours" class="form-control" type="number" />
        </td>
        <td class="text-center">
          <button v-if="!miembro.editing" class="btn icon" @click="editResource(miembro)">
            <i class="bi bi-pencil"></i>
          </button>
          <button v-if="miembro.editing" class="btn icon text-success" @click="saveResource(miembro)">
            <i class="bi bi-check-lg"></i>
          </button>
          <button class="btn icon text-danger" @click="removeResource(index)">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
  <!-- Botón para agregar recurso -->
  <div class="d-flex flex-row px-3">
    <button class="btn btn-outline-primary" @click="addNewResource">Agregar recurso</button>
    <div class="col d-flex flex-row justify-content-end text-gray align-items-center">
      <i class="bi bi-arrow-repeat"></i>
      <div class="ms-1">{{ formatDate(fechaUltimaEdicion, 'dateAndTime') }}</div>
    </div>
  </div>
</template>

<script>
import FormatDate from '@/mixins/formatting-text/FormatDate.vue'
import { USER_ROLES } from '@/constants/UserRoles'
import { UsersService } from '@/services/users'
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

  setup(props, { emit }) {
    const loading = ref(false)
    const recursos = ref(null)
    const equipoLocal = ref([...props.equipo])

    loading.value = true

    new UsersService()
      .getActiveResourcesForCombobox()
      .then((response) => {
        console.log(response)
        recursos.value = response.data
      })
      .finally(() => {
        loading.value = false
      })

    // Obtiene las horas disponibles para el usuario seleccionado
    function fetchAvailableHours(id, miembro) {
      if (id) {
        new UsersService()
          .getAvailableHoursForUser(id)
          .then((response) => {
            miembro.availableHours = response.data
          })
          .catch((error) => {
            console.error('Error al obtener las horas disponibles:', error)
          })
      }
    }

    // Agrega un nuevo recurso en blanco y lo pone en modo de edición
    function addNewResource() {
      const newMember = {
        idUser: '',
        fullName: '',
        rol: '',
        rolDisplayName: '',
        availableHours: 0,
        assignedHours: 0,
        editing: true
      }

      equipoLocal.value.push(newMember)
    }
    function editResource(miembro) {
      miembro.editing = true
    }
    function saveResource(miembro) {
      miembro.editing = false
      this.$emit('addResource', miembro)
      console.log(miembro, 'miembro')
    }
    function removeResource(index) {
      equipoLocal.value.splice(index, 1)
      this.$emit('removeResource', index)
    }

    return {
      loading,
      recursos,
      fetchAvailableHours,
      addNewResource,
      equipoLocal,
      editResource,
      saveResource,
      removeResource
    }
  },
  data() {
    return {
      roles: USER_ROLES
    }
  },
  methods: {}
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
.table-container {
  max-width: 880px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.table-title {
  color: #9c85d1;
  text-transform: uppercase;
  margin-bottom: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th,
td {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid #ddd;
}

th {
  color: #888;
  font-weight: normal;
}

input[type='text'],
input[type='number'],
select {
  width: 100%;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

input[type='number'] {
  max-width: 60px;
}

.delete-btn {
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
}

.delete-btn:hover {
  color: red;
}

.add-btn {
  display: inline-block;
  padding: 10px 20px;
  background-color: #9c85d1;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  cursor: pointer;
}

.add-btn:hover {
  background-color: #8a75be;
}

.timestamp {
  text-align: right;
  color: #aaa;
  font-size: 12px;
}
</style>
