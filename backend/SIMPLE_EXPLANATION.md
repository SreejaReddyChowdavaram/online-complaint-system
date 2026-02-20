# JAN SUVIDHA - Backend Explained Simply

## 🎯 What is This?

This is the **backend** (server-side) of Jan Suvidha - a system that lets people report problems like potholes, water issues, etc. The backend stores data, checks who's logged in, and sends information to the mobile app.

**Think of it like:**
- A restaurant kitchen (backend) that prepares food (data) when customers (mobile app) order
- A library system that stores books (complaints) and checks membership cards (authentication)

---

## 📁 Folder Structure - What Each Folder Does

### `config/` - Settings
**What it does:** Contains configuration files, like database connection settings.

**Simple example:** Like a settings menu on your phone - it stores how to connect to the database.

---

### `controllers/` - The Workers
**What it does:** Functions that handle requests. When someone wants to create a complaint, the controller does the work.

**Simple example:** Like waiters in a restaurant - they take your order (request), talk to the kitchen (database), and bring you food (response).

**Files:**
- `authController.js` - Handles login, register, password changes
- `complaintController.js` - Handles creating, viewing, updating complaints
- `userController.js` - Handles user profile operations

---

### `middleware/` - Security Guards
**What it does:** Functions that check things before allowing requests to proceed.

**Simple example:** Like security guards at a building entrance - they check your ID (JWT token) before letting you in.

**Files:**
- `auth.js` - Checks if user is logged in and has the right role
- `errorHandler.js` - Catches errors and sends nice error messages
- `notFound.js` - Handles when someone visits a page that doesn't exist

---

### `models/` - Data Blueprints
**What it does:** Defines what data looks like in the database. Like a form template.

**Simple example:** Like a form you fill out - it says "Name: ___, Email: ___, etc." The model defines what fields exist and what rules they follow.

**Files:**
- `User.js` - What a user looks like (name, email, role, etc.)
- `Complaint.js` - What a complaint looks like (title, description, status, etc.)

---

### `routes/` - The Phone Book
**What it does:** Maps URLs to controller functions. When someone visits `/api/complaints`, it knows which function to call.

**Simple example:** Like a phone book - you look up a name (URL) and find the number (controller function).

**Files:**
- `authRoutes.js` - Routes for login, register (`/api/auth/*`)
- `complaintRoutes.js` - Routes for complaints (`/api/complaints/*`)
- `userRoutes.js` - Routes for users (`/api/users/*`)

---

### `services/` - Specialized Workers
**What it does:** Contains complex business logic separated from controllers. Keeps code clean and organized.

**Simple example:** Like specialized workers - while controllers are general workers, services handle specific complex tasks.

**Files:**
- `authService.js` - Complex authentication logic
- `complaintService.js` - Complex complaint processing logic
- `userService.js` - Complex user management logic

---

### `validators/` - Quality Checkers
**What it does:** Checks if incoming data is correct before processing it.

**Simple example:** Like a bouncer checking IDs - makes sure the data is valid before letting it into the system.

**Files:**
- `authValidator.js` - Validates login/register data
- `complaintValidator.js` - Validates complaint data

---

### `utils/` - Helper Tools
**What it does:** Reusable helper functions used throughout the app.

**Simple example:** Like a toolbox with useful tools that everyone can use.

---

## 🏗️ MVC Architecture - Explained Simply

**MVC** = **Model-View-Controller**

### Model (Data)
- **Location:** `models/` folder
- **What it does:** Defines what data looks like and how to store it
- **Simple example:** Like a form template - defines what fields exist

### View (Output)
- **What it does:** In our case, JSON responses (not HTML pages)
- **Simple example:** The formatted data sent back to the mobile app

### Controller (Logic)
- **Location:** `controllers/` folder
- **What it does:** Handles requests, gets data from models, sends responses
- **Simple example:** The worker that coordinates everything

**Flow:**
```
Request → Route → Controller → Model → Database
                                    ↓
Response ← Controller ← Model ← Database
```

---

## 🔐 JWT Authentication - Explained Simply

**JWT** = **JSON Web Token**

### What is it?
A secure way to prove you're logged in without storing sessions on the server.

### How it works:
1. **Login:** User enters email and password
2. **Verification:** Server checks if credentials are correct
3. **Token Creation:** Server creates a JWT token (like an ID card)
4. **Token Storage:** Client stores token (like keeping an ID card in wallet)
5. **Future Requests:** Client sends token with every request
6. **Verification:** Server checks token before allowing access

### Simple Analogy:
Like a concert wristband:
- You get it at the entrance (login)
- You wear it (store it)
- Security checks it at different areas (middleware)
- It expires after the event (token expiration)

---

## 👥 Role-Based Access - Explained Simply

Three types of users with different permissions:

### 1. Citizen (Default)
**What they can do:**
- Create complaints
- View their own complaints
- Update their own complaints
- Add comments to their own complaints

**Simple example:** Like a regular customer - can order food, but can't access the kitchen.

---

### 2. Officer
**What they can do:**
- Everything a Citizen can do
- View ALL complaints
- Update complaints assigned to them
- Change complaint status
- Add comments to any complaint

**Simple example:** Like a waiter - can see all orders and update them, but can't change restaurant settings.

---

### 3. Admin
**What they can do:**
- Everything Officers can do
- View all users
- Delete users
- Delete complaints
- Assign officers to complaints
- Change any complaint

**Simple example:** Like a restaurant manager - can do everything, including managing staff and settings.

---

## 📊 Complaint Lifecycle - Explained Simply

Complaints go through different stages:

### 1. Pending (Default)
- Complaint just created
- Waiting for someone to start working on it
- Like a package that just arrived at the post office

### 2. In Progress
- Someone (Officer) is working on it
- Like a package that's on the delivery truck

### 3. Resolved
- Problem is fixed
- Complaint is closed
- Like a package that was successfully delivered

### 4. Rejected
- Complaint is invalid or duplicate
- Won't be fixed
- Like a package that was returned (wrong address)

**Flow:**
```
Pending → In Progress → Resolved
   ↓
Rejected
```

---

## 🔄 How a Request Works - Step by Step

### Example: Creating a Complaint

1. **User Action**
   - User fills form in mobile app and clicks "Submit"

2. **Request Sent**
   - Mobile app sends: `POST /api/complaints` with data and token

3. **Route Matches**
   - Express sees `/api/complaints` and routes to complaint controller

4. **Security Check (Middleware)**
   - Checks if user is logged in (has valid token)
   - Checks if user has permission (is Citizen)

5. **Validation**
   - Checks if data is correct (title, description provided)

6. **Controller Works**
   - Gets data from request
   - Calls service/model to save complaint

7. **Database Save**
   - Complaint saved to MongoDB

8. **Response Sent**
   - Server sends back: "Complaint created successfully!"

9. **Mobile App Updates**
   - App shows success message
   - User sees their new complaint

**Simple Analogy:**
Like ordering pizza:
1. You call (send request)
2. They check if you're a member (authentication)
3. They verify your order (validation)
4. Kitchen makes pizza (controller/model)
5. Pizza is stored in system (database)
6. You get confirmation (response)

---

## 📝 Mongoose Models - Explained Simply

### User Model
**What it stores:**
- Name, email, phone, password
- Role (Citizen/Officer/Admin)
- Address
- Account status

**Special features:**
- Automatically encrypts passwords before saving
- Can check if a password matches

**Simple example:** Like a user registration form that automatically encrypts passwords.

---

### Complaint Model
**What it stores:**
- Title, description, category
- Location (address + GPS coordinates)
- Status (Pending/In Progress/Resolved/Rejected)
- Priority (Low/Medium/High/Urgent)
- Who submitted it (links to User)
- Who's assigned to fix it (links to User)
- Photos/attachments
- Comments/messages
- Resolution notes

**Special features:**
- Automatically sets status to "Pending" when created
- Links to User model for submittedBy and assignedTo
- Has indexes for faster searching

**Simple example:** Like a detailed complaint form with all the information about a problem.

---

## 🛣️ API Routes - Quick Reference

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Sign in
- `GET /api/auth/me` - Who am I?
- `PUT /api/auth/updatepassword` - Change password

### Complaints
- `GET /api/complaints` - See all complaints
- `GET /api/complaints/:id` - See one complaint
- `POST /api/complaints` - Create complaint (Citizens only)
- `PUT /api/complaints/:id` - Update complaint
- `DELETE /api/complaints/:id` - Delete complaint (Admin only)
- `POST /api/complaints/:id/comments` - Add comment

### Users
- `GET /api/users/me` - My profile
- `GET /api/users` - All users (Admin only)
- `GET /api/users/:id` - One user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

---

## 🔒 Security Features

1. **Password Hashing**
   - Passwords are encrypted before storing
   - Even if database is hacked, passwords are safe

2. **JWT Tokens**
   - Secure way to verify users
   - Tokens expire after 30 days

3. **Role-Based Access**
   - Different permissions for different roles
   - Prevents unauthorized actions

4. **Input Validation**
   - All data is checked before processing
   - Prevents bad data from entering system

5. **Error Handling**
   - Errors are caught and handled gracefully
   - Users get helpful error messages

**Simple Analogy:**
Like a secure building:
- Locked doors (authentication)
- Security guards (middleware)
- ID checks (validation)
- Different access levels (roles)

---

## 🎯 Key Takeaways

1. **MVC Pattern:** Organizes code into Models (data), Views (responses), Controllers (logic)

2. **JWT Authentication:** Secure way to verify users are logged in

3. **Role-Based Access:** Different users have different permissions (Citizen, Officer, Admin)

4. **Complaint Lifecycle:** Complaints move through statuses (Pending → In Progress → Resolved)

5. **Middleware:** Security guards that check permissions before allowing access

6. **Models:** Blueprints that define what data looks like

7. **Controllers:** Workers that handle requests and send responses

8. **Routes:** Maps URLs to controller functions

---

## 📚 Summary in One Sentence Each

- **Backend:** The server that stores data and handles requests from the mobile app
- **MVC:** A way to organize code into data (Model), output (View), and logic (Controller)
- **JWT:** A secure token that proves you're logged in
- **Middleware:** Security guards that check permissions
- **Models:** Blueprints that define what data looks like
- **Controllers:** Functions that handle requests
- **Routes:** Maps URLs to functions
- **Role-Based Access:** Different permissions for different user types
- **Complaint Lifecycle:** The stages a complaint goes through (Pending → In Progress → Resolved)

---

## 🚀 Getting Started

1. Install dependencies: `npm install`
2. Set up `.env` file with database URL and JWT secret
3. Start server: `npm run dev`
4. Server runs on `http://localhost:5000`

For detailed setup, see `SETUP_GUIDE.md`
