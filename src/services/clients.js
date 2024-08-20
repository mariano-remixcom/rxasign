import api from './api'

export default class ClientsService {
  getAllClients() {
    return api().get(`/clients`)
  }

  getClientById(id) {
    console.log(id)

    return api().get(`/clients/${id}`)
  }
}
