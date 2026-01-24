const express = require('express');
const router = express.Router();
const {
  getAllComplaints,
  getComplaint,
  getComplaintByComplaintId,
  createComplaint,
  updateComplaint,
  deleteComplaint,
  addComment,
  updateStatus,
  assignOfficer
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');
const { validateComplaint, validateComment, validateStatusUpdate } = require('../validators/complaintValidator');

// Get complaint by complaint ID (public route for tracking)
router.get('/complaint-id/:complaintId', getComplaintByComplaintId);

router
  .route('/')
  .get(getAllComplaints)
  .post(protect, authorize('Citizen'), validateComplaint, createComplaint);

router
  .route('/:id')
  .get(getComplaint)
  .put(protect, updateComplaint)
  .delete(protect, authorize('Admin'), deleteComplaint);

router
  .route('/:id/comments')
  .post(protect, validateComment, addComment);

router
  .route('/:id/status')
  .put(protect, authorize('Officer', 'Admin'), validateStatusUpdate, updateStatus);

router
  .route('/:id/assign')
  .put(protect, authorize('Admin'), assignOfficer);

module.exports = router;
