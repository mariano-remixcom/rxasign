<template>
  <div class="section-header-primary w-75" role="alert">Integrantes del equipo</div>
  <div class="wmt-4 container w-75 mb-4">
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
            <select v-model="member.name" class="form-select">
              <option v-for="name in names" :key="name" :value="name">{{ name }}</option>
            </select>
          </td>
          <td>
            <select v-model="member.role" class="form-select">
              <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
            </select>
          </td>
          <td>{{ member.hoursAvailable - member.hoursAssigned }} hs</td>
          <td>
            <input v-model="member.hoursAssigned" type="number" class="form-control" min="0" :max="member.hoursAvailable" />
          </td>
          <td>
            <button class="btn btn-link btn-m" @click="removeMember(index)"><i class="bi bi-trash"></i></button>
          </td>
        </tr>
      </tbody>
    </table>
    <button class="btn btn-outline-primary" @click="addMember">Agregar Integrante</button>
  </div>
</template>

<script>
import bootstrap from '@/config/bootstrap'

export default {
  name: 'ProjectAddTeam',
  data() {
    return {
      names: [
        'Rodrigo Loza',
        'Agustin Menegat',
        'Joaquin Zanardi',
        'Matias Berthelot',
        'Yanina Silva',
        'Mariano Soulé',
        'Yoana Gerling',
        'Patricio Sabatini'
      ],
      roles: ['Desarrollador', 'Diseñador', 'Gerente de Proyecto', 'QA'],
      teamMembers: [
        {
          name: 'Rodrigo Loza',
          role: 'Desarrollador',
          hoursAvailable: 160,
          hoursAssigned: 140
        },
        {
          name: 'Agustin Menegat',
          role: 'Diseñador',
          hoursAvailable: 160,
          hoursAssigned: 130
        },
        {
          name: 'Joaquin Zanardi',
          role: 'Gerente de Proyecto',
          hoursAvailable: 160,
          hoursAssigned: 120
        }
      ]
    }
  },
  mounted() {
    this.initTooltips()
  },
  updated() {
    this.initTooltips()
  },
  methods: {
    addMember() {
      this.teamMembers.push({
        name: '',
        role: '',
        hoursAvailable: 160, // Horas disponibles por defecto
        hoursAssigned: 0
      })
    },
    initTooltips() {
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[title]'))

      tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
      })
    },
    removeMember(index) {
      this.teamMembers.splice(index, 1)
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
