# JAN SUVIDHA - Civic Complaint Registering System

A full-stack civic grievance redressal system built with Flutter (Frontend) and Node.js + Express (Backend).

## 🎯 Project Overview

**Jan Suvidha** enables citizens to register and track civic complaints (roads, water, electricity, sanitation) with real-time status updates, location mapping, and photo attachments.

## 🏗️ Architecture

- **Frontend**: Flutter (Dart) - Cross-platform mobile app
- **Backend**: Node.js + Express - RESTful API
- **Database**: MongoDB (Mongoose) - NoSQL database
- **Authentication**: JWT (JSON Web Tokens)
- **Maps**: Google Maps API

## 📁 Project Structure

```
JAN SUVIDHA/
├── backend/          # Node.js + Express API (MVC Architecture)
│   ├── config/       # Database & configuration
│   ├── controllers/  # Request handlers
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API routes
│   ├── services/     # Business logic
│   ├── middleware/   # Auth, error handling
│   └── validators/   # Input validation
│
├── frontend/         # Flutter mobile app
│   ├── lib/
│   │   ├── config/   # App configuration
│   │   ├── models/   # Data models
│   │   ├── providers/# State management
│   │   ├── screens/  # UI screens
│   │   ├── services/ # API services
│   │   └── widgets/  # Reusable widgets
│   └── pubspec.yaml
│
├── PROJECT_GUIDE.md  # Complete project documentation
└── README.md         # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- Flutter SDK (v3.0+)
- Google Maps API Key

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env  # Edit .env with your config
npm run dev
```

**Environment Variables (.env):**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jan-suvidha
JWT_SECRET=your-secret-key
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:3000
GOOGLE_MAPS_API_KEY=your-api-key
```

### Frontend Setup

```bash
cd frontend
flutter pub get
# Update API URL in lib/config/app_config.dart
flutter run
```

## 📚 Documentation

For complete documentation, see **[PROJECT_GUIDE.md](./PROJECT_GUIDE.md)** which includes:
- System architecture explanation
- Tech stack rationale
- Complete workflow diagrams
- API documentation
- Database schema
- Viva preparation guide

## 🔑 Key Features

- ✅ User Authentication (JWT)
- ✅ Role-Based Access Control (Citizen, Officer, Admin)
- ✅ Complaint CRUD Operations
- ✅ Location Mapping (Google Maps)
- ✅ File Upload (Photos)
- ✅ Real-time Status Updates
- ✅ Comments System
- ✅ Responsive UI (Material Design)

## 🛠️ Tech Stack Details

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Flutter (Dart) | Cross-platform mobile app |
| Backend | Node.js + Express | RESTful API server |
| Database | MongoDB + Mongoose | NoSQL document database |
| Auth | JWT | Stateless authentication |
| Maps | Google Maps API | Location services |
| State | Provider | State management |

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Complaints
- `GET /api/complaints` - Get all complaints
- `GET /api/complaints/:id` - Get single complaint
- `POST /api/complaints` - Create complaint
- `PUT /api/complaints/:id` - Update complaint
- `DELETE /api/complaints/:id` - Delete complaint (Admin)
- `POST /api/complaints/:id/comments` - Add comment

## 👥 User Roles

- **Citizen**: Submit and track own complaints
- **Officer**: Manage assigned complaints, update status
- **Admin**: Full system access

## 🔒 Security Features

- Password hashing (bcrypt)
- JWT token authentication
- Role-based access control
- Input validation
- CORS configuration
- Helmet security headers

## 📱 Screenshots

*(Add screenshots of your app here)*

## 🎓 For Viva

This project demonstrates:
- Full-stack development
- MVC architecture
- RESTful API design
- Mobile app development
- Database design
- Authentication & authorization

See **[PROJECT_GUIDE.md](./PROJECT_GUIDE.md)** for detailed viva preparation guide.

## 📝 License

This project is for educational purposes (Final Year Engineering Project).

## 👨‍💻 Author

[Your Name]
Final Year Engineering Student

---

**Built with ❤️ for better civic engagement**
