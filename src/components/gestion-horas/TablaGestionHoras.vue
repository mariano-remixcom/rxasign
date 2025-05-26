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
      <UserAccordion
        v-for="user in users"
        :key="'user' + user.userId"
        :user="user"
        :user-details="usersDetails ? usersDetails[user.userId] : null"
        @show-details="showDetails"
      />
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
import UserAccordion from './shared/UserAccordion.vue'

export default {
  components: {
    UserAccordion
  },
  props: {
    users: {
      type: Array,
      required: true
    },
    usersDetails: {
      type: Object,
      required: true
    }
  },
  emits: ['showDetails'],
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
    showDetails(userId) {
      this.$emit('showDetails', userId)
    }
  }
}
</script>
<style scoped>
.p-2-5 {
  padding: 0.75rem !important;
}
</style>
