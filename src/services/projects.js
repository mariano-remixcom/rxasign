import api from './api'

export default class ProjectsService {
  createProject(data) {
    return api().post(`/projects`, data)
  }

  getMyProjects() {
    return api().get(`/projects/user/me`)
  }

  getAllProjects() {
    return api().get(`/projects`)
  }

  getProjectById(id) {
    return api().get(`/projects/${id}`)
  }

  updateProject(id, data) {
    return api().patch(`/projects/${id}`, data)
  }

  deleteProject(id) {
    return api().delete(`/projects/${id}`)
  }
}
