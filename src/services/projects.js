import api from './api'

export default class ProjectsService {
  createProject(data) {
    return api().post(`/projects`, data)
  }

  getAllProjects() {
    return api().get(`/projects`)
  }

  getProjectById(id) {
    console.log(id)

    return api().get(`/projects/${id}`)
  }

  updateProject(id, data) {
    return api().patch(`/projects/${id}`, data)
  }

  deleteProject(id) {
    return api().delete(`/projects/${id}`)
  }
}
