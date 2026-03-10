import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.DEV ? '' : 'https://orchestrixlabsbackend-production.up.railway.app',
})

export default api
