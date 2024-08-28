<template>
  <div class="mb-4 rounded-3">
    <div class="container d-flex align-items-center justify-content-between page-title-separation">
      <div class="container-fluid">
        <h1 class="h3 fw-semibold">Proyectos</h1>
        <p>Lista de proyectos por cliente con su equipo.</p>
      </div>
      <!-- Acciones inicio -->
      <div class="d-flex gap-2">
        <router-link to="/proyectos/agregar">
          <button class="btn btn-primary btn-lg">Nuevo</button>
        </router-link>
      </div>
      <!-- Acciones fin -->
    </div>
  </div>
  <div id="app">
    <ProyectosTable />
  </div>
</template>

<script>
import ProyectosTable from '@/components/ProyectosTable.vue'
import { useToaster } from '@/composables/useToaster'

export default {
  name: 'App',
  components: {
    ProyectosTable
  },
  created() {
    const { addToast } = useToaster()

    if (this.$route.params.status === 'success') {
      addToast('El nuevo proyecto se creó correctamente.', 'success')
    }

    this.$watch(
      () => this.$route.params.status,
      async (status) => {
        if (status === 'success') {
          addToast('El nuevo proyecto se creó correctamente.', 'success')
        }
      }
    )
  }
}
</script>
