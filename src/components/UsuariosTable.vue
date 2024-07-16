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
      <tbody class="table-group-divider align-middle">
        <tr v-for="(user, index) in users" :key="index">
          <td>
            <div class="avatar-container">
              <i class="bi bi-person-circle avatar-fallback" :title="user.nombre"></i>
            </div>
          </td>
          <td>{{ user.nombre }}</td>
          <td>{{ user.horasAsignadas }}</td>
          <td>{{ user.horasContratadas }}</td>
          <td>{{ user.horasLibres }}</td>
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
export default {
  name: 'UsuariosTable',
  data() {
    return {
      users: [
        {
          nombre: 'Rodrigo Loza',
          horasAsignadas: '140',
          horasContratadas: '160',
          horasLibres: '20'
        },
        {
          nombre: 'Agustin Menegat',
          horasAsignadas: '120',
          horasContratadas: '160',
          horasLibres: '40'
        },
        {
          nombre: 'Yanina Silva',
          horasAsignadas: '100',
          horasContratadas: '160',
          horasLibres: '60'
        },
        {
          nombre: 'Joaquin Zanardi',
          horasAsignadas: '130',
          horasContratadas: '160',
          horasLibres: '30'
        },
        {
          nombre: 'Mariano Soulé',
          horasAsignadas: '110',
          horasContratadas: '160',
          horasLibres: '50'
        },
        {
          nombre: 'Norelys Rodriguez',
          horasAsignadas: '140',
          horasContratadas: '160',
          horasLibres: '20'
        },
        {
          nombre: 'Yoana Gerling',
          horasAsignadas: '120',
          horasContratadas: '160',
          horasLibres: '40'
        },
        {
          nombre: 'Maurizio Volpe',
          horasAsignadas: '150',
          horasContratadas: '160',
          horasLibres: '10'
        },
        {
          nombre: 'Patricio Sabatini',
          horasAsignadas: '130',
          horasContratadas: '160',
          horasLibres: '30'
        }
      ]
    }
  },
  mounted() {
    // this.initTooltips()
  },
  updated() {
    // this.initTooltips()
  }
  /* methods: {
    initTooltips() {
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[title]'));
      tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
      });
    }
  } */
}
</script>

<style scoped>
/* Estilo de botones de tabla */
button.btn.btn-link.btn-m {
  --bs-btn-padding-x: 0.2rem;
  --bs-btn-padding-y: 0;
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
