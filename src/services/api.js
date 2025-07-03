import axios from 'axios'

let apiInstance = null

export default () => {
  if (!apiInstance) {
    const hostApi = import.meta.env.VITE_HOST_API

    apiInstance = axios.create({
      baseURL: hostApi,
      withCredentials: true
    })
  }

  return apiInstance
}

// Separate function to set up interceptors - call this after all modules are loaded
export const setupApiInterceptors = () => {
  import('@/services/interceptors/checkSessionExpired').then(({ checkSessionExpired }) => {
    const api = apiInstance

    api.interceptors.response.use(undefined, checkSessionExpired)
  })
}
