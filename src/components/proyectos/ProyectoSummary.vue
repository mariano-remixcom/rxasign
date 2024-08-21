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
      <ProjectAddForm :project-edit="proyecto" />
    </div>
  </Modal>
</template>
<script>
import FieldWithLabel from './FieldWithLabel.vue'
import Finalizar from '@/components/FinalizarModal.vue'
import FormatDate from '@/mixins/formatting-text/FormatDate.vue'
import Modal from '@/components/shared/ModalModal.vue'
import ProjectAddForm from '@/components/ProjectAddForm.vue'
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
      }
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
      this.editForm = updatedProject
    }
  }
}
</script>
