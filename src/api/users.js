import axios from 'axios'

export function getAllUsers() {
  return axios({
    method: 'GET',
    url: `http://localhost:3000/api/users`,
    responseType: 'json'
  })
}
