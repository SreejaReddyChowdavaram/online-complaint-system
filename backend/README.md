# JAN SUVIDHA - Backend API

Backend API for the JAN SUVIDHA civic complaint management system built with Node.js and Express.

## Project Structure

```
backend/
├── config/          # Configuration files
│   └── database.js  # MongoDB connection
├── controllers/     # Request handlers
│   ├── authController.js
│   ├── complaintController.js
│   └── userController.js
├── middleware/      # Custom middleware
│   ├── auth.js      # Authentication & authorization
│   ├── errorHandler.js
│   └── notFound.js
├── models/          # Database models
│   ├── Complaint.js
│   └── User.js
├── routes/          # API routes
│   ├── authRoutes.js
│   ├── complaintRoutes.js
│   └── userRoutes.js
├── services/        # Business logic layer
│   ├── authService.js
│   ├── complaintService.js
│   └── userService.js
├── utils/           # Utility functions
│   └── helpers.js
├── validators/      # Input validation
│   ├── authValidator.js
│   └── complaintValidator.js
├── app.js           # Express app configuration
├── server.js        # Server entry point
└── package.json     # Dependencies
```

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Complaint Management**: Create, read, update, delete complaints
- **User Management**: User registration, profile management
- **Comments System**: Add comments to complaints
- **File Upload Support**: Attachment handling for complaints
- **Input Validation**: Express-validator for request validation
- **Error Handling**: Centralized error handling middleware
- **Security**: Helmet, CORS, password hashing

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
- MongoDB connection string
- JWT secret
- Port number
- Other environment variables

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatepassword` - Update password

### Complaints
- `GET /api/complaints` - Get all complaints
- `GET /api/complaints/:id` - Get single complaint
- `POST /api/complaints` - Create complaint (Protected)
- `PUT /api/complaints/:id` - Update complaint (Protected)
- `DELETE /api/complaints/:id` - Delete complaint (Admin only)
- `POST /api/complaints/:id/comments` - Add comment (Protected)

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/me` - Get current user profile
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

## User Roles

- **Citizen**: Default role, can create and manage own complaints
- **Officer**: Can view and manage assigned complaints
- **Admin**: Full access to all features

## Technologies

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Express Validator for input validation
- Helmet for security
- CORS for cross-origin requests
