<script>
export default {
  methods: {
    formatDate: function (date, format) {
      if (!date) return ''

      switch (format) {
        case 'dateAndTime': {
          const formattedDate = new Intl.DateTimeFormat('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: 'numeric',
            minute: 'numeric',
            hourCycle: 'h23'
          }).format(date)

          return formattedDate.replace(',', '')
        }
        case 'monthAndYear': {
          const formattedDate = new Intl.DateTimeFormat('es-AR', {
            month: 'long',
            year: 'numeric'
          }).formatToParts(date)

          return `${formattedDate[0].value} ${formattedDate[2].value}`
        }
        default:
          return new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date)
      }
    }
  }
}
</script>
