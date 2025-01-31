<template>
  <div id="app" class="container">
    <!-- Título y Acciones -->
    <div class="pb-4 mb-4 page-title-separation">
      <div class="container d-flex justify-content-between align-items-center">
        <!-- Título -->
        <div class="me-auto">
          <h1 class="h3 mb-0 fw-semibold">Agregar proyecto</h1>
        </div>

        <!-- Acciones -->
        <div class="d-flex gap-2">
          <router-link to="/">
            <button class="btn btn-soft-primary w-100 w-sm-auto">Cancelar</button>
          </router-link>
          <button class="btn btn-primary w-100 w-sm-auto" @click="submitForm">Guardar</button>
        </div>
      </div>
    </div>

    <!-- Formularios -->
    <div>
      <div class="d-flex flex-column gap-4">
        <ProjectAddForm ref="projectAddForm" @update-data="onUpdateDataProject" />
        <ProjectAddTeam ref="projectAddTeam" @update-data="onUpdateDataTeam" />
      </div>
    </div>
  </div>
</template>

<script>
import ProjectAddForm from '@/components/ProjectAddForm.vue'
import ProjectAddTeam from '@/components/ProjectAddTeam.vue'
import ProjectsService from '@/services/projects'
import { useToaster } from '@/helpers/alerts/toasts/useToaster'

export default {
  name: 'AddProject',
  components: {
    ProjectAddForm,
    ProjectAddTeam
  },
  data() {
    return {
      project: null,
      teamMembers: []
    }
  },
  methods: {
    async submitForm() {
      const formProject = this.$refs.projectAddForm
      const formTeam = this.$refs.projectAddTeam

      const formProjectValid = await formProject.submitForm()
      const formTeamValid = await formTeam.submitForm()

      if (formProjectValid && formTeamValid) {
        this.addProject()
      }
    },

    async addProject() {
      try {
        const response = await new ProjectsService().createProject({
          name: this.project.name,
          monthlyContractedHours: this.project.monthlyContractedHours,
          startDate: new Date(this.project.startDate),
          endDate: this.project.endDate ? new Date(this.project.endDate) : null,
          idClient: this.project.idClient,
          teamMembers: this.teamMembers,
          state: this.project.state,
          key: this.project.key
        })

        if (response.status === 201) {
          this.$router.push({ name: 'Proyectos', params: { status: 'success' } })
        }
      } catch (error) {
        const { addToast } = useToaster()

        addToast('Error al crear el proyecto.', 'danger')
      }
    },
    onUpdateDataProject(updatedProject) {
      this.project = updatedProject
      // console.log(this.project, 'project')
    },
    onUpdateDataTeam(updatedTeam) {
      this.teamMembers = updatedTeam
      // console.log(this.teamMembers, 'team members')
    }
  }
}
</script>

<style scoped>
/* Ajustes de espaciado */
.page-title-separation {
  padding-top: 1rem;
}

/* Ajustes en pantallas pequeñas */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .page-title-separation {
    text-align: left;
  }

  .d-flex.gap-2 {
    gap: 1rem; /* Espacio entre los botones */
  }

  /* Asegura que los botones se alineen correctamente */
  .btn {
    width: 100%; /* Los botones ocupan el 100% del ancho en pantallas pequeñas */
  }

  /* Alinea los botones horizontalmente con la misma dimensión en pantallas pequeñas */
  .w-sm-auto {
    width: auto !important; /* Los botones tienen el mismo tamaño en pantallas grandes */
  }
}
</style>
