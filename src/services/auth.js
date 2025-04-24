import api from './api'

export default class AuthService {
  login(username, password) {
    return api().post('/auth/login', { username, password })
  }

  logout() {
    return api().get('/auth/logout')
  }

  isAuthenticated() {
    return api()
      .get('/users/me')
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          return false
        }

        console.error('Error checking authentication:', error)

        return false
      })
  }
}
