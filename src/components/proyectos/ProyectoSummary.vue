<template v-if="!!proyecto">
  <div class="alert alert-primary fw-bold px-3 py-2">Proyecto</div>
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
          <button class="btn btn-secondary btn-lg mb-1">Editar</button>
        </div>
        <div class="d-flex flex-row justify-content-end text-black-50 fw-light h5">
          <i class="bi bi-arrow-repeat"></i>
          <div class="fecha ms-1">{{ formatDate(proyecto.fechaUltimaEdicion, 'dateAndTime') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import FieldWithLabel from './FieldWithLabel.vue'
import FormatDate from '@/mixins/formatting-text/FormatDate.vue'

export default {
  components: {
    FieldWithLabel
  },
  mixins: [FormatDate],
  props: {
    proyecto: {
      type: Object,
      required: true
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
