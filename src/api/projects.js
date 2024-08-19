import axios from 'axios'

export function getProject(id) {
  return axios({
    method: 'GET',
    url: `http://localhost:3000/api/projects/${id}`,
    responseType: 'json'
  })
}
