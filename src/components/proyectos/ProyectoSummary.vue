<template v-if="!!proyecto">
  <div class="section-header-primary">Proyecto</div>
  <div class="px-3 py-1 row">
    <!-- Columna 1 -->
    <div class="col-12 col-md">
      <field-with-label label="Cliente" :value="proyecto.client.name" />
      <field-with-label label="Proyecto" :value="proyecto.name" />
      <field-with-label
        class="small-text"
        label="Cantidad de horas contratadas por mes"
        :value="`${proyecto.monthlyContractedHours} hs`"
      />
      <div v-if="proyecto.key" class="key-container">
        <i class="bi bi-key-fill"></i>
        <p>Llave en mano</p>
      </div>
      <field-with-label label="Estado" />
      <project-state :state-key="proyecto.currentState.currentState" />
    </div>

    <!-- Columna 2 -->
    <div class="col-12 col-md">
      <field-with-label label="Período actual" :value="capitalizeFirstLetter(formatDate(new Date(), 'monthAndYear'))" />
      <field-with-label
        label="Inicio"
        :value="formatDate(proyecto.startDate)"
        :helper="`Hace ${daysSinceStartOfProject} días`"
      />
      <field-with-label
        v-if="!!proyecto.endDate"
        label="Fin"
        :value="formatDate(proyecto.endDate)"
        :helper="`Faltan ${daysUntilProjectEnds} días`"
      />
      <field-with-label v-else label="Fin" value="A definir" />
    </div>

    <!-- Columna 3 (botones y fecha de actualización) -->
    <div class="col-12 col-md-2">
      <div class="d-flex flex-column">
        <div class="d-flex justify-content-end">
          <button class="btn btn-soft-primary mb-1" @click="editProject">Editar</button>
        </div>
        <div class="d-flex flex-row justify-content-end text-muted mt-1">
          <i class="bi bi-arrow-repeat"></i>
          <div class="ms-1">{{ formatDate(proyecto.updatedAt, 'dateAndTime') }}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Toast -->
  <div
    v-if="showToast"
    class="toast align-items-center text-bg-primary border-0 position-fixed bottom-0 start-0 m-3 show"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
  >
    <div class="d-flex">
      <div class="toast-body">{{ toastContent }}</div>
      <button
        type="button"
        class="btn-close btn-close-white me-2 m-auto"
        aria-label="Close"
        @click="showToast = false"
      ></button>
    </div>
  </div>

  <!-- Modal de edición -->
  <EditModal
    :is-visible="showModal"
    :large="large"
    :project-edit="projectEdit"
    @updateDataEdit="updateDataEdit"
    @close="
      () => {
        ;(showModal = false), (large = false)
      }
    "
    @save="saveChanges"
  />
</template>

<script>
import EditModal from '@/components/proyectos/EditProjectModal.vue'
import FieldWithLabel from './FieldWithLabel.vue'
import FormatDate from '@/mixins/formatting-text/FormatDate.vue'
import ProjectState from '@/components/proyectos/ProjectState.vue'
import ProjectsService from '@/services/projects'
import moment from 'moment'

export default {
  components: {
    FieldWithLabel,
    EditModal,
    ProjectState
  },
  mixins: [FormatDate],
  props: {
    proyecto: {
      type: Object,
      required: true
    }
  },
  emits: ['fetch-project'],
  data() {
    return {
      projectsService: new ProjectsService(),
      showModal: false,
      large: false,
      editForm: {
        id: 0,
        idClient: '',
        name: '',
        monthlyContractedHours: 0,
        startDate: '',
        endDate: ''
      },
      toastContent: '',
      showToast: false,
      projectEdit: {}
    }
  },
  computed: {
    daysSinceStartOfProject: function () {
      return moment().diff(moment(this.proyecto.startDate), 'days')
    },
    daysUntilProjectEnds: function () {
      return moment(this.proyecto.endDate).diff(moment(), 'days')
    }
  },
  methods: {
    capitalizeFirstLetter: function (value) {
      // console.log(this.proyecto)

      return value.charAt(0).toUpperCase() + value.slice(1)
    },
    // finishProject() {
    //   this.showModal = true
    //   this.isEnding = true
    //   this.title = 'Finalizar proyecto'
    //   this.ente = 'proyecto'
    // },
    editProject() {
      this.showModal = true
      this.large = true
      this.projectEdit = this.proyecto
    },
    updateDataEdit(updatedProject) {
      this.editForm = updatedProject
    },
    async saveChanges() {
      try {
        await new ProjectsService().updateProject(this.editForm.id, {
          name: this.editForm.name,
          monthlyContractedHours: this.editForm.monthlyContractedHours,
          startDate: new Date(this.editForm.startDate),
          endDate: this.editForm.endDate ? new Date(this.editForm.endDate) : null,
          idClient: this.editForm.idClient,
          state: this.editForm.state
        })

        this.showModal = false
        this.showToast = true
        // console.log(this.showToast)
        this.$emit('fetch-project', this.editForm.id)
        this.toastContent = 'Los cambios se guardaron exitosamente'
        setTimeout(() => {
          this.showToast = false
        }, 3000) // Oculta el toast después de 3 segundos
      } catch (err) {
        this.showToast = true
        this.toastContent = 'Se produjo un error al intentar editar el proyecto'
        setTimeout(() => {
          this.showToast = false
        }, 3000)
        console.log('Error al editar proyecto: ', err)
      }
      this.large = false
    }
  }
}
</script>
<style scoped>
/* Asegura que los botones ocupen todo el ancho en pantallas pequeñas */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  /* Para las columnas, aseguramos que ocupen todo el ancho en pantallas pequeñas */
  .col-12 {
    width: 100%;
  }

  /* Ajusta la visualización del contenedor de llave en mano */
  .key-container {
    margin-top: 1rem;
  }

  /* Asegura que los botones ocupen el 100% del ancho en pantallas pequeñas */
  .btn {
    width: 100%;
  }

  /* Establece los márgenes para las columnas en pantallas pequeñas */
  .row {
    margin-left: 0;
    margin-right: 0;
  }
}
</style>
