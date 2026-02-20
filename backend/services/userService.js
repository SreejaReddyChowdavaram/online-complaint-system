/**
 * userService.js
 * Handles all DB operations related to User
 */

const User = require('../models/User')

class UserService {
  /**
   * Create a new user
   * IMPORTANT: role must come from userData (Citizen / Officer)
   */
  async createUser(userData) {
    const user = await User.create({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      role: userData.role || 'Citizen' // default only if not sent
    })

    return user
  }

  /**
   * Get user by email (used for login)
   * Includes password for comparison
   */
  async getUserByEmail(email) {
    return await User.findOne({ email }).select('+password')
  }

  /**
   * Get user by ID (safe – no password)
   */
  async getUserById(id) {
    return await User.findById(id)
  }

  /**
   * Get users by role (used for Officer list)
   */
  async getUsersByRole(role) {
    return await User.find({ role }).select('-password')
  }
}

module.exports = new UserService()
