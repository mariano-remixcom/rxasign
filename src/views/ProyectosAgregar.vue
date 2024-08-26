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
          <button class="btn btn-primary" @click="addProject">Guardar</button>
        </div>
        <!-- Acciones fin -->
      </div>
    </div>
    <div>
      <div class="d-flex flex-column">
        <ProjectAddForm @update-data="onUpdateData" />
        <ProjectAddTeam />
      </div>
    </div>
  </div>
</template>

<script>
import ProjectAddForm from '@/components/ProjectAddForm.vue'
import ProjectAddTeam from '@/components/ProjectAddTeam.vue'
import ProjectsService from '@/services/projects'

export default {
  name: 'AddProject',
  components: {
    ProjectAddForm,
    ProjectAddTeam
  },
  data() {
    return {
      project: null
    }
  },
  methods: {
    async addProject() {
      try {
        const response = await new ProjectsService().createProject({
          name: this.project.name,
          monthlyContractedHours: this.project.monthlyContractedHours,
          startDate: new Date(this.project.startDate),
          endDate: this.project.endDate ? new Date(this.project.endDate) : null,
          idClient: this.project.idClient
        })

        if (response) {
          console.log(response)
        }
      } catch (error) {
        console.log(error)
      }
    },
    onUpdateData(updatedProject) {
      this.project = updatedProject
    }
  }
}
</script>
