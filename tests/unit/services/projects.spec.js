import ProjectsService from '@/services/projects'
import api from '@/services/api'

describe('ProjectsService', () => {
  const service = new ProjectsService()

  beforeEach(() => {
    api().get = vi.fn()
    api().post = vi.fn()
    api().patch = vi.fn()
    api().delete = vi.fn()
  })

  it('should post to "/projects" when calling createProject', async () => {
    const data = { name: 'New Project' }

    await service.createProject(data)
    expect(api().post).toHaveBeenCalledWith('/projects', data)
  })

  it('should fetch from "/projects/user/me" when calling getMyProjects', async () => {
    await service.getMyProjects()
    expect(api().get).toHaveBeenCalledWith('/projects/user/me')
  })

  it('should fetch from "/projects" when calling getAllProjects', async () => {
    await service.getAllProjects()
    expect(api().get).toHaveBeenCalledWith('/projects')
  })

  it('should fetch from "/projects/[id]" when calling getProjectById', async () => {
    const projectId = 1

    await service.getProjectById(projectId)
    expect(api().get).toHaveBeenCalledWith(`/projects/${projectId}`)
  })

  it('should patch to "/projects/[id]" when calling updateProject', async () => {
    const projectId = 2
    const data = { name: 'Updated Project' }

    await service.updateProject(projectId, data)
    expect(api().patch).toHaveBeenCalledWith(`/projects/${projectId}`, data)
  })

  it('should delete from "/projects/[id]" when calling deleteProject', async () => {
    const projectId = 3

    await service.deleteProject(projectId)
    expect(api().delete).toHaveBeenCalledWith(`/projects/${projectId}`)
  })
})
