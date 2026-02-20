// frontend/src/services/userService.js
import axios from './axios'

// Get all officers
export const getOfficers = async () => {
  const response = await axios.get('/users?role=Officer')
  return response
}