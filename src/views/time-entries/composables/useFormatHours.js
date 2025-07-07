export const useFormatHours = () => {
  const formatHours = (hours) => {
    if (hours === undefined || hours === null) return '0:00'
    const numHours = parseFloat(hours)
    const wholeHours = Math.floor(numHours)
    const minutes = Math.round((numHours - wholeHours) * 60)

    return `${wholeHours}:${minutes.toString().padStart(2, '0')}`
  }

  return { formatHours }
}
