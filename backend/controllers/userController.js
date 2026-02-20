const User = require("../models/User");
const bcrypt = require("bcryptjs");

/**
 * ===============================
 * GET ALL USERS (ADMIN)
 * ===============================
 * GET /api/users
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.role) {
      filter.role = req.query.role;
    }

    const users = await User.find(filter).select("name email role avatar");

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ===============================
 * GET SINGLE USER
 * ===============================
 * GET /api/users/:id
 */
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      "name email role avatar"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ===============================
 * GET CURRENT USER (ME)
 * ===============================
 * GET /api/users/me
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name email role avatar"
    );

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ===============================
 * UPDATE PROFILE (NAME / EMAIL)
 * ===============================
 * PUT /api/users/profile
 */



// Update user profile
const updateProfile = async (req, res, next) => {
  console.log('updateProfile called - user:', req.user ? req.user.id : 'no-user', 'body:', req.body);
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const { name, email } = req.body;

    if (email && email !== user.email) {
      const exists = await User.findOne({ email });
      if (exists) {
        return res.status(400).json({ success: false, error: 'Email already in use' });
      }
      user.email = email;
    }

    if (name) user.name = name;

    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json({ success: true, data: userObj });
  } catch (err) {
    console.error('updateProfile error:', err.stack || err);
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
};

// Change password
const changePassword = async (req, res, next) => {
  console.log('changePassword called - user:', req.user ? req.user.id : 'no-user', 'bodyKeys:', Object.keys(req.body));
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: 'Both currentPassword and newPassword are required' });
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error('changePassword error:', err.stack || err);
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
};


// Upload avatar handler (for multer file upload)
const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Save relative path (served from /uploads)
    user.avatar = `/uploads/${req.file.filename}`;
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json({ success: true, data: userObj });
  } catch (err) {
    console.error("uploadAvatar error:", err.stack || err);
    return res.status(500).json({ success: false, error: err.message || "Server error" });
  }
};

// ...existing code...


const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ success: false, error: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    await user.remove();

    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error("deleteUser error:", err.stack || err);
    return res.status(500).json({ success: false, error: err.message || "Server error" });
  }
};

exports.updateProfile = updateProfile;
exports.changePassword = changePassword;
exports.uploadAvatar = uploadAvatar;
exports.deleteUser = deleteUser;