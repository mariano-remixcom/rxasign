import api from './api'

export default class ResourcesService {
  createResource(data) {
    return api().post(`resources`, data)
  }

  getResourcesBySquad(id) {
    return api().get(`resources/squad/${id}`)
  }

  updateResource(id, data) {
    return api().patch(`resources/${id}`, data)
  }

  deleteResource(id) {
    return api().delete(`resources/${id}`)
  }
}
