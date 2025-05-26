<template>
  <div v-if="user" id="userTable" ref="userTable" class="accordion accordion-flush">
    <div class="accordion-item border-0 p-0">
      <div class="accordion-header"></div>
      <button
        class="accordion-button collapsed p-0 pe-3 bg-white border-bottom"
        type="button"
        data-bs-toggle="collapse"
        :data-bs-target="`#collapse${user.userId}`"
        aria-expanded="false"
        :aria-controls="`collapse${user.userId}`"
      >
        <div class="d-flex flex-row w-100">
          <div class="col-3 p-2-5">
            <div class="d-flex align-items-center">
              <img v-if="user.avatar" :src="user.avatar" class="rounded-circle" width="40" height="40" />
              <i v-else class="bi bi-person-circle h4 p-0 m-0" :title="user.fullName"></i>
              <div class="ms-2">
                <div class="fw-semibold">{{ user.fullName }}</div>
                <div class="text-muted">
                  <small v-for="(role, idx) in user.roles" :key="user.id + role">
                    {{ roles.find((r) => r.key === role).displayName }}
                    <span v-if="idx < user.roles.length - 1"> - </span>
                  </small>
                </div>
              </div>
            </div>
          </div>
          <div class="col p-2-5 align-content-center">{{ user.monthlyAssignedHours }} hs</div>
          <div class="col p-2-5 align-content-center">{{ user.registeredHours }} hs</div>
          <div
            v-for="week in user.registeredHoursByWeek"
            :key="user.userId + week.weekStart"
            class="col p-2-5 align-content-center"
          >
            <input v-model="week.totalHours" type="number" class="form-control input-fixed-width" readonly />
          </div>
        </div>
      </button>
    </div>
    <div :id="`collapse${user.userId}`" class="accordion-collapse collapse" data-bs-parent="#userTable">
      <div class="accordion-body">
        <table v-if="userDetails && userDetails.length > 0" class="table">
          <thead>
            <tr>
              <th>Proyecto</th>
              <th>Tarea</th>
              <th>Descripción</th>
              <th>Tiempo</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="registeredPeriod in userDetails" :key="'detailUser' + user.userId + '-' + registeredPeriod.id">
              <td>{{ registeredPeriod.project.client.name }} - {{ registeredPeriod.project.name }}</td>
              <td>Desarrollo</td>
              <td>TASK NAME</td>
              <td>{{ formatHours(registeredPeriod.hours) }}</td>
            </tr>
          </tbody>
        </table>
        <div v-if="userDetails && userDetails.length === 0" class="text-center text-muted">
          No hay detalles de horas registradas para este usuario.
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { USER_ROLES } from '@/constants/UserRoles'

export default {
  props: {
    user: {
      type: Object,
      required: true
    },
    userDetails: {
      type: Array,
      default: null
    }
  },
  emits: ['showDetails'],
  data() {
    return {
      roles: USER_ROLES
    }
  },
  mounted() {
    this.$refs.userTable.addEventListener('show.bs.collapse', () => {
      this.showUserDetails()
    })
  },
  methods: {
    showUserDetails() {
      this.$emit('showDetails', this.user.userId)
    },
    formatHours(hours) {
      if (hours === undefined || hours === null || hours === '' || hours === 0) {
        return '0 min'
      }

      const minutes = Math.round(hours * 60)

      return `${minutes} min`
    }
  }
}
</script>
<style scoped>
.p-2-5 {
  padding: 0.75rem !important;
}

.input-fixed-width {
  width: 80px;
}
</style>
