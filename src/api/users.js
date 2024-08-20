import axios from 'axios'

export function obtenerRecursosActivosParaCombos() {
  return axios({
    method: 'GET',
    url: `http://localhost:3000/api/users/minimal-active`,
    responseType: 'json'
  })
}
