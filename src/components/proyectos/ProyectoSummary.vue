<template v-if="!!proyecto">
  <div class="section-header-primary">Proyecto</div>
  <div class="px-3 py-1 row">
    <div class="col">
      <field-with-label label="Cliente" :value="proyecto.client.name" />
      <field-with-label label="Proyecto" :value="proyecto.name" />
      <field-with-label label="Cantidad de horas contratadas por mes" :value="`${proyecto.monthlyContractedHours} hs`" />
    </div>
    <div class="col">
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

    <div class="col-2">
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
  </div>
  <Modal
    :is-visible="showModal"
    :title="title"
    :large="large"
    :is-editing="isEditing"
    @close="
      () => {
        ;(showModal = false), (isEnding = false), (isEditing = false), (large = false)
      }
    "
    @save="saveChanges"
  >
    <Finalizar v-if="isEnding" :ente="ente" />
    <div v-if="isEditing" class="modal-body-content">
      <ProjectAddForm :project-edit="proyecto" @update-data="updateDataEdit" />
    </div>
  </Modal>
</template>
<script>
import FieldWithLabel from './FieldWithLabel.vue'
import Finalizar from '@/components/FinalizarModal.vue'
import FormatDate from '@/mixins/formatting-text/FormatDate.vue'
import Modal from '@/components/shared/ModalModal.vue'
import ProjectAddForm from '@/components/ProjectAddForm.vue'
import ProjectsService from '@/services/projects'
import moment from 'moment'

export default {
  components: {
    FieldWithLabel,
    Finalizar,
    Modal,
    ProjectAddForm
  },
  mixins: [FormatDate],
  props: {
    proyecto: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      projectsService: new ProjectsService(),
      showModal: false,
      isEnding: false,
      title: '',
      ente: '',
      isEditing: false,
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
      showToast: false
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
      return value.charAt(0).toUpperCase() + value.slice(1)
    },
    finishProject() {
      this.showModal = true
      this.isEnding = true
      this.title = 'Finalizar proyecto'
      this.ente = 'proyecto'
    },
    editProject() {
      this.showModal = true
      this.isEditing = true
      this.title = 'Editar proyecto'
      this.large = true
    },
    updateDataEdit(updatedProject) {
      // console.log('updateDataEdit called in parent with:', updatedProject)
      this.project = updatedProject
      // console.log(this.project)
    },
    async saveChanges() {
      if (this.isEditing) {
        try {
          // Llamar al servicio para actualizar el proyecto
          await this.projectsService.updateProject(this.project.id, {
            name: this.project.name,
            monthlyContractedHours: this.project.monthlyContractedHours,
            startDate: new Date(this.project.startDate),
            endDate: this.project.endDate ? new Date(this.project.endDate) : null,
            idClient: this.project.idClient
          })
          this.showModal = false
          // Mostrar el toast de éxito
          this.showToast = true
          this.toastContent = 'Los cambios se guardaron exitosamente'
          setTimeout(() => {
            this.showToast = false
          }, 3000) // Oculta el toast después de 3 segundos

          // Recargar la página
          setTimeout(() => {
            window.location.reload()
          }, 3000)
        } catch (err) {
          // Mostrar el toast de error
          this.showToast = true
          this.toastContent = 'Se produjo un error al intentar editar el proyecto'
          setTimeout(() => {
            this.showToast = false
          }, 3000)
          console.log('Error al editar proyecto: ', err)
        }
        this.isEditing = false
        this.large = false
      }
    }
  }
}
</script>
<style scoped>
.toast {
  z-index: 1050;
  bottom: 0;
  left: 0;
  position: fixed;
  margin: 1rem;
}
</style>
