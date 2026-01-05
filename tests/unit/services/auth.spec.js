import AuthService from '@/services/auth'
import MockAdapter from 'axios-mock-adapter'
import api from '@/services/api'

describe('AuthService axios getCurrentUser flow', () => {
  const service = new AuthService()
  const axiosMock = new MockAdapter(api())

  it('should return false when not authenticated by the backend', async () => {
    axiosMock.onGet('/users/me').reply(401)
    const result = await service.getCurrentUser()

    expect(result).toBe(false)
  })

  it('should return false and log error on error different than 401', async () => {
    axiosMock.onGet('/users/me').reply(500)
    console.error = vi.fn()
    const result = await service.getCurrentUser()

    expect(result).toBe(false)
    expect(console.error).toHaveBeenCalled()
  })

  it('should return user data when authenticated', async () => {
    const userData = { id: 1, name: 'Test User' }

    axiosMock.onGet('/users/me').reply(200, userData)
    const result = await service.getCurrentUser()

    expect(result).toEqual(userData)
  })
})

describe('AuthService mocked axios', () => {
  const service = new AuthService()

  beforeEach(() => {
    api().get = vi.fn()
    api().post = vi.fn()
  })

  it('should post to "/auth/login" when calling login', async () => {
    const username = 'testuser'
    const password = 'testpassword'
    const rememberMe = true

    await service.login(username, password, rememberMe)

    expect(api().post).toHaveBeenCalledWith('/auth/login', { username, password, rememberMe })
  })

  it('should get from "/auth/logout" when calling logout', async () => {
    await service.logout()
    expect(api().get).toHaveBeenCalledWith('/auth/logout')
  })

  it('should post to "/auth/request-password-reset" when calling requestPasswordRecovery', async () => {
    const email = 'test@example.com'

    await service.requestPasswordRecovery(email)

    expect(api().post).toHaveBeenCalledWith('/auth/request-password-reset', { email, host: expect.any(String) })
  })

  it('should get from "/auth/validate-reset-token/[token]" when calling validateToken', async () => {
    const token = 'resettoken123'

    await service.validateToken(token)
    expect(api().get).toHaveBeenCalledWith(`/auth/validate-reset-token/${token}`)
  })

  it('should post to "/auth/reset-password" when calling resetPassword', async () => {
    const token = 'resettoken123'
    const password = 'newpassword'

    await service.resetPassword(token, password)
    expect(api().post).toHaveBeenCalledWith('/auth/reset-password', { token, password })
  })
})
