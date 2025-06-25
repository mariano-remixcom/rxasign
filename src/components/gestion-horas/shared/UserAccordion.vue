<template>
  <div v-if="user" ref="userTable" class="accordion-item border-0 p-0">
    <div :id="`header${user.userId}`" class="accordion-header d-flex flex-row bg-white border-bottom">
      <div class="p-2 align-self-center">
        <input type="checkbox" :checked="selected" @click="toggleUser" />
      </div>
      <button
        class="accordion-button collapsed p-0 pe-3 bg-white"
        type="button"
        data-bs-toggle="collapse"
        :data-bs-target="`#collapse${user.userId}`"
        aria-expanded="false"
        :aria-controls="`collapse${user.userId}`"
      >
        <div class="d-flex flex-row w-100">
          <div class="col-6 col-lg-3 p-2-5">
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
          <div class="col-3 col-lg p-2-5 align-content-center">{{ user.monthlyAssignedHours }} hs</div>
          <div class="col-3 col-lg p-2-5 align-content-center">{{ user.registeredHours }} hs</div>
          <div
            v-for="week in user.registeredHoursByWeek"
            :key="user.userId + week.weekStart"
            class="d-none d-lg-flex col p-2-5 align-content-center"
          >
            <input v-model="week.totalHours" type="number" class="form-control input-fixed-width" readonly />
          </div>
        </div>
      </button>
    </div>
    <div :id="`collapse${user.userId}`" class="accordion-collapse collapse" :aria-labelledby="`header${user.userId}`">
      <div class="accordion-body">
        <div v-if="!userDetails" class="d-flex justify-content-center align-items-center">
          <div class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <table v-if="userDetails && userDetails.length > 0" class="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Proyecto</th>
              <th>Tarea</th>
              <th width="60%">Descripción</th>
              <th>Tiempo</th>
            </tr>
          </thead>
          <tbody>
            <time-entry-row
              v-for="timeEntry in userDetails"
              :key="'detailUser' + user.userId + '-' + timeEntry.id"
              :date="timeEntry.date"
              :client-name="timeEntry.project.client.name"
              :project-name="timeEntry.project.name"
              :task-type="timeEntry.taskType"
              :description="timeEntry.description"
              :hours="timeEntry.hours"
            />
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
import TimeEntryRow from './TimeEntryRow.vue'
import { USER_ROLES } from '@/constants/UserRoles'

export default {
  components: {
    'time-entry-row': TimeEntryRow
  },
  props: {
    user: {
      type: Object,
      required: true
    },
    userDetails: {
      type: Array,
      default: null
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  emits: ['showDetails', 'selectUser', 'deselectUser'],
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
    toggleUser() {
      if (this.selected) {
        this.$emit('deselectUser', this.user.userId)
      } else {
        this.$emit('selectUser', this.user.userId)
      }
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
