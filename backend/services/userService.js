const User = require('../models/User');

class UserService {
  async getAllUsers(query = {}) {
    const { role, page = 1, limit = 10 } = query;
    
    const filter = {};
    if (role) filter.role = role;

    const skip = (page - 1) * limit;

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return users;
  }

  async getUserById(id) {
    const user = await User.findById(id).select('-password');
    return user;
  }

  async getUserByEmail(email) {
    const user = await User.findOne({ email }).select('+password');
    return user;
  }

  async createUser(data) {
    const user = await User.create(data);
    return await this.getUserById(user._id);
  }

  async updateUser(id, data) {
    // Don't allow password update through this method
    if (data.password) {
      delete data.password;
    }

    const user = await User.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');
    
    return user;
  }

  async deleteUser(id) {
    const user = await User.findByIdAndDelete(id);
    return user;
  }
}

module.exports = new UserService();
