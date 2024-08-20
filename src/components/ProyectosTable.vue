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
          <th scope="col">Acciones</th>
        </tr>
      </thead>
      <tbody class="align-middle">
        <tr v-for="(item, index) in projects" :key="index">
          <td>
            <a class="link pointer" @click="goToVerProyecto(index)">{{ item.name }}</a>
          </td>
          <td>{{ item.nameClient }}</td>
          <td>
            <div class="avatars">
              <template v-if="!item.idSquad">
                <!-- <i class="bi bi-person-circle avatar-fallback" :title="nombre"></i> -->
                Sin squad
              </template>
            </div>
          </td>
          <td>{{ item.monthlyContractedHours }}</td>
          <!-- <td>{{ item.asignadas }}</td> -->
          <td v-if="!item.idSquad">-</td>
          <td>{{ formatDate(item.updatedAt) }}</td>
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
  <Modal
    :is-visible="showModal"
    :title="title"
    :large="large"
    :is-editing="isEditing"
    :is-deleting="isDeleting"
    @close="
      () => {
        ;(showModal = false), (isDeleting = false), (isEnding = false), (isEditing = false), (large = false)
      }
    "
    @save="saveChanges"
    @delete="deleteOk"
  >
    <Eliminar v-if="isDeleting" :ente="ente" />
    <Finalizar v-if="isEnding" :ente="ente" />
    <div v-if="isEditing" class="modal-body-content">
      <ProjectAddForm :project-edit="projectEdit" @update-data="updateDataEdit" />
    </div>
  </Modal>
</template>

<script>
import ClientsService from '@/services/clients'
import Eliminar from '@/components/EliminarModal.vue'
import Finalizar from '@/components/FinalizarModal.vue'
import Modal from '@/components/shared/ModalModal.vue'
import ProjectAddForm from '@/components/ProjectAddForm.vue'
import ProjectsService from '@/services/projects'

export default {
  name: 'ProyectosTable',
  components: {
    Modal,
    Eliminar,
    Finalizar,
    ProjectAddForm
  },
  data() {
    return {
      projectsService: new ProjectsService(),
      clientsService: new ClientsService(),
      showModal: false,
      isDeleting: false,
      isEnding: false,
      title: '',
      ente: '',
      isEditing: false,
      large: false,
      projectId: null,
      projects: [],
      client: null,
      idProjectToDelete: null
    }
  },
  async mounted() {
    this.getProjects()
  },
  methods: {
    async getProjects() {
      try {
        // Obtengo todos los proyectos
        const response = await this.projectsService.getAllProjects()

        this.projects = response.data
        // Recorro el array de proyectos y obtengo el cliente de cada uno. Agrego la propiedad nameClient a cada proyecto.
        for (const project of this.projects) {
          try {
            const clientResponse = await this.clientsService.getClientById(project.idClient)
            const client = clientResponse.data

            project.nameClient = client.name
          } catch (err) {
            console.log('Error al recuperar el cliente del proyecto ', project.name, err)
          }
        }
      } catch (err) {
        console.log('Error al obtener los proyectos: ', err)
      }
    },
    async deleteProject(id) {
      this.showModal = true
      this.isDeleting = true
      this.title = 'Eliminar proyecto'
      this.ente = 'proyecto'
      this.idProjectToDelete = id
    },
    async deleteOk() {
      try {
        const response = await this.projectsService.deleteProject(this.idProjectToDelete)

        console.log(response)
        this.idProjectToDelete = null
        this.showModal = false
        this.isDeleting = false
        this.getProjects()
      } catch (err) {
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
      this.showModal = true
      this.isEditing = true
      this.title = 'Editar proyecto'
      this.large = true
      this.projectEdit = project
    },
    goToVerProyecto(id) {
      this.$router.push({ name: 'VerProyecto', params: { id } })
    },

    // initTooltips() {
    //   const tooltipTriggerList = [].slice.call(document.querySelectorAll('[title]'));
    //   tooltipTriggerList.map(function (tooltipTriggerEl) {
    //     return new bootstrap.Tooltip(tooltipTriggerEl);
    //   });
    // }
    updateDataEdit(updatedProject) {
      console.log('updateDataEdit called in parent with:', updatedProject)
      this.project = { ...this.project, ...updatedProject }
      console.log(this.project)
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')

      return `${year}-${month}-${day}`
    },
    async saveChanges() {
      if (this.isEditing) {
        try {
          const response = await this.projectsService.updateProject(this.project.id, {
            name: this.project.name,
            monthlyContractedHours: this.project.monthlyContractedHours,
            startDate: this.project.startDate,
            endDate: this.project.endDate,
            idClient: this.project.idClient,
            idSquad: this.project.idSquad
          })

          console.log(response)
          this.getProjects()
          this.showModal = false
        } catch (err) {
          console.log('Error al editar proyecto: ', err)
        }
        this.isEditing = false
        this.large = false
      }
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
</style>
