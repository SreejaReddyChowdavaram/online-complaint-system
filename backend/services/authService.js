const jwt = require('jsonwebtoken');
const userService = require('./userService');

class AuthService {
  // Generate JWT Token
  generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    });
  }

  async register(userData) {
    // Check if user already exists
    const existingUser = await userService.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Create user
    const user = await userService.createUser(userData);

    // Generate token
    const token = this.generateToken(user._id);

    return { user, token };
  }

  async login(email, password) {
    // Validate email & password
    if (!email || !password) {
      throw new Error('Please provide email and password');
    }

    // Check for user
    const user = await userService.getUserByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = this.generateToken(user._id);

    // Remove password from response
    const userWithoutPassword = await userService.getUserById(user._id);

    return { user: userWithoutPassword, token };
  }

  async getCurrentUser(id) {
    const user = await userService.getUserById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async updatePassword(userId, currentPassword, newPassword) {
    // Get user with password field
    const user = await userService.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Get user with password to compare
    const userWithPassword = await userService.getUserByEmail(user.email);
    
    // Check current password
    const isMatch = await userWithPassword.comparePassword(currentPassword);
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }

    // Update password (will be hashed by pre-save hook)
    userWithPassword.password = newPassword;
    await userWithPassword.save();

    return true;
  }
}

module.exports = new AuthService();
