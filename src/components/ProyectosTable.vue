<template>
  <div class="container wmt-4">
    <table class="table">
      <thead class="table-light">
        <tr>
          <th scope="col">Nombre</th>
          <th scope="col">Cliente</th>
          <th scope="col">Integrantes</th>
          <th scope="col">Contrato</th>
          <th scope="col">Asignadas</th>
          <th scope="col">Modificado</th>
          <th scope="col">Estado</th>
          <th scope="col">Acciones</th>
        </tr>
      </thead>
      <tbody class="align-middle">
        <tr v-for="item in projects" :key="item.id">
          <td>
            <a class="link pointer" @click="goToVerProyecto(item.id)">{{ item.name }}</a>
          </td>
          <td>{{ item.client.name }}</td>
          <td>
            <div class="avatars">
              <template v-if="!Array.isArray(item.squad.resources) || item.squad.resources.length === 0"> Sin squad </template>
              <template v-else>
                <div v-for="(resource, index) in item.squad.resources" :key="index" class="tooltip-wrapper">
                  <i class="bi bi-person-circle avatar-fallback"></i>
                  <span class="tooltip">{{ resource.user.fullName }}</span>
                </div>
              </template>
            </div>
          </td>
          <td>{{ item.monthlyContractedHours }} hs</td>
          <td v-if="item.squad._count.resources !== 0">{{ item.totalAsignedHours }} hs</td>
          <td v-else>-</td>
          <td>{{ formatDate(item.updatedAt) }}</td>
          <td><project-state :state-key="item.currentState.currentState" /></td>
          <td>
            <button class="btn btn-link btn-m"><i class="bi bi-clipboard-data"></i></button>
            <button class="btn btn-link btn-m" @click="finishProject"><i class="bi bi-check-circle"></i></button>
            <button class="btn btn-link btn-m" @click="editProject(item)"><i class="bi bi-pencil-square"></i></button>
            <button class="btn btn-link btn-m" @click="deleteProject(item.id)"><i class="bi bi-trash"></i></button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <EditModal
    :is-visible="showModalEdit"
    :large="large"
    :project-edit="projectEdit"
    @updateDataEdit="updateDataEdit"
    @close="
      () => {
        ;(showModalEdit = false), (large = false)
      }
    "
    @save="saveChanges"
  />
  <DeleteModal
    :is-visible="showModalDelete"
    message="¿Estás seguro que deseas eliminar este proyecto?"
    @close="
      () => {
        showModalDelete = false
      }
    "
    @delete="deleteOk"
  />
</template>

<script>
import ClientsService from '@/services/clients'
import DeleteModal from '@/components/shared/DeleteModal.vue'
import EditModal from '@/components/proyectos/EditProjectModal.vue'
import FormatDate from '@/mixins/formatting-text/FormatDate.vue'
import ProjectsService from '@/services/projects'
import ResourcesService from '@/services/resources'
import { useToaster } from '@/helpers/alerts/toasts/useToaster'

export default {
  name: 'ProyectosTable',
  components: {
    EditModal,
    DeleteModal
  },
  mixins: [FormatDate],
  data() {
    return {
      projectsService: new ProjectsService(),
      clientsService: new ClientsService(),
      resourcesService: new ResourcesService(),
      title: '',
      large: false,
      projectId: null,
      projects: [],
      client: null,
      idProjectToDelete: null,
      projectEdit: {},
      showModalEdit: false,
      showModalDelete: false
    }
  },
  async mounted() {
    this.getProjects()
  },
  methods: {
    async getProjects() {
      try {
        const response = await this.projectsService.getAllProjects()

        this.projects = response.data
        console.log(this.projects)
      } catch (err) {
        console.log('Error al obtener los proyectos: ', err)
      }
    },
    async deleteProject(id) {
      this.showModalDelete = true
      this.idProjectToDelete = id
    },
    showSuccessToast(message) {
      const { addToast } = useToaster()

      addToast(message, 'success')
    },
    showErrorToast(message) {
      const { addToast } = useToaster()

      addToast(message, 'danger')
    },
    async deleteOk() {
      try {
        const response = await this.projectsService.deleteProject(this.idProjectToDelete)

        console.log(response)
        this.idProjectToDelete = null
        this.showModalDelete = false
        this.getProjects()
        this.showSuccessToast('El proyecto se eliminó exitosamente')
      } catch (err) {
        this.showErrorToast('Se produjo un error al intentar eliminar el proyecto')

        console.log('Error al eliminar proyecto: ', err)
      }
    },
    finishProject() {
      this.showModal = true
      this.isEnding = true
      this.title = 'Finalizar proyecto'
      this.ente = 'proyecto'
    },
    editProject(project) {
      this.showModalEdit = true
      this.large = true
      this.projectEdit = project
    },
    goToVerProyecto(id) {
      this.$router.push({ name: 'VerProyecto', params: { id } })
    },
    updateDataEdit(updatedProject) {
      this.project = updatedProject
      console.log(this.project)
    },
    async saveChanges() {
      if (this.isEditing) {
        try {
          const response = await this.projectsService.updateProject(this.project.id, {
            name: this.project.name,
            monthlyContractedHours: this.project.monthlyContractedHours,
            startDate: new Date(this.project.startDate),
            endDate: this.project.endDate ? new Date(this.project.endDate) : null,
            idClient: this.project.idClient,
            state: this.project.state
          })

          console.log(response)
          this.getProjects()
          this.showModalEdit = false
          this.showSuccessToast('Los cambios se guardaron exitosamente')
        } catch (err) {
          this.showErrorToast('Se produjo un error al intentar editar el proyecto')
          console.log('Error al editar proyecto: ', err)
        }
        this.large = false
      }
      // }
    }
  }
}
</script>

<style scoped lang="scss">
.pointer {
  color: $blue;
  cursor: pointer;
}
/* fix botones de tabla */
button.btn.btn-link.btn-m {
  --bs-btn-padding-x: 0.2rem;
  --bs-btn-padding-y: 0;
  color: $blue;
}

/* avatares */
.avatars {
  display: flex;
}

.avatar,
.avatar-fallback {
  width: 24px;
  height: 24px;
  font-size: 24px;
  border-radius: 50%;
  margin-right: 4px;
  /* Espacio entre avatares */
}

.avatar:last-child,
.avatar-fallback:last-child {
  margin-right: 0;
  /* Eliminar margen derecho del último avatar */
}
.toast {
  z-index: 1050;
  bottom: 0;
  left: 0;
  position: fixed;
  margin: 1rem;
}
.tooltip-wrapper {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.tooltip {
  visibility: hidden;
  background-color: #6c757d; /* Color gris más claro */
  color: #fff;
  text-align: center;
  border-radius: 4px; /* Redondez más sutil */
  padding: 4px 8px; /* Ajuste del padding para un tamaño más compacto */
  position: absolute;
  z-index: 1;
  bottom: 95%; /* Ajuste fino para acercar el tooltip */
  left: 50%;
  transform: translateX(-50%); /* Centra el tooltip */
  width: auto; /* Ajusta el tamaño automáticamente */
  white-space: nowrap; /* Evita que el texto se rompa en varias líneas */
  opacity: 0;
  transition: opacity 0.3s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* Sombra más ligera */
  margin-bottom: 2px; /* Espacio mínimo entre el tooltip y el icono */
}

.tooltip-wrapper:hover .tooltip {
  visibility: visible;
  opacity: 1;
}
</style>
