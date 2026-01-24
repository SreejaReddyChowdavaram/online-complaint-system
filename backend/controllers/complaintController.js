const Complaint = require('../models/Complaint');
const complaintService = require('../services/complaintService');

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Public/Private
exports.getAllComplaints = async (req, res, next) => {
  try {
    const complaints = await complaintService.getAllComplaints(req.query);
    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Public/Private
exports.getComplaint = async (req, res, next) => {
  try {
    const complaint = await complaintService.getComplaintById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    res.status(200).json({
      success: true,
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private
exports.createComplaint = async (req, res, next) => {
  try {
    // Add user ID from auth middleware
    req.body.submittedBy = req.user.id;
    
    const complaint = await complaintService.createComplaint(req.body);
    
    res.status(201).json({
      success: true,
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint
// @route   PUT /api/complaints/:id
// @access  Private
exports.updateComplaint = async (req, res, next) => {
  try {
    let complaint = await complaintService.getComplaintById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Check authorization: Owner, Assigned Officer, or Admin
    const isOwner = complaint.submittedBy.toString() === req.user.id;
    const isAssignedOfficer = complaint.assignedTo && 
                              complaint.assignedTo.toString() === req.user.id && 
                              req.user.role === 'Officer';
    const isAdmin = req.user.role === 'Admin';
    
    if (!isOwner && !isAssignedOfficer && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this complaint'
      });
    }

    complaint = await complaintService.updateComplaint(req.params.id, req.body);
    
    res.status(200).json({
      success: true,
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private/Admin
exports.deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await complaintService.getComplaintById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Only admin can delete
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete complaints'
      });
    }

    await complaintService.deleteComplaint(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Complaint deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to complaint
// @route   POST /api/complaints/:id/comments
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    const complaint = await complaintService.addComment(req.params.id, {
      user: req.user.id,
      text: req.body.text
    });
    
    res.status(200).json({
      success: true,
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id/status
// @access  Private (Officer/Admin)
exports.updateStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const complaintId = req.params.id;

    // Validate status
    const validStatuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    // Check authorization (Officer can only update assigned complaints)
    const complaint = await complaintService.getComplaintById(complaintId);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Authorization check
    const isAssignedOfficer = complaint.assignedTo && 
                              complaint.assignedTo._id.toString() === req.user.id && 
                              req.user.role === 'Officer';
    const isAdmin = req.user.role === 'Admin';

    if (!isAssignedOfficer && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this complaint status'
      });
    }

    // Update status
    const updatedComplaint = await complaintService.updateStatus(
      complaintId,
      status,
      req.user.id,
      notes
    );

    res.status(200).json({
      success: true,
      message: `Complaint status updated to ${status}`,
      data: updatedComplaint
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign officer to complaint
// @route   PUT /api/complaints/:id/assign
// @access  Private (Admin/Officer)
exports.assignOfficer = async (req, res, next) => {
  try {
    const { officerId } = req.body;
    const complaintId = req.params.id;

    if (!officerId) {
      return res.status(400).json({
        success: false,
        message: 'Officer ID is required'
      });
    }

    // Only Admin can assign officers
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can assign officers to complaints'
      });
    }

    const updatedComplaint = await complaintService.assignOfficer(complaintId, officerId);

    res.status(200).json({
      success: true,
      message: 'Officer assigned successfully',
      data: updatedComplaint
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get complaint by complaint ID
// @route   GET /api/complaints/complaint-id/:complaintId
// @access  Public/Private
exports.getComplaintByComplaintId = async (req, res, next) => {
  try {
    const complaint = await complaintService.getComplaintByComplaintId(req.params.complaintId);
    
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    res.status(200).json({
      success: true,
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};
