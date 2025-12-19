import { useFormatDate } from '@/composables/formatting-text/useFormatDate'

describe('useFormatDate', () => {
  it('formats date to default format', () => {
    const { formatDate } = useFormatDate()
    const result = formatDate('2024-06-15T12:00:00Z')

    expect(result).toBe('15/06/2024')
  })

  it('formats date to dateAndTime format', () => {
    const { formatDate } = useFormatDate()
    const result = formatDate('2024-06-15T12:00:00Z', 'dateAndTime')

    expect(result).toBe('15/06/24 09:00')
  })

  it('formats date to monthAndYear format', () => {
    const { formatDate } = useFormatDate()
    const result = formatDate('2024-06-15T12:00:00Z', 'monthAndYear')

    expect(result).toBe('June 2024')
  })

  it('formats date to isoDate format', () => {
    const { formatDate } = useFormatDate()
    const result = formatDate('2024-06-15T12:00:00Z', 'isoDate')

    expect(result).toBe('2024-06-15')
  })
})
