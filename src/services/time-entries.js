import api from './api'

export default class TimeEntriesService {
  // Crear un nuevo registro de horas
  createTimeEntry(timeEntryData) {
    return api().post('/time-entries', timeEntryData)
  }

  // Obtener todos los registros del usuario autenticado
  getMyTimeEntries() {
    return api().get('/time-entries/me')
  }

  // Obtener registros por fecha específica
  getTimeEntriesByDate(date) {
    return api().get(`/time-entries/date/${date}`)
  }

  getTimeEntriesByProject(projectId) {
    return api().get(`/time-entries/project/${projectId}`)
  }

  asyncgetTimeEntriesByWeek(startDate) {
    return api().get(`/time-entries/week/${startDate}`)
  }

  updateTimeEntry(id, data) {
    return api().put(`/time-entries/${id}`, data)
  }

  deleteTimeEntry(id) {
    return api().delete(`/time-entries/${id}`)
  }
}
