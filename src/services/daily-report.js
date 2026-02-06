import api from './api'

export default class DailyReportService {
  createDailyReport(data) {
    return api().post('/daily-report/create', data)
  }

  setDailyLeader(data) {
    return api().post('/daily-report/set-leader', data)
  }

  getLastLeader() {
    return api().get('/daily-report/last-leader')
  }

  getLeaderByDate(date) {
    return api().get(`/daily-report/leader/${date}`)
  }

  getDailyReportByDate(date) {
    return api().get(`/daily-report/by-date/${date}`)
  }

  getProjectReportsByDateRange(projectId, startDate, endDate) {
    return api().get(`/daily-report/project/${projectId}/date-range`, {
      params: { startDate, endDate }
    })
  }

  getAllProjectReportsByDateRange(startDate, endDate) {
    return api().get('/daily-report/all-projects/date-range', {
      params: { startDate, endDate }
    })
  }

  updateDailyReport(date, data) {
    return api().put(`/daily-report/update/${date}`, data)
  }
}
