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
            <th scope="col">Disponibles</th>
            <th scope="col">Asignadas (hs)</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody class="align-middle">
          <tr v-for="(member, index) in teamMembers" :key="index">
            <td>
              <select v-model="member.userId" class="form-select" @change="updateMemberData(index)">
                <option v-for="user in users" :key="user.id" :value="user.id">{{ user.fullName }}</option>
              </select>
            </td>
            <td>
              <select v-model="member.role" class="form-select" @change="updateData">
                <option v-for="role in roles" :key="role.key" :value="role.key">{{ role.displayName }}</option>
              </select>
            </td>
            <td>{{ member.availableHours - member.hoursAssigned }} hs</td>
            <td>
              <input
                v-model="member.hoursAssigned"
                type="number"
                class="form-control"
                min="0"
                :max="member.availableHours"
                @input="updateData"
              />
            </td>
            <td>
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

export default {
  name: 'ProjectAddTeam',
  data() {
    return {
      roles: USER_ROLES,
      teamMembers: [],
      usersService: new UsersService(),
      users: [],
      isAdding: false
    }
  },
  async mounted() {
    try {
      const responseUsers = await this.usersService.getActiveResourcesForCombobox()

      this.users = responseUsers.data

      for (const user of this.users) {
        const responseHours = await this.usersService.getAvailableHoursForUser(user.id)

        user.availableHours = responseHours.data
      }
    } catch (err) {
      console.log('Error al recuperar los usuarios ', err)
    }
  },
  methods: {
    addMember() {
      // Añadir un nuevo integrante con `startDate` por defecto como la fecha de hoy
      this.teamMembers.push({
        userId: '',
        role: '',
        availableHours: 0,
        hoursAssigned: 0,
        startDate: new Date().toISOString()
      })

      this.isAdding = true
    },
    removeMember(index) {
      this.teamMembers.splice(index, 1)
    },
    updateMemberData(index) {
      const selectedUser = this.users.find((user) => user.id === this.teamMembers[index].userId)

      if (selectedUser) {
        this.teamMembers[index].availableHours = selectedUser.availableHours
      }
      this.updateData()
    },
    updateData() {
      // Preparar los datos para emitir solo los campos requeridos
      const formattedMembers = this.teamMembers.map((member) => ({
        rol: member.role,
        assignedHours: member.hoursAssigned,
        idUser: member.userId,
        startDate: member.startDate
      }))

      this.$emit('update-data', formattedMembers)
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
</style>
