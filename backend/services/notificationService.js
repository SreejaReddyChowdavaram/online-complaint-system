const Notification = require('../models/Notification');

class NotificationService {
  /**
   * Send notification to user
   * @param {Object} notificationData - { userId, type, title, message, complaintId }
   */
  async sendNotification(notificationData) {
    try {
      const { userId, type, title, message, complaintId } = notificationData;

      // Create notification in database
      const notification = await Notification.create({
        user: userId,
        type: type || 'general',
        title: title || 'Notification',
        message: message || '',
        complaintId: complaintId || null,
        read: false
      });

      // Future-ready: Send push notification
      await this.sendPushNotification(userId, notification);

      // In a real system, you would also:
      // 1. Send push notification (FCM, APNS) - Hook ready above
      // 2. Send email notification
      // 3. Send SMS notification
      // 4. WebSocket notification for real-time updates

      console.log(`Notification sent to user ${userId}: ${title}`);

      return notification;
    } catch (error) {
      // Log error but don't fail the main operation
      console.error('Error sending notification:', error);
      return null;
    }
  }

  /**
   * Get notifications for a user
   */
  async getUserNotifications(userId, options = {}) {
    const { unreadOnly = false, limit = 50 } = options;

    const filter = { user: userId };
    if (unreadOnly) {
      filter.read = false;
    }

    const notifications = await Notification.find(filter)
      .populate('complaintId', 'title complaintId')
      .sort({ createdAt: -1 })
      .limit(limit);

    return notifications;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId, userId) {
    const notification = await Notification.findOne({
      _id: notificationId,
      user: userId
    });

    if (notification) {
      notification.read = true;
      notification.readAt = new Date();
      await notification.save();
    }

    return notification;
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId) {
    await Notification.updateMany(
      { user: userId, read: false },
      { read: true, readAt: new Date() }
    );
  }

  /**
   * Get unread notifications count for a user
   */
  async getUnreadCount(userId) {
    const count = await Notification.countDocuments({
      user: userId,
      read: false
    });
    return count;
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId, userId) {
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      user: userId
    });
    return notification;
  }

  /**
   * Register device for push notifications (future-ready)
   */
  async registerDevice(userId, deviceToken, platform = 'unknown') {
    // In a real implementation, you would store device tokens in a separate collection
    // or add a deviceTokens array to the User model
    // For now, we'll just log it and return success
    
    console.log(`Device registered for user ${userId}: ${deviceToken} (${platform})`);
    
    // Future implementation:
    // await User.findByIdAndUpdate(userId, {
    //   $addToSet: { deviceTokens: { token: deviceToken, platform, createdAt: new Date() } }
    // });

    return {
      userId,
      deviceToken,
      platform,
      registeredAt: new Date()
    };
  }

  /**
   * Send push notification (future-ready hook)
   * This method can be extended to send actual push notifications
   */
  async sendPushNotification(userId, notification) {
    // Future implementation:
    // 1. Get user's device tokens
    // 2. Send push notification via FCM (Android) or APNS (iOS)
    // 3. Handle errors and retry logic
    
    console.log(`Push notification would be sent to user ${userId}: ${notification.title}`);
    
    // Example FCM implementation (commented out):
    // const admin = require('firebase-admin');
    // const tokens = await this.getUserDeviceTokens(userId);
    // const message = {
    //   notification: {
    //     title: notification.title,
    //     body: notification.message
    //   },
    //   data: {
    //     type: notification.type,
    //     complaintId: notification.complaintId?.toString()
    //   },
    //   tokens: tokens
    // };
    // await admin.messaging().sendMulticast(message);
  }
}

module.exports = new NotificationService();
