import api from './api'

export default class AuthService {
  login(username, password, rememberMe = false) {
    return api().post('/auth/login', { username, password, rememberMe })
  }

  logout() {
    return api().get('/auth/logout')
  }

  getCurrentUser() {
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
    return api().post('/auth/request-password-reset', {
      email,
      host: window.location.origin
    })
  }

  validateToken(token) {
    return api().get(`/auth/validate-reset-token/${token}`)
  }

  resetPassword(token, password) {
    return api().post('/auth/reset-password', {
      token,
      password
    })
  }
}
