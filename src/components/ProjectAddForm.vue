<template>
  <div class="container">
    <div class="section-header-primary w-75" role="alert">Datos del proyecto</div>
    <div class="project-add-form w-75 mb-4">
      <form @submit.prevent="submitForm">
        <div class="mb-3 row">
          <label for="cliente" class="col-sm-2 col-form-label">Cliente</label>
          <div class="col-sm-10">
            <select id="cliente" class="form-select" required @change="updateData">
              <option value="none" disabled :selected="!projectEdit">Seleccione un cliente</option>
              <option
                v-for="option in clients"
                :key="option"
                :value="option.id"
                :selected="option.id === projectEdit?.client.id"
              >
                {{ option.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="mb-3 row">
          <label for="proyecto" class="col-sm-2 col-form-label">Nombre del proyecto</label>
          <div class="col-sm-10">
            <input
              id="proyecto"
              v-model="project.name"
              type="text"
              class="form-control"
              placeholder="Recaudaciones"
              required
              @input="updateData"
            />
          </div>
        </div>

        <div class="mb-3 row">
          <label for="horas" class="col-sm-2 col-form-label">Horas</label>
          <div class="col-sm-10">
            <div class="input-group">
              <input
                id="horas"
                v-model="project.monthlyContractedHours"
                type="number"
                class="form-control"
                min="0"
                required
                @change="updateData"
              />
              <span class="input-group-text">
                <input type="checkbox" />
                Contrato abierto
              </span>
            </div>
            <small class="form-text text-muted">Cantidad de horas contratadas por mes</small>
          </div>
        </div>

        <div class="mb-3 row">
          <label for="vigencia" class="col-sm-2 col-form-label">Vigencia</label>
          <div class="col-sm-10">
            <div class="row">
              <div class="col">
                <input
                  id="inicio"
                  v-model="project.startDate"
                  type="date"
                  class="form-control"
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
                  class="form-control"
                  placeholder="Hasta"
                  required
                  @change="updateData"
                />
              </div>
            </div>
            <small class="form-text text-muted">Inicio y fin del proyecto. Necesario para la funcionalidad de períodos.</small>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import ClientsService from '@/services/clients'
import ProjectsService from '@/services/projects'

export default {
  name: 'ProjectAddForm',
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
        cliente: '',
        name: '',
        monthlyContractedHours: 0,
        startDate: '',
        endDate: ''
      },
      projectsService: new ProjectsService(),
      clientsService: new ClientsService()
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
  watch: {
    selectedClientFromProject(newVal) {
      if (newVal) {
        this.selectedClient = newVal
      }
    },
    selectedClient(newVal) {
      const selectedOption = this.clients.find((client) => client.id === newVal)

      if (selectedOption) {
        this.project.idClient = selectedOption.id
        this.project.client.name = selectedOption.name
      }
    }
  },
  async mounted() {
    if (this.projectEdit) {
      this.project = this.projectEdit
      this.project.startDate = this.formatDate(this.project.startDate)
      this.project.endDate = this.project.endDate ? this.formatDate(this.project.endDate) : null
      this.project.createdAt = this.formatDate(this.project.createdAt)
      this.project.updatedAt = this.formatDate(this.project.updatedAt)
    }
    this.getClients()
  },
  methods: {
    async getClients() {
      try {
        const clientResponse = await this.clientsService.getAllClients()

        this.clients = clientResponse.data

        // // Si estoy editando un proyecto se establece el cliente seleccionado
        // if (this.projectEdit) {
        //   this.selectedClient = this.selectedClientFromProject
        // }
      } catch (err) {
        console.log('No se pueden recuparar los clientes: ', err)
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')

      return `${year}-${month}-${day}`
    },
    updateData() {
      this.$emit('update-data', this.project)
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
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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
</style>
