<script>
import moment from 'moment'

export default {
  methods: {
    formatDate: function (value, format) {
      const date = moment(value)

      switch (format) {
        case 'dateAndTime': {
          return date.format('DD/MM/YY HH:mm')
        }
        case 'monthAndYear': {
          return date.format('MMMM YYYY')
        }
        default:
          return date.format('DD/MM/YYYY')
      }
    }
  }
}
</script>
