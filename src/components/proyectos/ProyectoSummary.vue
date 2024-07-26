<template v-if="!!proyecto">
  <div class="section-header-primary">Proyecto</div>
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
          <button class="btn btn-soft-primary mb-1">Editar</button>
        </div>
        <div class="d-flex flex-row justify-content-end text-muted mt-1">
          <i class="bi bi-arrow-repeat"></i>
          <div class="ms-1">{{ formatDate(proyecto.fechaUltimaEdicion, 'dateAndTime') }}</div>
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
