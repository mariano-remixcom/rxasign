import ResourcesService from '@/services/resources'
import api from '@/services/api'

describe('ResourcesService', () => {
  const service = new ResourcesService()

  beforeEach(() => {
    api().get = vi.fn()
    api().post = vi.fn()
    api().patch = vi.fn()
    api().delete = vi.fn()
  })

  it('should post to "resources" when calling createResource', async () => {
    const data = { name: 'New Resource' }

    await service.createResource(data)
    expect(api().post).toHaveBeenCalledWith('resources', data)
  })

  it('should fetch from "resources/squad/[id]" when calling getResourcesBySquad', async () => {
    const squadId = 1

    await service.getResourcesBySquad(squadId)
    expect(api().get).toHaveBeenCalledWith(`resources/squad/${squadId}`)
  })

  it('should patch to "resources/[id]" when calling updateResource', async () => {
    const resourceId = 2
    const data = { name: 'Updated Resource' }

    await service.updateResource(resourceId, data)
    expect(api().patch).toHaveBeenCalledWith(`resources/${resourceId}`, data)
  })

  it('should delete from "resources/[id]" when calling deleteResource', async () => {
    const resourceId = 3

    await service.deleteResource(resourceId)
    expect(api().delete).toHaveBeenCalledWith(`resources/${resourceId}`)
  })
})
