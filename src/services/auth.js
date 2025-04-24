import api from './api'

export default class AuthService {
  login(username, password) {
    return api().post('/auth/login', { username, password })
  }

  logout() {
    return api().get('/auth/logout')
  }
}
