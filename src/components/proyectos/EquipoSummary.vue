<template v-if="!loading">
  <div class="section-header-primary">Equipo</div>

  <!-- Tabla de recursos existentes -->
  <table v-if="equipoLocal.length > 0" class="table mb-3">
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
      <tr v-for="(miembro, index) in equipoLocal" :key="index">
        <td>{{ index + 1 }}</td>
        <!-- Recurso -->
        <td v-if="!miembro.editing">
          {{ miembro.user?.fullName || miembro.fullName }}
        </td>
        <td v-else>
          <select v-model="miembro.idUser" class="form-select" @change="fetchAvailableHours(miembro.idUser, miembro)">
            <option v-for="(recurso, recursoIndex) in recursos" :key="recursoIndex" :value="recurso.id">
              {{ recurso.fullName }}
            </option>
          </select>
        </td>
        <!-- Rol -->
        <td v-if="!miembro.editing">
          {{ miembro.rol }}
        </td>
        <td v-else>
          <select v-model="miembro.rol" class="form-select">
            <option v-for="(rol, rolIndex) in roles" :key="rolIndex" :value="rol.key">
              {{ rol.displayName }}
            </option>
          </select>
        </td>
        <!-- Horas Disponibles -->
        <td class="text-center">{{ miembro.availableHours }} hs</td>
        <!-- Horas Asignadas -->
        <td v-if="!miembro.editing">
          {{ miembro.assignedHours }}
        </td>
        <td v-else>
          <input v-model="miembro.assignedHours" class="form-control" type="number" />
        </td>
        <!-- Acciones -->
        <td class="text-center">
          <button v-if="!miembro.editing" class="btn icon" @click="editResource(miembro)">
            <i class="bi bi-pencil-square"></i>
          </button>
          <button v-if="miembro.editing" class="btn icon text-success" @click="saveResource(miembro)">
            <i class="bi bi-check-lg"></i>
          </button>
          <button class="btn icon text-danger" @click="removeResource(miembro.id)">
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
import ResourcesService from '@/services/resources'
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
  emits: ['addResource'],
  setup(props, { emit }) {
    const loading = ref(false)
    const recursos = ref([])
    const equipoLocal = ref([...props.equipo])

    loading.value = true

    new UsersService()
      .getActiveResourcesForCombobox()
      .then((response) => {
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

    // Edita el recurso seleccionado
    function editResource(miembro) {
      miembro.editing = true
    }

    // Guarda o agrega el recurso
    function saveResource(miembro) {
      if (!miembro.id) {
        addResource(miembro)
      } else {
        updateResource(miembro)
      }
    }

    // Lógica para agregar un recurso
    function addResource(miembro) {
      miembro.editing = false
      emit('addResource', miembro)
      window.location.reload()
    }

    // Lógica para actualizar un recurso existente
    function updateResource(miembro) {
      new ResourcesService()
        .updateResource(miembro.id, miembro)
        .then((response) => {
          miembro.editing = false
          console.log('Recurso actualizado:', response.data)
          fetchAvailableHours(miembro.idUser, miembro)
        })
        .catch((error) => {
          console.error('Error al actualizar recurso:', error)
        })
    }

    // Elimina un recurso
    function removeResource(id) {
      new ResourcesService()
        .deleteResource(id)
        .then((response) => {
          equipoLocal.value = equipoLocal.value.filter((miembro) => miembro.id !== id)
          console.log('Recurso eliminado:', response.data)
        })
        .catch((error) => {
          console.error('Error al eliminar recurso:', error)
        })
    }

    return {
      loading,
      recursos,
      equipoLocal,
      fetchAvailableHours,
      addNewResource,
      editResource,
      saveResource,
      removeResource,
      addResource
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
