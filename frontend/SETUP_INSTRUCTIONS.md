# JAN SUVIDHA - React Frontend Setup Instructions

## 🚀 Quick Start

### Step 1: Install Dependencies
```bash
cd frontend-react
npm install
```

### Step 2: Configure Environment
Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

Edit `.env` and set your backend URL:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Start Development Server
```bash
npm run dev
```

The app will run on `http://localhost:3000`

### Step 4: Build for Production
```bash
npm run build
```

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on port 5000

## 🔗 Backend Connection

Make sure your backend is running before starting the frontend:
```bash
# In backend directory
npm run dev
```

## 📁 Project Structure Explained

### **src/components/**
Reusable UI components used across multiple pages:
- `Navbar.jsx`: Top navigation bar (shows on all pages)
- `PrivateRoute.jsx`: Protects routes that need authentication
- `Loading.jsx`: Loading spinner
- `ErrorMessage.jsx`: Error message display

### **src/pages/**
Full page components (screens):
- `auth/`: Login and Register pages
- `complaints/`: All complaint-related pages
- `Dashboard.jsx`: Home page after login
- `Profile.jsx`: User profile page

### **src/context/**
State management using Context API:
- `AuthContext.jsx`: Manages user authentication state
- `ComplaintContext.jsx`: Manages complaint data

### **src/services/**
API communication layer:
- `api.js`: Base Axios configuration
- `authService.js`: Authentication API calls
- `complaintService.js`: Complaint API calls

## 🎯 How It Works

### **1. Authentication Flow**
```
User → Login Page → AuthContext.login() → API Call → Store Token → Redirect to Dashboard
```

### **2. Complaint Creation Flow**
```
User → Create Complaint Page → Fill Form → ComplaintContext.createComplaint() → API Call → Update State → Redirect
```

### **3. State Management**
- **AuthContext**: Stores user data and authentication status
- **ComplaintContext**: Stores complaints list and current complaint
- Components access state via hooks: `useAuth()`, `useComplaint()`

## 🔐 Authentication

- Token stored in `localStorage`
- Automatically added to all API requests
- Protected routes redirect to login if not authenticated

## 🎨 Styling

- Global styles in `src/styles/index.css`
- Component-specific styles in component folders
- CSS variables for easy theming
- Responsive design included

## 🐛 Troubleshooting

### **API Connection Error**
- Check if backend is running on port 5000
- Verify `VITE_API_URL` in `.env` file
- Check CORS settings in backend

### **Authentication Issues**
- Clear localStorage: `localStorage.clear()`
- Check token in browser DevTools → Application → Local Storage
- Verify backend JWT_SECRET is set

### **Build Errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Key Files to Understand

1. **App.jsx**: Main app component with routing
2. **AuthContext.jsx**: Authentication state management
3. **ComplaintContext.jsx**: Complaint state management
4. **api.js**: API configuration and interceptors
5. **PrivateRoute.jsx**: Route protection

## 🎓 For Viva

### **Explain Architecture:**
- Component-based structure
- Context API for state management
- Service layer for API calls
- Private routes for security

### **Show Code Flow:**
- User action → Component → Context → Service → API → Backend
- State update → Component re-render

### **Key Features:**
- Clean code structure
- Reusable components
- Centralized state management
- Error handling
- Responsive design

---

**Ready to use!** Start the backend, then start the frontend, and you're good to go! 🚀
