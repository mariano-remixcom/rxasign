import api from './api'

export class UsersService {
  getActiveResourcesForCombobox() {
    return api().get('/users/minimal-active')
  }

  getAvailableHoursForUser(id) {
    return api().get(`/users/available-hours/${id}`)
  }
}
