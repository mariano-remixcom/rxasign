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

  getUserDetail(userId, startDate, endDate, projectIds) {
    return api().get(`/registered-periods/`, {
      params: {
        userId,
        startDate,
        endDate,
        projectIds
      }
    })
  }

  exportRegisteredHours(startDate, endDate, selectedProjectId, selectedUsers, format) {
    return api().post(`/registered-periods/export`, {
      startDate,
      endDate,
      selectedProjectId,
      selectedUsers,
      format
    })
  }
}
