<template>
  <div>
    <div>
      <div class="d-flex flex-row border-bottom pe-3">
        <div class="col-3 fw-bold text-black">Usuario</div>
        <div class="col fw-bold text-black">Asignadas</div>
        <div class="col fw-bold text-black">Registradas</div>
        <div class="col fw-bold text-black">Semana 1</div>
        <div class="col fw-bold text-black">Semana 2</div>
        <div class="col fw-bold text-black">Semana 3</div>
        <div class="col fw-bold text-black">Semana 4</div>
        <div class="col fw-bold text-black">Semana 5</div>
      </div>
    </div>
    <div class="align-middle">
      <div id="userTable" class="accordion accordion-flush">
        <div v-for="user in users" :key="'user' + user.userId" class="accordion-item border-0 p-0">
          <div class="accordion-header">
            <button
              class="accordion-button collapsed p-0 pe-3 bg-white border-bottom"
              type="button"
              data-bs-toggle="collapse"
              :data-bs-target="`#collapse${user.userId}`"
              aria-expanded="false"
              :aria-controls="`collapse${user.userId}`"
              @click="showDetails(user)"
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
              <table class="table">
                <thead>
                  <tr>
                    <th>Proyecto</th>
                    <th>Tarea</th>
                    <th>Descripción</th>
                    <th>Tiempo</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- <tr v-for="(project, idx) in user.registeredHoursByWeek" :key="'detailUser' + user.userId + '-' + idx">
                    <td>{{ project.project.name }}</td>
                    <td>{{ project.task.name }}</td>
                    <td>{{ project.description }}</td>
                    <td>{{ project.totalHours }} hs</td>
                  </tr> -->
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="d-flex flex-row bg-white border-bottom pe-3">
        <div class="col-3 bg-white p-2-5">Total</div>
        <div class="col bg-white p-2-5">{{ totalAssignedHours }} hs</div>
        <div class="col bg-white p-2-5">{{ totalRegisteredHours }} hs</div>
        <div class="col bg-white p-2-5">{{ totalRegisteredHoursWeek1 }} hs</div>
        <div class="col bg-white p-2-5">{{ totalRegisteredHoursWeek2 }} hs</div>
        <div class="col bg-white p-2-5">{{ totalRegisteredHoursWeek3 }} hs</div>
        <div class="col bg-white p-2-5">{{ totalRegisteredHoursWeek4 }} hs</div>
        <div class="col bg-white p-2-5">{{ totalRegisteredHoursWeek5 }} hs</div>
      </div>
    </div>
  </div>
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
  emits: ['showDetails'],
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
  },
  methods: {
    showDetails(user) {
      this.$emit('showDetails', user.userId)
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
