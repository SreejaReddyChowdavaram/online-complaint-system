const { body, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// Complaint validation rules
exports.validateComplaint = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['Road', 'Water', 'Electricity', 'Sanitation', 'Other']).withMessage('Invalid category'),
  
  body('location.address')
    .trim()
    .notEmpty().withMessage('Address is required'),
  
  body('location.coordinates.latitude')
    .notEmpty().withMessage('Latitude is required')
    .isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
  
  body('location.coordinates.longitude')
    .notEmpty().withMessage('Longitude is required')
    .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
  
  body('imageUrl')
    .optional()
    .isURL().withMessage('Image URL must be a valid URL'),
  
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Urgent']).withMessage('Invalid priority level'),
  
  handleValidationErrors
];

// Status update validation
exports.validateStatusUpdate = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['Pending', 'In Progress', 'Resolved', 'Rejected']).withMessage('Invalid status'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
  
  handleValidationErrors
];

// Comment validation
exports.validateComment = [
  body('text')
    .trim()
    .notEmpty().withMessage('Comment text is required')
    .isLength({ min: 1, max: 500 }).withMessage('Comment must be between 1 and 500 characters'),
  
  handleValidationErrors
];
