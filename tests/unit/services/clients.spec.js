import ClientsService from '@/services/clients'
import api from '@/services/api'

describe('ClientsService', () => {
  const service = new ClientsService()

  beforeEach(() => {
    api().get = vi.fn()
  })

  it('should fetch from "/clients" when calling getAllClients', async () => {
    await service.getAllClients()
    expect(api().get).toHaveBeenCalledWith('/clients')
  })

  it('should fetch from "/clients/[id]" when calling getClientById', async () => {
    const clientId = 1

    await service.getClientById(clientId)
    expect(api().get).toHaveBeenCalledWith(`/clients/${clientId}`)
  })
})
