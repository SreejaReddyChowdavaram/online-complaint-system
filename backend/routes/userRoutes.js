const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUser,
  getMe,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/me', getMe);

router
  .route('/')
  .get(authorize('Admin'), getAllUsers);

router
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(authorize('Admin'), deleteUser);

module.exports = router;
