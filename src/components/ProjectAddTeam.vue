<template>
  <div class="container">
    <div class="section-header-primary" role="alert">Integrantes del equipo</div>

    <div v-if="teamMembers.length === 0" class="d-flex align-items-center justify-content-center">
      <h2 class="h6 mb-4">Aún no hay recursos asociados a este proyecto.</h2>
    </div>

    <div v-if="isAdding" class="wmt-4 mb-4">
      <table class="table">
        <thead class="table-light">
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Rol</th>
            <th scope="col" class="text-center">Disponibles</th>
            <th scope="col" class="text-center">Asignadas (hs)</th>
            <th scope="col" class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody class="align-middle">
          <tr v-for="(member, index) in teamMembers" :key="index">
            <td>
              <select v-model="member.userId" class="form-select" @change="updateMemberData(index)">
                <option v-for="user in users" :key="user.id" :value="user.id">{{ user.fullName }}</option>
              </select>
              <div v-if="changed">
                <div v-for="error in v$.teamMembers.$each.$response.$errors[index].userId" :key="error" class="text-danger">
                  Debe seleccionar un recurso.
                </div>
              </div>
            </td>
            <td>
              <select v-model="member.role" class="form-select" @change="updateData">
                <option v-for="role in roles" :key="role.key" :value="role.key">{{ role.displayName }}</option>
              </select>
              <div v-if="changed">
                <div v-for="error in v$.teamMembers.$each.$response.$errors[index].role" :key="error" class="text-danger">
                  Debe seleccionar un rol.
                </div>
              </div>
              <div v-if="duplicateRolesError" class="text-danger">Este usuario ya tiene asignado este rol.</div>
            </td>
            <td
              v-if="!isUserIdInTeamMembers"
              :class="[
                'text-center',
                { 'text-danger font-weight-bold': isNegative(getAvailableHoursForUser(member.userId), member.hoursAssigned) }
              ]"
            >
              {{ getAvailableHoursForUser(member.userId) - member.hoursAssigned }} hs
            </td>
            <td
              v-if="isUserIdInTeamMembers"
              :class="[
                'text-center',
                { 'text-danger font-weight-bold': isNegative(calculateAvailableHours(member.userId), member.hoursAssigned) }
              ]"
            >
              {{ calculateAvailableHours(member.userId) }} hs
            </td>

            <td>
              <input
                v-model="member.hoursAssigned"
                type="number"
                class="form-control"
                min="0"
                :max="member.availableHours"
                @input="updateData"
              />
              <div v-if="changed">
                <div
                  v-for="error in v$.teamMembers.$each.$response.$errors[index].hoursAssigned"
                  :key="error"
                  class="text-danger"
                >
                  La asignación horaria es requerida.
                </div>
              </div>
            </td>
            <td class="text-center">
              <button class="btn btn-link btn-m" @click="removeMember(index)"><i class="bi bi-trash"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="d-flex align-items-center justify-content-center">
      <button class="btn btn-outline-primary" @click="addMember">Agregar Integrante</button>
    </div>
  </div>
</template>

<script>
import { USER_ROLES } from '@/constants/UserRoles'
import { UsersService } from '@/services/users'
import { helpers, minValue, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

export default {
  name: 'ProjectAddTeam',
  emits: ['update-data'],
  setup() {
    return {
      v$: useVuelidate()
    }
  },
  data() {
    return {
      roles: USER_ROLES,
      teamMembers: [],
      usersService: new UsersService(),
      users: [],
      isAdding: false,
      changed: false,
      availableHoursMap: {},
      duplicateRolesError: false,
      isUserIdInTeamMembers: false
    }
  },
  validations() {
    return {
      teamMembers: {
        $each: helpers.forEach({
          userId: { required },
          role: {
            required
          },
          hoursAssigned: { required, minValue: minValue(1) }
        })
      }
    }
  },
  async mounted() {
    try {
      const responseUsers = await this.usersService.getActiveResourcesForCombobox()

      this.users = responseUsers.data
      console.log(this.users)
      this.users.forEach((user) => {
        if (user.id) {
          this.fetchAvailableHours(user.id)
        }
      })
    } catch (err) {
      console.log('Error al recuperar los usuarios ', err)
    }
  },

  methods: {
    calculateAvailableHours(userId) {
      const totalHours = this.getAvailableHoursForUser(userId)

      const previousAssignments = this.teamMembers
        .filter((member) => member.userId === userId)
        .reduce((acc, member) => acc + (member.hoursAssigned || 0), 0)

      return totalHours - previousAssignments
    },
    async fetchAvailableHours(id) {
      if (id) {
        try {
          const response = await this.usersService.getAvailableHoursForUser(id)

          this.availableHoursMap[id] = response.data
          console.log(`Available hours for user ID ${id}:`, response.data)
        } catch (error) {
          console.error('Error al obtener las horas disponibles:', error)
        }
      }
    },
    getAvailableHoursForUser(id) {
      return this.availableHoursMap[id] || 0 // Devuelve 0 si no hay datos disponibles aún
    },
    addMember() {
      // Añadir un nuevo integrante con `startDate` por defecto como la fecha de hoy
      this.teamMembers.push({
        userId: null,
        role: null,
        availableHours: 0,
        hoursAssigned: null,
        startDate: new Date().toISOString()
      })

      this.isAdding = true
    },
    removeMember(index) {
      this.teamMembers.splice(index, 1)
    },
    async updateMemberData(index) {
      const selectedUserId = this.teamMembers[index].userId

      // Verificar si el usuario ya está en los miembros del equipo
      this.isUserIdInTeamMembers = this.teamMembers.some(
        (member) => member.userId === selectedUserId && member !== this.teamMembers[index]
      )

      const selectedUser = this.users.find((user) => user.id === selectedUserId)

      if (selectedUser) {
        await this.fetchAvailableHours(selectedUser.id)
        // Recalcular horas disponibles para todos los miembros y actualizar el miembro actual
        this.teamMembers[index].availableHours = this.calculateAvailableHours(selectedUser.id)
        this.updateData(index) // Asegúrate de revalidar después de actualizar los datos
      } else {
        this.updateData(index) // Si no hay usuario seleccionado, también actualiza
      }
    },
    async updateData() {
      if (!this.checkDuplicateRoles()) {
        return
      }
      this.changed = false
      this.duplicateRolesError = false

      const formattedMembers = this.teamMembers.map((member) => ({
        rol: member.role,
        assignedHours: member.hoursAssigned,
        idUser: member.userId,
        startDate: member.startDate
      }))

      this.$emit('update-data', formattedMembers)
    },
    async submitForm() {
      if (this.teamMembers.length === 0) {
        return true
      }

      const isFormCorrect = await this.v$.$validate()

      const areRolesUnique = this.checkDuplicateRoles()

      this.changed = !isFormCorrect
      this.duplicateRolesError = !areRolesUnique

      if (this.changed || this.duplicateRolesError) {
        return false
      }

      return true
    },

    checkDuplicateRoles() {
      const roles = this.teamMembers.map((member) => member.role)
      const uniqueRoles = new Set(roles)

      this.duplicateRoleError = roles.length !== uniqueRoles.size

      return !this.duplicateRoleError
    },

    isNegative(availableHours, hoursAssigned) {
      return availableHours - hoursAssigned < 0
    }
  }
}
</script>
<style scoped lang="scss">
/* fix botones de tabla */
button.btn.btn-link.btn-m {
  color: $blue;
  --bs-btn-padding-x: 0.2rem;
  --bs-btn-padding-y: 0;
}
.negative {
  color: red !important; /* Utilizamos !important para evitar conflictos de estilos */
  font-weight: bold;
}
</style>
