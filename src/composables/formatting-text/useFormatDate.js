import moment from 'moment'

export function useFormatDate() {
  const formatDate = (value, format) => {
    const date = moment.utc(value) // Forzamos UTC

    switch (format) {
      case 'dateAndTime': {
        return date.local().format('DD/MM/YY HH:mm') // Convertimos a la hora local si es necesario
      }
      case 'monthAndYear': {
        return date.format('MMMM YYYY')
      }
      case 'isoDate': {
        return date.format('YYYY-MM-DD')
      }
      default: {
        return date.format('DD/MM/YYYY')
      }
    }
  }

  return {
    formatDate
  }
}
