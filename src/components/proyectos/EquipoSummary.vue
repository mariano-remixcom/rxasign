<template>
  <div v-if="!loading">
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
    <ConfirmModal
      :is-visible="isVisibleConfirm"
      message="¿Estás seguro que deseas guardar los cambios?"
      @close="
        () => {
          isVisibleConfirm = false
        }
      "
      @confirm="updateResource"
    />

    <DeleteModal
      :is-visible="showModalDelete"
      message="¿Estás seguro que deseas eliminar este recurso?"
      @close="
        () => {
          showModalDelete = false
        }
      "
      @delete="confirmRemoveResource"
    />
  </div>
</template>

<script>
import ConfirmModal from '@/components/shared/ConfirmModal.vue'
import DeleteModal from '@/components/shared/DeleteModal.vue'
import FormatDate from '@/mixins/formatting-text/FormatDate.vue'
import ResourcesService from '@/services/resources'
import { USER_ROLES } from '@/constants/UserRoles'
import { UsersService } from '@/services/users'

export default {
  components: {
    ConfirmModal,
    DeleteModal
  },
  mixins: [FormatDate],
  props: {
    equipo: {
      type: Array,
      required: true
    },
    fechaUltimaEdicion: {
      type: String,
      required: true
    },
    idSquad: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      recursos: [],
      equipoLocal: [...this.equipo],
      currentResource: null,
      isVisibleConfirm: false,
      showModalDelete: false,
      roles: USER_ROLES
    }
  },
  mounted() {
    this.getResources()
  },
  methods: {
    getResources() {
      this.loading = true
      new UsersService()
        .getActiveResourcesForCombobox()
        .then((response) => {
          this.recursos = response.data
        })
        .catch((error) => {
          console.error('Error al obtener los recursos:', error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    fetchAvailableHours(id, miembro) {
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
    },
    addNewResource() {
      const newMember = {
        idUser: '',
        fullName: '',
        rol: '',
        rolDisplayName: '',
        availableHours: 0,
        assignedHours: 0,
        editing: true
      }

      this.equipoLocal.push(newMember)
    },
    editResource(miembro) {
      miembro.editing = true
    },
    saveResource(miembro) {
      if (!miembro.id) {
        this.addResource(miembro)
      } else {
        this.currentResource = miembro
        this.isVisibleConfirm = true
      }
    },
    addResource(miembro) {
      miembro.editing = false
      const newMember = {
        rol: miembro.rol,
        assignedHours: miembro.assignedHours,
        idSquad: this.idSquad,
        idUser: miembro.idUser,
        startDate: new Date().toISOString()
      }

      new ResourcesService()
        .createResource(newMember)
        .then((response) => {
          console.log(response, 'recurso creado')
          const recursoCreado = response.data
          const recursoEncontrado = this.recursos.find((recurso) => recurso.id === miembro.idUser)

          if (recursoEncontrado) {
            miembro.fullName = recursoEncontrado.fullName
            miembro.id = recursoCreado.id
            // this.equipoLocal.push(miembro)
          }
        })
        .catch((error) => {
          console.error('Error al agregar recurso:', error)
        })
    },
    updateResource() {
      new ResourcesService()
        .updateResource(this.currentResource.id, this.currentResource)
        .then((response) => {
          this.isVisibleConfirm = false
          console.log('Recurso actualizado:', response.data)
          this.fetchAvailableHours(this.currentResource.idUser, this.currentResource)
          this.currentResource.editing = false
          this.currentResource = ''
        })
        .catch((error) => {
          console.error('Error al actualizar recurso:', error)
        })
    },
    removeResource(id) {
      this.currentResource = id
      this.showModalDelete = true
    },
    confirmRemoveResource() {
      new ResourcesService()
        .deleteResource(this.currentResource)
        .then((response) => {
          this.equipoLocal = this.equipoLocal.filter((miembro) => miembro.id !== this.currentResource)
          console.log('Recurso eliminado:', response.data)
          this.showModalDelete = false
          this.currentResource = ''
        })
        .catch((error) => {
          console.error('Error al eliminar recurso:', error)
        })
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
