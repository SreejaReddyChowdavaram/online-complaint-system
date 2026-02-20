# 🏛️ Online Complaint Management System

A Full Stack Civic Complaint Management Web Application built using React.js and Tailwind CSS for the frontend and MongoDB Atlas for secure data storage.

---

## 🎯 Project Overview

The **Online Complaint Management System** is a civic grievance redressal platform that allows citizens to register and track complaints related to public infrastructure such as roads, water supply, electricity, and sanitation.

The system provides structured workflows and role-based dashboards for Citizens, Officers, and Admins to ensure efficient complaint resolution.

---

## 🏗️ System Architecture

- **Frontend**: React.js + Tailwind CSS  
- **Backend**: API-based architecture  
- **Database**: MongoDB Atlas  
- **Authentication**: Role-Based Access Control  
- **API Communication**: Axios  

---

## 📁 Project Structure

```
ONLINE-COMPLAINT-SYSTEM/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── assets/
│   │   └── styles/
│
└── README.md
```

---

## 🚀 Key Features

- ✅ User Registration & Login
- ✅ Role-Based Authentication (Citizen, Officer, Admin)
- ✅ Complaint Creation & Management
- ✅ Complaint Status Tracking (Pending, In Progress, Resolved)
- ✅ Image Upload Support
- ✅ Secure Database Integration
- ✅ Responsive UI with Tailwind CSS
- ✅ Protected Routes

---

## 👥 User Roles

### 👤 Citizen
- Register and Login
- Submit Complaints
- Upload Supporting Images
- Track Complaint Status
- View Complaint History

### 🧑‍💼 Officer
- Login to Dashboard
- View Assigned Complaints
- Update Complaint Status
- Manage Profile

### 🛡️ Admin
- Manage Users
- Manage Officers
- View All Complaints
- Monitor System Activity

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js |
| Styling | Tailwind CSS |
| Database | MongoDB Atlas |
| State Management | Context API |
| API Handling | Axios |
| Version Control | Git & GitHub |

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/SreejaReddyChowdavaram/online-complaint-system.git
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file inside backend folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Security Features

- Role-Based Access Control
- Protected Routes
- Environment Variable Protection
- Secure Authentication Flow
- Input Validation

---

## 🌍 Future Enhancements

- Email Notifications
- Complaint Priority System
- Real-Time Updates
- Admin Analytics Dashboard
- Cloud Deployment (Vercel / Render)

---

## 🎓 Academic Highlights

This project demonstrates:

- Full Stack Web Development
- MVC-Based Backend Structure
- RESTful API Design
- Authentication & Authorization
- Database Schema Design
- Real-World Civic Problem Solving

---

## 👩‍💻 Author

**Sreeja Reddy Chowdavaram**  
Computer Science & Engineering Student  
Full Stack Developer  

---
