import api from './api'

export default class RegisteredPeriodsService {
  getSumaryHoursByUser(startDate, endDate, projectIds) {
    return api().get(`/registered-periods/sumary`, {
      params: {
        startDate,
        endDate,
        projectIds
      }
    })
  }
}
