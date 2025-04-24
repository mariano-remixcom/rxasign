import axios from 'axios'

export default () => {
  const hostApi = import.meta.env.VITE_HOST_API
  const api = axios.create({
    baseURL: hostApi,
    withCredentials: true
  })

  return api
}
