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
          <th scope="col" class="text-center">Hs disponibles del recurso</th>
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

            <div v-if="miembro.showErrors">
              <div v-for="error in v$.equipoLocal.$each.$response.$errors[index].idUser" :key="error" class="text-danger">
                Debe seleccionar un recurso.
              </div>
            </div>
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

            <div v-if="miembro.showErrors">
              <div v-for="error in v$.equipoLocal.$each.$response.$errors[index].rol" :key="error" class="text-danger">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </div>
          </td>
          <!-- Horas Disponibles -->
          <td
            v-if="!miembro.adding"
            :class="['text-center', { negative: isNegative(getAvailableHoursForUser(miembro.idUser), miembro.assignedHours) }]"
          >
            {{ getAvailableHoursForUser(miembro.idUser) }} hs
          </td>
          <td
            v-else
            :class="['text-center', { negative: isNegative(getAvailableHoursForUser(miembro.idUser), miembro.assignedHours) }]"
          >
            {{ getAvailableHoursForUser(miembro.idUser) - miembro.assignedHours }} hs
          </td>

          <!-- Horas Asignadas -->
          <td v-if="!miembro.editing">
            {{ miembro.assignedHours }}
          </td>
          <td v-else>
            <input v-model="miembro.assignedHours" class="form-control" type="number" />
            <div v-if="miembro.showErrors">
              <div
                v-for="error in v$.equipoLocal.$each.$response.$errors[index].assignedHours"
                :key="error"
                class="text-danger"
              >
                La asignación horaria es requerida.
              </div>
            </div>
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
        <tr>
          <td colspan="4" class="text-end fw-bold">Total asignadas:</td>
          <td class="fw-bold">{{ totalAssignedHours }} de {{ horasContratadas }} hs</td>
          <td></td>
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
import { helpers, minValue, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

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
    },
    horasContratadas: {
      type: Number,
      required: true
    }
  },
  setup() {
    return {
      v$: useVuelidate()
    }
  },
  validations() {
    return {
      equipoLocal: {
        $each: helpers.forEach({
          idUser: {
            required
          },
          rol: {
            required: helpers.withMessage('El rol es requerido.', required),
            duplicatedRole: helpers.withMessage('Este usuario ya tiene asignado este rol.', (value, parent, index) =>
              this.checkDuplicateRole(parent.idUser, index)
            )
          },
          assignedHours: { required, minValue: minValue(1) }
        })
      }
    }
  },
  data() {
    return {
      loading: false,
      recursos: [],
      equipoLocal: [...this.equipo].map((miembro) => ({ ...miembro, showErrors: false })),
      currentResource: null,
      isVisibleConfirm: false,
      showModalDelete: false,
      roles: USER_ROLES,
      availableHoursMap: {}
    }
  },
  computed: {
    totalAssignedHours() {
      return this.equipoLocal.reduce((sum, miembro) => sum + (miembro.assignedHours || 0), 0)
    }
  },
  mounted() {
    this.getResources()
    this.equipoLocal.forEach((miembro) => {
      if (miembro.idUser) {
        this.fetchAvailableHours(miembro.idUser)
      }
    })
  },
  methods: {
    getResources() {
      this.loading = true
      new UsersService()
        .getActiveResourcesForCombobox()
        .then((response) => {
          this.recursos = response.data
          console.log(this.recursos, 'recursos')
        })
        .catch((error) => {
          console.error('Error al obtener los recursos:', error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    fetchAvailableHours(id) {
      if (id) {
        new UsersService()
          .getAvailableHoursForUser(id)
          .then((response) => {
            this.availableHoursMap[id] = response.data
            console.log(`Available hours for user ID ${id}:`, response.data)
          })
          .catch((error) => {
            console.error('Error al obtener las horas disponibles:', error)
          })
      }
    },

    getAvailableHoursForUser(id) {
      return this.availableHoursMap[id] || 0 // Devuelve 0 si no hay datos disponibles aún
    },

    addNewResource() {
      const newMember = {
        idUser: '',
        fullName: '',
        rol: '',
        rolDisplayName: '',
        availableHours: 0,
        assignedHours: '',
        editing: true,
        showErrors: false,
        adding: true
      }

      this.equipoLocal.push(newMember)
    },
    editResource(miembro) {
      miembro.editing = true
      miembro.showErrors = false
    },
    async saveResource(miembro) {
      this.currentResource = miembro
      console.log(this.currentResource, 'current')
      const isFormCorrect = await this.v$.$validate()

      if (!isFormCorrect) {
        miembro.showErrors = true

        return
      }

      miembro.showErrors = false

      if (!miembro.id) {
        this.addResource(miembro)
      } else {
        this.isVisibleConfirm = true
      }
    },
    checkDuplicateRole(idUser, index) {
      const user = this.equipoLocal[index]

      return !this.equipoLocal.some((miembro, i) => miembro.idUser === idUser && miembro.rol === user.rol && i !== index)
    },
    addResource(miembro) {
      miembro.editing = false
      miembro.adding = false
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
            this.fetchAvailableHours(miembro.idUser)
            // this.equipoLocal.push(miembro)
          }
        })
        .catch((error) => {
          console.error('Error al agregar recurso:', error)
        })
    },
    async updateResource() {
      try {
        const response = await new UsersService().getUserById(this.currentResource.idUser)

        this.currentResource.user = response.data
        // console.log(`User ${this.currentResource.userId}:`, response.data)

        await new ResourcesService().updateResource(this.currentResource.id, this.currentResource)
        this.isVisibleConfirm = false
        // console.log('Recurso actualizado:', updateResponse.data)
        await this.fetchAvailableHours(this.currentResource.idUser)

        this.currentResource.editing = false
        this.currentResource.showErrors = false
        this.currentResource = null
      } catch (error) {
        console.error('Error al actualizar el recurso o al obtener el usuario:', error)
      }
    },
    removeResource(id) {
      this.showModalDelete = true
      this.currentResource = id
    },
    confirmRemoveResource() {
      new ResourcesService()
        .deleteResource(this.currentResource)
        .then((response) => {
          this.equipoLocal = this.equipoLocal.filter((miembro) => miembro.id !== this.currentResource)
          this.equipoLocal.forEach((miembro) => {
            if (miembro.idUser) {
              this.fetchAvailableHours(miembro.idUser, miembro)
            }
          })
          console.log('Recurso eliminado:', response.data)
          this.showModalDelete = false
          this.currentResource = ''
        })
        .catch((error) => {
          console.error('Error al eliminar recurso:', error)
        })
    },
    isNegative(available, assigned) {
      return available - assigned < 0
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
.negative {
  color: red !important; /* Utilizamos !important para evitar conflictos de estilos */
  font-weight: bold;
}
</style>
