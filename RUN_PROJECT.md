# 🚀 JAN SUVIDHA - Quick Start Commands

## 📋 Prerequisites Check

### Check Node.js Installation
```bash
node --version
# Should be v14 or higher
```

### Check MongoDB Installation
```bash
# Windows
mongod --version

# Mac/Linux
mongod --version
```

### Check Flutter Installation
```bash
flutter --version
# Should be v3.0 or higher
```

### Check Flutter Doctor
```bash
flutter doctor
```

---

## 🔧 Backend Setup & Run

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create .env File
```bash
# Windows PowerShell
Copy-Item env.template .env

# Windows CMD
copy env.template .env

# Mac/Linux
cp env.template .env
```

### Step 4: Edit .env File
Open `.env` file and update these values:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A strong random string (min 32 characters)
- `GOOGLE_MAPS_API_KEY` - Your Google Maps API key (optional for basic testing)

**Quick .env setup (minimum required):**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jan-suvidha
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-characters
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:3000
GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

### Step 5: Create Uploads Directory
```bash
# Windows PowerShell
New-Item -ItemType Directory -Path uploads

# Windows CMD
mkdir uploads

# Mac/Linux
mkdir uploads
```

### Step 6: Start MongoDB (if using local MongoDB)
```bash
# Windows (if MongoDB is installed as service)
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
# OR
mongod
```

### Step 7: Run Backend Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

**Expected Output:**
```
MongoDB Connected: localhost
Server is running on port 5000
Environment: development
```

### Step 8: Test Backend (in new terminal)
```bash
# Test health endpoint
curl http://localhost:5000/health

# Or open in browser
# http://localhost:5000/health
```

---

## 📱 Frontend Setup & Run

### Step 1: Navigate to Frontend Directory
```bash
# From project root
cd frontend
```

### Step 2: Install Flutter Dependencies
```bash
flutter pub get
```

### Step 3: Update API Configuration (if needed)
Edit `lib/config/app_config.dart`:
- For **Android Emulator**: Keep `http://localhost:5000/api`
- For **iOS Simulator**: Keep `http://localhost:5000/api`
- For **Physical Device**: Change to `http://YOUR_COMPUTER_IP:5000/api`

**To find your computer's IP:**
```bash
# Windows
ipconfig
# Look for IPv4 Address

# Mac/Linux
ifconfig
# OR
ip addr
```

### Step 4: Check Available Devices
```bash
flutter devices
```

### Step 5: Run Flutter App
```bash
# Run on default device
flutter run

# Run on specific device
flutter run -d <device-id>

# Run on Android
flutter run -d android

# Run on iOS
flutter run -d ios

# Run on Chrome (Web)
flutter run -d chrome
```

### Step 6: Hot Reload (while app is running)
Press `r` in terminal to hot reload
Press `R` to hot restart

---

## 🎯 Complete Setup in One Go

### Backend (Terminal 1)
```bash
cd backend
npm install
copy env.template .env
mkdir uploads
# Edit .env file with your values
npm run dev
```

### Frontend (Terminal 2)
```bash
cd frontend
flutter pub get
flutter run
```

---

## 🧪 Quick Test Commands

### Test Backend API
```bash
# Health check
curl http://localhost:5000/health

# Register user (using curl)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"phone\":\"1234567890\",\"password\":\"password123\"}"

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

---

## 🐛 Troubleshooting Commands

### Backend Issues

**Port already in use:**
```bash
# Windows - Find process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill
```

**MongoDB connection error:**
```bash
# Check if MongoDB is running
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl status mongod
```

**Clear node_modules and reinstall:**
```bash
cd backend
rm -rf node_modules
rm package-lock.json
npm install
```

### Frontend Issues

**Flutter clean and rebuild:**
```bash
cd frontend
flutter clean
flutter pub get
flutter run
```

**Check Flutter doctor:**
```bash
flutter doctor -v
```

**Update Flutter packages:**
```bash
flutter pub upgrade
```

**Check for device connection:**
```bash
flutter devices
adb devices  # For Android
```

---

## 📝 Important Notes

1. **Backend must be running** before starting frontend
2. **MongoDB must be running** before starting backend
3. For **physical device testing**, ensure phone and computer are on same network
4. **Android Emulator** can use `localhost` or `10.0.2.2`
5. **iOS Simulator** can use `localhost`
6. **Physical devices** need your computer's IP address

---

## ✅ Success Checklist

- [ ] Node.js installed and working
- [ ] MongoDB running (local or Atlas)
- [ ] Backend dependencies installed (`npm install`)
- [ ] `.env` file created and configured
- [ ] Backend server running on port 5000
- [ ] Health endpoint responding (`/health`)
- [ ] Flutter SDK installed
- [ ] Frontend dependencies installed (`flutter pub get`)
- [ ] Flutter app running on device/emulator
- [ ] Can register/login in app
- [ ] Can create/view complaints

---

## 🎉 You're All Set!

Once both backend and frontend are running:
1. Open the Flutter app
2. Register a new account
3. Login
4. Create a complaint
5. View your complaints

**Happy Coding! 🚀**
