<template v-if="!!proyecto">
  <h2 class="h5 title py-2 px-3 text-primary rounded fw-bold mb-3">Proyecto</h2>
  <div class="px-3 py-1 row">
    <div class="col">
      <field-with-label label="Cliente" :value="proyecto.cliente.nombre" />
      <field-with-label label="Proyecto" :value="proyecto.nombre" />
      <field-with-label label="Cantidad de horas contratadas por mes" :value="`${proyecto.horasMensualesContratadas} hs`" />
    </div>
    <div class="col">
      <field-with-label label="Período actual" :value="capitalizeFirstLetter(formatDate(new Date(), 'monthAndYear'))" />
      <field-with-label
        label="Inicio"
        :value="formatDate(proyecto.fechaInicio)"
        :helper="`Hace ${daysSinceStartOfProject} días`"
      />
      <field-with-label label="Fin" :value="formatDate(proyecto.fechaFin)" :helper="`Faltan ${daysUntilProjectEnds} días`" />
    </div>

    <div class="col-2">
      <div class="d-flex flex-column">
        <div class="d-flex justify-content-end">
          <button class="btn btn-secondary btn-lg mb-1" @click="editProject">Editar</button>
        </div>
        <div class="d-flex flex-row justify-content-end text-black-50 fw-light h5">
          <i class="bi bi-arrow-repeat"></i>
          <div class="fecha ms-1">{{ formatDate(proyecto.fechaUltimaEdicion, 'dateAndTime') }}</div>
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
      <ProjectAddForm />
    </div>
  </Modal>
</template>
<script>
import FieldWithLabel from './FieldWithLabel.vue'
import Finalizar from '@/components/FinalizarModal.vue'
import FormatDate from '@/mixins/formatting-text/FormatDate.vue'
import Modal from '@/components/shared/ModalModal.vue'
import ProjectAddForm from '@/components/ProjectAddForm.vue'

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
      isDeleting: false,
      isEnding: false,
      title: '',
      ente: '',
      isEditing: false,
      large: false
    }
  },
  computed: {
    daysSinceStartOfProject: function () {
      return this.getDaysBetweenDates(this.proyecto.fechaInicio, new Date())
    },
    daysUntilProjectEnds: function () {
      return this.getDaysBetweenDates(new Date(), this.proyecto.fechaFin)
    }
  },
  methods: {
    getDaysBetweenDates: function (first, second) {
      return Math.round((second - first) / (1000 * 60 * 60 * 24))
    },
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
    }
  }
}
</script>
<style scoped>
.btn-secondary {
  --bs-btn-color: var(--bs-primary);
  --bs-btn-font-weight: 600;
  --bs-btn-bg: #ebe5fc;
  --bs-btn-border-color: #ebe5fc;
  --bs-btn-hover-color: var(--bs-primary);
  --bs-btn-hover-bg: #d5c8fa;
  --bs-btn-hover-border-color: var(--bs-btn-hover-bg);
  --bs-btn-active-color: var(--bs-primary);
  --bs-btn-active-bg: #b19bf0;
  --bs-btn-active-border-color: var(--bs-btn-active-bg);
}

.title {
  background-color: #ebe5fc;
}
</style>
