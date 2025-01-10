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
              <i class="bi bi-person-circle avatar-fallback" :title="user.nombre"></i>
            </div>
          </td>
          <td>{{ user.fullName }}</td>
          <td>{{ user.assignedHours }}</td>
          <td>{{ user.monthlyContractedHours }}</td>
          <td>{{ user.availableHours }}</td>
          <td>
            <button class="btn btn-link btn-m"><i class="bi bi-pencil-square"></i></button>
            <button class="btn btn-link btn-m"><i class="bi bi-trash"></i></button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import UsersService from '@/services/users'

export default {
  name: 'UsuariosTable',
  data() {
    return {
      usersService: new UsersService(),
      users: []
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
</style>
