<template>
  <table class="table">
    <thead class="table-light">
      <tr>
        <th>Usuario</th>
        <th>Asignadas</th>
        <th>Registradas</th>
        <th>Semana 1</th>
        <th>Semana 2</th>
        <th>Semana 3</th>
        <th>Semana 4</th>
        <th>Semana 5</th>
      </tr>
    </thead>
    <tbody class="align-middle">
      <tr v-for="user in users" :key="user.userId">
        <td>
          <div class="d-flex align-items-center bg-white">
            <img v-if="user.avatar" :src="user.avatar" class="rounded-circle" width="40" height="40" />
            <i v-else class="bi bi-person-circle bg-white h4 p-0 m-0" :title="user.fullName"></i>
            <div class="bg-white ms-2">
              <strong>{{ user.fullName }}</strong>
              <div class="text-muted">
                <small v-for="(role, idx) in user.roles" :key="user.id + role">
                  {{ roles.find((r) => r.key === role).displayName }}
                  <span v-if="idx < user.roles.length - 1"> - </span>
                </small>
              </div>
            </div>
          </div>
        </td>
        <td>{{ user.monthlyAssignedHours }} hs</td>
        <td>{{ user.registeredHours }} hs</td>
        <td v-for="week in user.registeredHoursByWeek" :key="user.userId + week.weekStart">
          <input v-model="week.totalHours" type="number" class="form-control input-fixed-width" readonly />
        </td>
      </tr>
      <tr>
        <td>Total</td>
        <td>{{ totalAssignedHours }} hs</td>
        <td>{{ totalRegisteredHours }} hs</td>
        <td>{{ totalRegisteredHoursWeek1 }} hs</td>
        <td>{{ totalRegisteredHoursWeek2 }} hs</td>
        <td>{{ totalRegisteredHoursWeek3 }} hs</td>
        <td>{{ totalRegisteredHoursWeek4 }} hs</td>
        <td>{{ totalRegisteredHoursWeek5 }} hs</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { USER_ROLES } from '@/constants/UserRoles'

export default {
  props: {
    users: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      roles: USER_ROLES
    }
  },
  computed: {
    totalAssignedHours() {
      return this.users.reduce((acc, user) => acc + user.monthlyAssignedHours, 0)
    },
    totalRegisteredHours() {
      return this.users.reduce((acc, user) => acc + user.registeredHours, 0)
    },
    totalRegisteredHoursWeek1() {
      return this.users.reduce((acc, user) => acc + user.registeredHoursByWeek[0].totalHours, 0)
    },
    totalRegisteredHoursWeek2() {
      return this.users.reduce((acc, user) => acc + user.registeredHoursByWeek[1].totalHours, 0)
    },
    totalRegisteredHoursWeek3() {
      return this.users.reduce((acc, user) => acc + user.registeredHoursByWeek[2].totalHours, 0)
    },
    totalRegisteredHoursWeek4() {
      return this.users.reduce((acc, user) => acc + user.registeredHoursByWeek[3].totalHours, 0)
    },
    totalRegisteredHoursWeek5() {
      return this.users.reduce((acc, user) => acc + user.registeredHoursByWeek[4].totalHours, 0)
    }
  }
}
</script>

<style scoped>
.table td {
  padding: 0.75rem;
}

.input-fixed-width {
  width: 80px;
}
</style>
