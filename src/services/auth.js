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

  requestPasswordRecovery(email) {
    return api().post('/auth/recovery', {
      email,
      host: window.location.origin
    })
  }

  validateToken(token) {
    return api().get(`/auth/validate-token/${token}`)
  }

  resetPassword(token, password) {
    return api().post('/auth/reset-password', {
      token,
      password
    })
  }
}
