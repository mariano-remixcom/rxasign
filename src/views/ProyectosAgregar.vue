<template>
  <div id="app" class="container">
    <div class="pb-4 mb-4 page-title-separation">
      <div class="container d-flex justify-content-between">
        <div class="d-flex align-items-center justify-content-between">
          <div class="me-auto">
            <h1 class="h3 mb-0 fw-semibold">Agregar proyecto</h1>
          </div>
        </div>
        <!-- Acciones inicio -->
        <div class="d-flex gap-2">
          <router-link to="/">
            <button class="btn btn-soft-primary">Cancelar</button>
          </router-link>
          <button class="btn btn-primary" @click="submitForm">Guardar</button>
        </div>
        <!-- Acciones fin -->
      </div>
    </div>
    <div>
      <div class="d-flex flex-column">
        <ProjectAddForm ref="projectAddForm" @update-data="onUpdateDataProject" @add-project="addProject" />
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
    submitForm() {
      if (this.teamMembers.length !== 0) {
        this.$refs.projectAddForm.submitForm()
        this.$refs.projectAddTeam.submitForm()
      } else {
        this.$refs.projectAddForm.submitForm()
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
          state: this.project.state
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
      console.log(this.project, 'project')
    },
    onUpdateDataTeam(updatedTeam) {
      this.teamMembers = updatedTeam
      console.log(this.teamMembers, 'team members')
    }
  }
}
</script>
