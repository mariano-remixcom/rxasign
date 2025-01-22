<template>
  <div class="container mt-4">
    <table class="table">
      <thead class="table-light">
        <tr>
          <th scope="col">Avatar</th>
          <th scope="col">Nombre</th>
          <th scope="col">Horas Asignadas</th>
          <th scope="col">Horas Contratadas</th>
          <th scope="col">Horas Libres</th>
          <th scope="col">Acciones</th>
        </tr>
      </thead>
      <tbody class="align-middle">
        <tr v-for="(user, index) in users" :key="index">
          <td>
            <div class="avatar-container">
              <i class="bi bi-person-circle avatar-fallback" :title="user.fullName"></i>
            </div>
          </td>
          <td>
            <span class="link pointer" @click="togglePopover($event, user)">
              {{ user.fullName }}
            </span>
          </td>
          <td>{{ user.assignedHours }}</td>
          <td>
            <div v-if="editingUserIndex === index">
              <input v-model.number="editedHours" type="number" class="form-control form-control-sm" />
            </div>
            <div v-else>
              {{ user.monthlyContractedHours }}
            </div>
          </td>
          <td>{{ user.availableHours }}</td>
          <td>
            <div v-if="editingUserIndex === index">
              <button class="btn btn-link btn-m" @click="saveEdit(user.id, index)">
                <i class="bi bi-check-circle"></i>
              </button>
              <button class="btn btn-link btn-m" @click="cancelEdit">
                <i class="bi bi-x-circle"></i>
              </button>
            </div>
            <div v-else>
              <button class="btn btn-link btn-m" @click="startEdit(user.id, index)">
                <i class="bi bi-pencil-square"></i>
              </button>
              <!-- <button class="btn btn-link btn-m">
                <i class="bi bi-trash"></i>
              </button> -->
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Popover -->
    <div v-if="selectedUser" class="popover-container" :style="popoverStyles">
      <div class="popover custom-popover">
        <div class="popover-header">Proyectos de {{ selectedUser.fullName }}</div>
        <div class="popover-body">
          <table v-if="selectedUser.resources && selectedUser.resources.length" class="table table-sm mt-2">
            <thead>
              <tr>
                <th>Proyecto</th>
                <th>Hs Asignadas</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="resource in selectedUser.resources" :key="resource.id">
                <td>{{ resource.squad.project.name }}</td>
                <td>{{ resource.assignedHours }}</td>
              </tr>
            </tbody>
          </table>
          <div v-else>
            <br />
            Aún no se le han asignado horas.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UsersService from '@/services/users'
import { useToaster } from '@/helpers/alerts/toasts/useToaster'

export default {
  name: 'UsuariosTable',
  data() {
    return {
      usersService: new UsersService(),
      users: [],
      selectedUser: null,
      popoverStyles: {},
      editingUserIndex: null, // Índice del usuario en modo de edición
      originalHours: null, // Valor original de horas antes de editar
      editedHours: null
    }
  },
  mounted() {
    this.loadUsersAndHours()
  },

  methods: {
    async loadUsersAndHours() {
      await this.getUsers()
      await this.getAvailableHours()
      await this.getAssignedHours()
      await this.getResources()
    },
    async getUsers() {
      try {
        const response = await this.usersService.getAllUsers()

        this.users = response.data
        console.log(this.users, 'users')
      } catch (err) {
        console.log('Error al obtener los usuarios: ', err)
      }
    },
    async getAvailableHours() {
      const usersWithHours = await Promise.all(
        this.users.map(async (user) => {
          try {
            const hoursResponse = await this.usersService.getAvailableHoursForUser(user.id)

            return {
              ...user,
              availableHours: hoursResponse.data
            }
          } catch (err) {
            console.error(`Error al obtener las horas disponibles para el usuario ${user.id}: `, err)

            return { ...user, availableHours: 0 } // En caso de error, asignar 0 horas disponibles
          }
        })
      )

      this.users = usersWithHours
      console.log(this.users, 'users with available hours')
    },
    async getAssignedHours() {
      const usersWithHoursAssigned = await Promise.all(
        this.users.map(async (user) => {
          try {
            const hoursResponse = await this.usersService.getAssignedHoursForUser(user.id)

            return {
              ...user,
              assignedHours: hoursResponse.data.assignedHours
            }
          } catch (err) {
            console.error(`Error al obtener las horas asignadas para el usuario ${user.id}: `, err)

            return { ...user, assignedHours: 0 } // En caso de error, asignar 0 horas asignadas
          }
        })
      )

      this.users = usersWithHoursAssigned
      console.log(this.users, 'users with assigned hours')
    },
    async getResources() {
      const usersWithResources = await Promise.all(
        this.users.map(async (user) => {
          try {
            const resourcesResponse = await this.usersService.getUserWithResources(user.id)

            return {
              ...user,
              resources: resourcesResponse.data.resources
            }
          } catch (err) {
            console.error(`Error al obtener los recursos asociados al usuario ${user.id}: `, err)

            return { ...user, resources: 0 }
          }
        })
      )

      this.users = usersWithResources
      console.log(this.users, 'users with resources')
    },
    togglePopover(event, user) {
      event.stopPropagation()
      if (this.selectedUser === user) {
        this.closePopover()

        return
      }

      this.selectedUser = user
      const rect = event.target.getBoundingClientRect()

      this.popoverStyles = {
        position: 'absolute',
        top: `${rect.top + window.scrollY}px`,
        left: `${rect.right + 10}px`,
        zIndex: 1000
      }

      // Escuchar clicks en el documento
      document.addEventListener('click', this.handleOutsideClick)
    },
    closePopover() {
      this.selectedUser = null

      // Eliminar el listener de clicks
      document.removeEventListener('click', this.handleOutsideClick)
    },
    handleOutsideClick(event) {
      const popover = document.querySelector('.popover-container')

      if (popover && !popover.contains(event.target)) {
        this.closePopover()
      }
    },
    startEdit(userId, index) {
      this.editingUserIndex = index // Establece el índice del usuario a editar
      this.originalHours = this.users[index].monthlyContractedHours // Guarda el valor original
      this.editedHours = this.originalHours // Copia el valor actual
    },
    saveEdit(userId, index) {
      const user = this.users[index]

      // Validar si las nuevas horas contratadas son menores a las horas asignadas
      if (this.editedHours < user.assignedHours) {
        this.showErrorToast('Las horas contratadas no pueden ser menores a las horas asignadas.')

        return
      }

      // Actualiza el valor en la tabla localmente
      this.users[index].monthlyContractedHours = this.editedHours

      // Envía los datos al backend
      this.updateUserHours(userId, this.editedHours)
        .then(() => {
          this.showSuccessToast('Horas actualizadas exitosamente.')
        })
        .catch((error) => {
          this.showErrorToast('Error al actualizar las horas: ' + error.message)
          this.users[index].monthlyContractedHours = this.originalHours // Restaura si hay error
        })
        .finally(() => {
          this.resetEditState() // Finaliza el modo de edición
        })
    },
    cancelEdit() {
      // Cancela los cambios y restaura el valor original
      this.resetEditState()
    },
    resetEditState() {
      this.editingUserIndex = null
      this.originalHours = null
      this.editedHours = null
    },
    async updateUserHours(userId, newHours) {
      const editResponse = await this.usersService.updateUser(userId, { monthlyContractedHours: newHours })

      console.log(editResponse)
      this.loadUsersAndHours()
    },
    showSuccessToast(message) {
      const { addToast } = useToaster()

      addToast(message, 'success')
    },
    showErrorToast(message) {
      const { addToast } = useToaster()

      addToast(message, 'danger')
    }
  }
}
</script>

<style scoped lang="scss">
/* Estilo de botones de tabla */
button.btn.btn-link.btn-m {
  --bs-btn-padding-x: 0.2rem;
  --bs-btn-padding-y: 0;
  color: $blue;
}

/* Estilo de avatares */
.avatar-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-fallback {
  font-size: 1.5rem;
  color: #6c757d; /* Color de icono */
}
.pointer {
  color: $blue;
  cursor: pointer;
  text-decoration: underline;
}
.popover-container {
  position: absolute;
  z-index: 1000;
}

.popover {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  max-width: 300px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 10px;
  position: relative;
}

.popover-header {
  background-color: #6f42c1;
  color: white;
  font-size: 16px;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 8px 8px 0 0;
}

.popover-body {
  padding: 10px;
  font-size: 14px;
  color: #333;
}

.popover::after {
  content: '';
  position: absolute;
  top: 50%;
  left: -10px;
  transform: translateY(-50%);
  border-width: 10px;
  border-style: solid;
  border-color: transparent white transparent transparent;
}

.close-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: transparent;
  border: none;
  font-size: 16px;
  cursor: pointer;
}
</style>
