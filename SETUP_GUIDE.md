# JAN SUVIDHA - Setup Guide

## 📋 Prerequisites

Before starting, ensure you have the following installed:

1. **Node.js** (v14 or higher)
   - Download from: https://nodejs.org/
   - Verify: `node --version`

2. **MongoDB**
   - Option 1: Local MongoDB
     - Download from: https://www.mongodb.com/try/download/community
     - Install and start MongoDB service
   - Option 2: MongoDB Atlas (Cloud - Recommended)
     - Sign up: https://www.mongodb.com/cloud/atlas
     - Create a free cluster
     - Get connection string

3. **Flutter SDK** (v3.0 or higher)
   - Download from: https://flutter.dev/docs/get-started/install
   - Verify: `flutter --version`
   - Setup Android Studio / Xcode for mobile development

4. **Google Maps API Key**
   - Go to: https://console.cloud.google.com/
   - Create a new project
   - Enable "Maps SDK for Android" and "Maps SDK for iOS"
   - Create API key
   - (Optional) Restrict API key to your app

5. **Code Editor**
   - VS Code or Cursor (recommended)
   - Install Flutter extension
   - Install Dart extension

---

## 🔧 Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- express (Web framework)
- mongoose (MongoDB ODM)
- jsonwebtoken (JWT authentication)
- bcryptjs (Password hashing)
- express-validator (Input validation)
- cors, helmet, morgan (Security & logging)
- multer (File uploads)

### Step 3: Create Environment File

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
# For Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/jan-suvidha

# For MongoDB Atlas (Cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jan-suvidha?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-characters
JWT_EXPIRE=30d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Google Maps API Key
GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

**Important:**
- Replace `JWT_SECRET` with a strong random string (at least 32 characters)
- Replace `MONGODB_URI` with your actual MongoDB connection string
- Replace `GOOGLE_MAPS_API_KEY` with your Google Maps API key
- Never commit `.env` file to Git (it's in .gitignore)

### Step 4: Start MongoDB

**If using Local MongoDB:**
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
# or
mongod
```

**If using MongoDB Atlas:**
- No local setup needed
- Just use the connection string from Atlas dashboard

### Step 5: Create Uploads Directory

```bash
mkdir uploads
```

This directory will store uploaded complaint photos.

### Step 6: Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

You should see:
```
MongoDB Connected: localhost (or your Atlas cluster)
Server is running on port 5000
Environment: development
```

### Step 7: Test the API

Open your browser or use Postman/Thunder Client:

```
GET http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "JAN SUVIDHA API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 📱 Frontend Setup

### Step 1: Navigate to Frontend Directory

```bash
cd frontend
```

### Step 2: Install Flutter Dependencies

```bash
flutter pub get
```

This will install all packages from `pubspec.yaml`:
- provider (State management)
- http, dio (HTTP requests)
- shared_preferences (Local storage)
- google_fonts (Custom fonts)
- geolocator, geocoding (Location services)
- image_picker (Photo selection)
- And more...

### Step 3: Configure API Base URL

Edit `lib/config/app_config.dart`:

```dart
class AppConfig {
  static const String appName = 'Jan Suvidha';
  static const String baseUrl = 'http://localhost:5000/api';
  // For Android Emulator, use: 'http://10.0.2.2:5000/api'
  // For iOS Simulator, use: 'http://localhost:5000/api'
  // For Physical Device, use: 'http://YOUR_COMPUTER_IP:5000/api'
}
```

**Important for Physical Devices:**
- Find your computer's IP address:
  - Windows: `ipconfig` (look for IPv4 Address)
  - Mac/Linux: `ifconfig` or `ip addr`
- Use that IP instead of `localhost`
- Ensure phone and computer are on same network

### Step 4: Configure Google Maps

1. **Get API Key** (if not done already)
   - Go to Google Cloud Console
   - Enable Maps SDK for Android and iOS
   - Create API key

2. **Android Setup:**
   - Edit `android/app/src/main/AndroidManifest.xml`:
   ```xml
   <application>
     <meta-data
       android:name="com.google.android.geo.API_KEY"
       android:value="YOUR_API_KEY_HERE"/>
   </application>
   ```

3. **iOS Setup:**
   - Edit `ios/Runner/AppDelegate.swift`:
   ```swift
   import GoogleMaps
   
   GMSServices.provideAPIKey("YOUR_API_KEY_HERE")
   ```

4. **Add to app_config.dart:**
   ```dart
   static const String googleMapsApiKey = 'YOUR_API_KEY_HERE';
   ```

### Step 5: Run the App

```bash
# List available devices
flutter devices

# Run on specific device
flutter run

# Or run in specific mode
flutter run -d chrome        # Web
flutter run -d android        # Android
flutter run -d ios            # iOS
```

---

## 🧪 Testing the Complete System

### 1. Test Backend API

Using Postman or Thunder Client (VS Code extension):

**Register a User:**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "phone": "1234567890",
  "password": "password123"
}
```

**Login:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

Copy the `token` from response.

**Create Complaint (Protected):**
```
POST http://localhost:5000/api/complaints
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "title": "Test Complaint",
  "description": "This is a test complaint",
  "category": "Road",
  "location": {
    "address": "123 Test Street",
    "coordinates": {
      "latitude": 28.6139,
      "longitude": 77.2090
    }
  },
  "priority": "Medium"
}
```

### 2. Test Frontend App

1. Launch the Flutter app
2. Register a new account
3. Login
4. Create a complaint
5. View complaint list
6. Check complaint details

---

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
- Check if MongoDB is running
- Verify connection string in `.env`
- Check firewall settings
- For Atlas: Check IP whitelist

**Port Already in Use:**
- Change `PORT` in `.env`
- Or kill process using port 5000:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -ti:5000 | xargs kill
  ```

**JWT Secret Error:**
- Ensure `JWT_SECRET` is set in `.env`
- Use a strong random string

### Frontend Issues

**API Connection Failed:**
- Check if backend is running
- Verify `baseUrl` in `app_config.dart`
- For physical device: Use computer's IP address
- Check CORS settings in backend

**Google Maps Not Loading:**
- Verify API key is correct
- Check API key restrictions
- Ensure Maps SDK is enabled in Google Cloud Console
- Check platform-specific setup (Android/iOS)

**Build Errors:**
```bash
# Clean and rebuild
flutter clean
flutter pub get
flutter run
```

**Package Conflicts:**
```bash
# Update dependencies
flutter pub upgrade
```

---

## 📝 Next Steps

1. **Create Admin User:**
   - Register normally, then update role in MongoDB:
   ```javascript
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "Admin" } }
   )
   ```

2. **Test All Features:**
   - User registration/login
   - Create complaints
   - View complaints
   - Update status (as Officer/Admin)
   - Add comments
   - Upload photos

3. **Customize:**
   - Update app name, colors, theme
   - Add more complaint categories
   - Customize UI components

4. **Deploy (Optional):**
   - Backend: Heroku, Railway, or AWS
   - Frontend: Build APK/IPA or publish to stores

---

## ✅ Checklist

- [ ] Node.js installed
- [ ] MongoDB running (local or Atlas)
- [ ] Backend dependencies installed
- [ ] `.env` file created and configured
- [ ] Backend server running on port 5000
- [ ] Health check endpoint working
- [ ] Flutter SDK installed
- [ ] Frontend dependencies installed
- [ ] API base URL configured
- [ ] Google Maps API key configured
- [ ] App runs on device/emulator
- [ ] Can register/login
- [ ] Can create/view complaints

---

## 🆘 Need Help?

Refer to:
- **PROJECT_GUIDE.md** - Complete project documentation
- **README.md** - Project overview
- Backend README: `backend/README.md`
- Frontend README: `frontend/README.md`

---

**Happy Coding! 🚀**
