import api from './api'

export class UsersService {
  getActiveResourcesForCombobox() {
    return api().get('/users/minimal-active')
  }
}
