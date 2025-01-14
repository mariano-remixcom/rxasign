import api from './api'

export default class UsersService {
  getActiveResourcesForCombobox() {
    return api().get('/users/minimal-active')
  }

  getAvailableHoursForUser(id) {
    return api().get(`/users/available-hours/${id}`)
  }

  getAssignedHoursForUser(id) {
    return api().get(`/users/assigned-hours/${id}`)
  }

  getUserById(id) {
    return api().get(`/users/${id}`)
  }

  getAllUsers() {
    return api().get(`/users`)
  }

  getUserWithResources(id) {
    return api().get(`/users/user-with-resources/${id}`)
  }
}
