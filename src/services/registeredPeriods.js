import api from './api'

export default class RegisteredPeriodsService {
  getSumaryHoursByUser() {
    return api().get(`/registered-periods/sumary`)
  }
}
