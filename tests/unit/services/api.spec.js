import MockAdapter from 'axios-mock-adapter'
import api, { setupApiInterceptors } from '@/services/api'
import { checkSessionExpired } from '@/services/interceptors/checkSessionExpired'
import { flushPromises } from '@vue/test-utils'

vi.mock('@/services/interceptors/checkSessionExpired', () => ({
  checkSessionExpired: vi.fn()
}))

describe('AxiosInstance', () => {
  const axiosMock = new MockAdapter(api())

  it('should setup interceptors on the axios instance', async () => {
    axiosMock.onGet('/test-endpoint').reply(401)

    setupApiInterceptors()
    await flushPromises()

    api()
      .get('/test-endpoint')
      .catch(() => {
        expect(checkSessionExpired).toHaveBeenCalled()
      })
  })
})
