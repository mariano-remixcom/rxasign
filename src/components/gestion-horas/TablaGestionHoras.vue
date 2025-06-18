<template>
  <div>
    <div class="d-flex flex-row w-100 border-bottom">
      <div class="px-2">
        <input v-model="selectAll" :disabled="loadingUsers" type="checkbox" @click="onClickSelectAll" />
      </div>
      <div class="d-flex flex-row w-100 padding-header-footer-right">
        <div class="col-6 col-lg-3 fw-bold text-black px-2-5">Usuario</div>
        <div class="col-3 col-lg fw-bold text-black px-2-5">Asignadas</div>
        <div class="col-3 col-lg fw-bold text-black px-2-5">Registradas</div>
        <div class="d-none d-lg-flex col fw-bold text-black px-2-5">Semana 1</div>
        <div class="d-none d-lg-flex col fw-bold text-black px-2-5">Semana 2</div>
        <div class="d-none d-lg-flex col fw-bold text-black px-2-5">Semana 3</div>
        <div class="d-none d-lg-flex col fw-bold text-black px-2-5">Semana 4</div>
        <div class="d-none d-lg-flex col fw-bold text-black px-2-5">Semana 5</div>
      </div>
    </div>
    <div v-if="!loadingUsers" class="align-middle">
      <div id="userTable" class="accordion accordion-flush">
        <UserAccordion
          v-for="user in users"
          :key="'user' + user.userId"
          :user="user"
          :selected="selectedUsers.includes(user.userId)"
          :user-details="usersDetails ? usersDetails[user.userId] : null"
          @show-details="showDetails"
          @select-user="onSelectUser"
          @deselect-user="onDeselectUser"
        />
      </div>
      <div
        v-if="!loadingUsers"
        class="d-flex flex-row bg-white border-bottom padding-header-footer-right padding-header-footer-left"
      >
        <div class="col-6 col-lg-3 bg-white p-2-5">Total</div>
        <div class="col-3 col-lg bg-white p-2-5">{{ totalAssignedHours }} hs</div>
        <div class="col-3 col-lg bg-white p-2-5">{{ totalRegisteredHours }} hs</div>
        <div class="d-none d-lg-flex col bg-white p-2-5">{{ totalRegisteredHoursWeek1 }} hs</div>
        <div class="d-none d-lg-flex col bg-white p-2-5">{{ totalRegisteredHoursWeek2 }} hs</div>
        <div class="d-none d-lg-flex col bg-white p-2-5">{{ totalRegisteredHoursWeek3 }} hs</div>
        <div class="d-none d-lg-flex col bg-white p-2-5">{{ totalRegisteredHoursWeek4 }} hs</div>
        <div class="d-none d-lg-flex col bg-white p-2-5">{{ totalRegisteredHoursWeek5 }} hs</div>
      </div>
    </div>
    <div v-if="loadingUsers" class="d-flex justify-content-center align-items-center m-2">
      <div class="spinner-border text-primary" role="status" style="width: 1.5rem; height: 1.5rem">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script>
import UserAccordion from './shared/UserAccordion.vue'

export default {
  components: {
    UserAccordion
  },
  props: {
    loadingUsers: {
      type: Boolean,
      required: true
    },
    users: {
      type: Array,
      required: true
    },
    usersDetails: {
      type: Object,
      required: true
    },
    selectedUsers: {
      type: Array,
      required: true
    }
  },
  emits: ['showDetails', 'selectAll', 'deselectAll', 'selectUser', 'deselectUser'],
  data() {
    return {
      selectAll: false
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
  watch: {
    selectedUsers: {
      handler(newValue) {
        this.selectAll = newValue.length === this.users.length
      },
      deep: true
    }
  },
  methods: {
    showDetails(userId) {
      this.$emit('showDetails', userId)
    },
    onClickSelectAll() {
      if (!this.selectAll) {
        this.$emit('selectAll')
      } else {
        this.$emit('deselectAll')
      }
    },
    onSelectUser(userId) {
      this.$emit('selectUser', userId)
    },
    onDeselectUser(userId) {
      this.$emit('deselectUser', userId)
    }
  }
}
</script>
<style scoped>
.padding-header-footer-right {
  padding-right: calc(1rem + 20px);
}
.padding-header-footer-left {
  padding-left: calc(14px + 1rem);
}
.p-2-5 {
  padding: 0.75rem !important;
}

.px-2-5 {
  padding-left: 0.75rem !important;
  padding-right: 0.75rem !important;
}
</style>
