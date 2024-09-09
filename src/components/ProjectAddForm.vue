<template>
  <div class="container">
    <div class="section-header-primary mb-0" role="alert">Datos del proyecto</div>
    <div class="project-add-form">
      <form @submit.prevent="submitForm">
        <div class="mb-3 d-flex flex-row row">
          <div class="d-flex flex-column col-4">
            <label for="cliente" class="h6 mb-0">Cliente</label>
            <small>Seleccione un cliente</small>
          </div>
          <div class="col">
            <select id="cliente" v-model="project.idClient" class="form-select" required @change="updateData">
              <option value="none" disabled :selected="!project">Seleccione un cliente</option>
              <option v-for="option in clients" :key="option" :value="option.id" :selected="option.id === project?.idClient">
                {{ option.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="mb-3 d-flex flex-row row">
          <div class="d-flex flex-column col-4">
            <label for="proyecto" class="h6 mb-0">Nombre del proyecto</label>
            <small>Ingrese el nombre del proyecto</small>
          </div>
          <div class="col">
            <input
              id="proyecto"
              v-model="project.name"
              type="text"
              class="form-control bg-white"
              required
              @input="updateData"
            />
          </div>
        </div>

        <div class="mb-3 d-flex flex-row row">
          <div class="d-flex flex-column col-4">
            <label for="horas" class="h6 mb-0">Horas</label>
            <small>Cantidad de horas contratadas por mes</small>
          </div>
          <div class="col">
            <div class="input-group">
              <input
                id="horas"
                v-model="project.monthlyContractedHours"
                type="number"
                class="form-control bg-white"
                min="0"
                required
                @change="updateData"
              />
              <span class="input-group-text">
                <input type="checkbox" class="me-1" />
                Contrato abierto
              </span>
            </div>
          </div>
        </div>

        <div class="mb-3 d-flex flex-row row">
          <div class="d-flex flex-column col-4">
            <label for="vigencia" class="h6 mb-0">Vigencia</label>
            <small>Inicio y fin del proyecto. Necesario para la funcionalidad de períodos.</small>
          </div>
          <div class="col">
            <div class="row">
              <div class="col">
                <input
                  id="inicio"
                  v-model="project.startDate"
                  type="date"
                  class="form-control bg-white"
                  placeholder="Desde"
                  required
                  @change="updateData"
                />
              </div>
              <div class="col">
                <input
                  id="fin"
                  v-model="project.endDate"
                  type="date"
                  class="form-control bg-white"
                  placeholder="Hasta"
                  required
                  @change="updateData"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="mb-3 d-flex flex-row row">
          <div class="d-flex flex-column col-4">
            <label for="estado" class="h6 mb-0">Estado</label>
            <small>Estado actual del proyecto.</small>
          </div>
          <div class="col">
            <div class="row">
              <div class="col">
                <select id="state" v-model="project.state" class="form-select" required @change="updateData">
                  <option
                    v-for="state in estados"
                    :key="state.key"
                    :value="state.key"
                    :selected="state.key === project.state"
                    data-icon="bi bi-check-circle-fill"
                  >
                    <project-state :state-key="state.key" />
                  </option>
                </select>
              </div>
              <div class="col"></div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import ClientsService from '@/services/clients'
import ProjectState from './proyectos/ProjectState.vue'
import ProjectsService from '@/services/projects'
import moment from 'moment'
import { PROJECT_STATES } from '@/constants/ProjectStates'

export default {
  name: 'ProjectAddForm',
  components: {
    ProjectState
  },
  props: {
    projectEdit: {
      type: Object,
      default: null
    }
  },
  emits: ['update-data'],
  data() {
    return {
      idClient: '',
      contratoAbierto: false,
      clients: [],
      selectedClient: '',
      project: {
        id: 0,
        idClient: '',
        name: '',
        monthlyContractedHours: 0,
        startDate: '',
        endDate: '',
        state: 'Draft'
      },
      projectsService: new ProjectsService(),
      clientsService: new ClientsService(),
      estados: PROJECT_STATES
    }
  },
  computed: {
    // Si estoy editando un proyecto busca el cliente correspondiente
    selectedClientFromProject() {
      if (this.projectEdit && this.projectEdit.client.name && this.clients.length > 0) {
        const client = this.clients.find((c) => c.name === this.projectEdit.client.name)

        return client ? client.id : ''
      }

      return ''
    }
  },
  async mounted() {
    if (this.projectEdit) {
      this.project.id = this.projectEdit.id
      this.project.name = this.projectEdit.name
      this.project.monthlyContractedHours = this.projectEdit.monthlyContractedHours
      this.project.idClient = this.projectEdit.client.id
      this.project.startDate = this.formatDate(this.projectEdit.startDate)
      this.project.endDate = this.projectEdit.endDate ? this.formatDate(this.projectEdit.endDate) : null
      this.project.state = this.projectEdit.stateHistory.at(-1).currentState
    } else {
      this.estados = PROJECT_STATES.filter((estado) => estado.isInitialState)
    }
    this.getClients()
  },
  methods: {
    // TODO: agregar toasts de error y success
    // TODO: agregar redireccion a proyectos
    async getClients() {
      try {
        const clientResponse = await this.clientsService.getAllClients()

        this.clients = clientResponse.data
      } catch (err) {
        console.log('No se pueden recuparar los clientes: ', err)
      }
    },
    formatDate(date) {
      return moment(date).format('YYYY-MM-DD')
    },
    updateData() {
      this.$emit('update-data', this.project)
      console.log(this.project)
    }
    // submitForm() {
    //   // Emitir el formulario completo al componente padre
    //   this.$emit('submit', this.form)
    // }
  }
}
</script>

<style scoped>
.project-add-form {
  padding: 18px 10px;
  border-radius: 8px;
  margin: 0 auto; /* Centra el formulario horizontalmente */
  width: 100%;
}
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
}
small {
  color: var(--bs-gray-500);
}
</style>
