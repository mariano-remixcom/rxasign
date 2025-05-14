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
                <small v-for="role in user.roles" :key="user.id + role">
                  {{ roles.find((r) => r.key === role).displayName }}
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
