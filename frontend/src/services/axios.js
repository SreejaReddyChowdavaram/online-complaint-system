import axios from 'axios'

const instance = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || "") + "/api",
  withCredentials: true,
  timeout: 10000 // 10 seconds timeout
})

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default instance
