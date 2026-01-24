const Complaint = require('../models/Complaint');
const User = require('../models/User');
const notificationService = require('./notificationService');

class ComplaintService {
  async getAllComplaints(query = {}) {
    const { status, category, department, submittedBy, assignedTo, page = 1, limit = 10 } = query;
    
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (department) filter.department = department;
    if (submittedBy) filter.submittedBy = submittedBy;
    if (assignedTo) filter.assignedTo = assignedTo;

    const skip = (page - 1) * limit;

    const complaints = await Complaint.find(filter)
      .populate('submittedBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('statusHistory.changedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return complaints;
  }

  async getComplaintById(id) {
    const complaint = await Complaint.findById(id)
      .populate('submittedBy', 'name email phone')
      .populate('assignedTo', 'name email phone')
      .populate('comments.user', 'name email')
      .populate('statusHistory.changedBy', 'name email');
    
    return complaint;
  }

  async getComplaintByComplaintId(complaintId) {
    const complaint = await Complaint.findOne({ complaintId })
      .populate('submittedBy', 'name email phone')
      .populate('assignedTo', 'name email phone')
      .populate('comments.user', 'name email')
      .populate('statusHistory.changedBy', 'name email');
    
    return complaint;
  }

  async createComplaint(data) {
    // Create complaint (complaintId and department auto-assigned by pre-save hooks)
    const complaint = await Complaint.create(data);
    
    // Auto-route to department (assign officer)
    const assignedOfficer = await this.autoRouteToDepartment(complaint);
    
    if (assignedOfficer) {
      complaint.assignedTo = assignedOfficer._id;
      await complaint.save();
    }

    // Add initial status to history
    complaint.statusHistory.push({
      status: 'Pending',
      changedBy: complaint.submittedBy,
      notes: 'Complaint submitted'
    });
    await complaint.save();

    // Send notification to assigned officer (if assigned)
    if (assignedOfficer) {
      await notificationService.sendNotification({
        userId: assignedOfficer._id,
        type: 'complaint_assigned',
        title: 'New Complaint Assigned',
        message: `You have been assigned a new ${complaint.category} complaint: ${complaint.title}`,
        complaintId: complaint._id
      });
    }

    // Send notification to citizen
    await notificationService.sendNotification({
      userId: complaint.submittedBy,
      type: 'complaint_submitted',
      title: 'Complaint Submitted',
      message: `Your complaint "${complaint.title}" has been submitted successfully. Complaint ID: ${complaint.complaintId}`,
      complaintId: complaint._id
    });

    return await this.getComplaintById(complaint._id);
  }

  // Auto-route complaint to appropriate department/officer
  async autoRouteToDepartment(complaint) {
    // Find available officer for this department/category
    // Priority: Find officer with matching department specialization
    const officer = await User.findOne({
      role: 'Officer',
      isActive: true,
      // In a real system, you might have a department field in User model
      // For now, we'll assign to any available officer
    }).sort({ createdAt: 1 }); // Assign to officer with least complaints

    return officer;
  }

  async updateComplaint(id, data) {
    // Don't allow updating complaintId, submittedBy, or status (use updateStatus for status)
    const { complaintId, submittedBy, status, ...updateData } = data;
    
    const complaint = await Complaint.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!complaint) {
      throw new Error('Complaint not found');
    }
    
    return await this.getComplaintById(complaint._id);
  }

  async deleteComplaint(id) {
    const complaint = await Complaint.findByIdAndDelete(id);
    return complaint;
  }

  async addComment(id, commentData) {
    const complaint = await Complaint.findById(id);
    
    if (!complaint) {
      throw new Error('Complaint not found');
    }

    // Add comment
    complaint.comments.push(commentData);
    await complaint.save();

    // Notify other parties (citizen if officer commented, officer if citizen commented)
    const commenterId = commentData.user.toString();
    const isCitizen = complaint.submittedBy.toString() === commenterId;
    
    if (isCitizen && complaint.assignedTo) {
      // Citizen commented, notify officer
      await notificationService.sendNotification({
        userId: complaint.assignedTo,
        type: 'comment_added',
        title: 'New Comment on Complaint',
        message: `A comment has been added to complaint "${complaint.title}"`,
        complaintId: complaint._id
      });
    } else if (!isCitizen) {
      // Officer commented, notify citizen
      await notificationService.sendNotification({
        userId: complaint.submittedBy,
        type: 'comment_added',
        title: 'New Comment on Your Complaint',
        message: `An officer has added a comment to your complaint "${complaint.title}"`,
        complaintId: complaint._id
      });
    }
    
    return await this.getComplaintById(complaint._id);
  }

  async updateStatus(id, status, changedBy, notes = null) {
    const complaint = await Complaint.findById(id);
    
    if (!complaint) {
      throw new Error('Complaint not found');
    }

    const oldStatus = complaint.status;
    complaint.status = status;

    // Add to status history
    complaint.statusHistory.push({
      status: status,
      changedBy: changedBy,
      notes: notes || `Status changed from ${oldStatus} to ${status}`
    });

    // Handle resolved status
    if (status === 'Resolved') {
      complaint.resolvedAt = new Date();
      if (notes) {
        complaint.resolutionNotes = notes;
      }
    }

    await complaint.save();

    // Trigger notifications based on status change
    await this.triggerStatusNotifications(complaint, oldStatus, status, changedBy);

    return await this.getComplaintById(complaint._id);
  }

  // Trigger notifications when status changes
  async triggerStatusNotifications(complaint, oldStatus, newStatus, changedBy) {
    // Notify citizen about status change
    await notificationService.sendNotification({
      userId: complaint.submittedBy,
      type: 'status_update',
      title: 'Complaint Status Updated',
      message: `Your complaint "${complaint.title}" status has been changed from ${oldStatus} to ${newStatus}.`,
      complaintId: complaint._id
    });

    // Notify assigned officer (if different from who changed it)
    if (complaint.assignedTo && complaint.assignedTo.toString() !== changedBy.toString()) {
      await notificationService.sendNotification({
        userId: complaint.assignedTo,
        type: 'status_update',
        title: 'Complaint Status Updated',
        message: `Complaint "${complaint.title}" status has been changed to ${newStatus}.`,
        complaintId: complaint._id
      });
    }

    // Special notification for resolved status
    if (newStatus === 'Resolved') {
      await notificationService.sendNotification({
        userId: complaint.submittedBy,
        type: 'complaint_resolved',
        title: 'Complaint Resolved',
        message: `Great news! Your complaint "${complaint.title}" has been resolved.`,
        complaintId: complaint._id
      });
    }
  }

  async assignOfficer(complaintId, officerId) {
    const complaint = await Complaint.findById(complaintId);
    
    if (!complaint) {
      throw new Error('Complaint not found');
    }

    const officer = await User.findById(officerId);
    if (!officer || officer.role !== 'Officer') {
      throw new Error('Invalid officer');
    }

    complaint.assignedTo = officerId;
    
    // Add to status history
    complaint.statusHistory.push({
      status: complaint.status,
      changedBy: officerId,
      notes: `Complaint assigned to officer: ${officer.name}`
    });

    await complaint.save();

    // Notify officer
    await notificationService.sendNotification({
      userId: officerId,
      type: 'complaint_assigned',
      title: 'Complaint Assigned',
      message: `You have been assigned a new complaint: ${complaint.title}`,
      complaintId: complaint._id
    });

    // Notify citizen
    await notificationService.sendNotification({
      userId: complaint.submittedBy,
      type: 'officer_assigned',
      title: 'Officer Assigned',
      message: `An officer has been assigned to your complaint "${complaint.title}".`,
      complaintId: complaint._id
    });

    return await this.getComplaintById(complaint._id);
  }
}

module.exports = new ComplaintService();
