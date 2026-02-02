import api from './api'

export default class DailyReportService {
  createDailyReport(data) {
    return api().post('/daily-reports/create', data)
  }

  getLastLeader() {
    return api().get('/daily-reports/last-leader')
  }
}
