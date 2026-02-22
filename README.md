# Task Management Full-Stack Application

A scalable REST API and React frontend application for managing tasks, built carefully to demonstrate fundamental backend and frontend principles.

## Features
- **Backend**: Node.js, Express, MongoDB
- **Security**: JWT Authentication, bcrypt password hashing
- **Role-Based Access**: `user` and `admin` roles
- **Swagger Documentation**: Integrated API documentation
- **Frontend**: React (Vite), Context API for state management, Axios

---

## Folder Structure
```
project-root/
│
├── backend/                  # Express API Server
│   ├── .env                  # Environment Variables
│   ├── src/
│   │   ├── config/           # DB & Swagger configuration
│   │   ├── controllers/      # Route handlers
│   │   ├── middleware/       # Auth & Error handling
│   │   ├── models/           # Mongoose Schemas
│   │   └── routes/           # Express Routes
│   └── server.js             # Entry Point
│
└── frontend/                 # Vite React App
    ├── src/
    │   ├── api.js            # Axios Config
    │   ├── components/       # Reusable UI (Navbar, ProtectedRoute)
    │   ├── context/          # AuthContext
    │   └── pages/            # Login, Register, Dashboard
    └── index.html
```

---

## Setup Instructions

### 1. Prerequisites
- Node.js installed
- Running MongoDB instance (locally via port 27017)

### 2. Backend Setup
Navigate into the `backend` folder:
```bash
cd backend
npm install
```

Make sure the `.env` file exists with:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskapp
JWT_SECRET=supersecretjwtkey_12345
JWT_EXPIRE=1h
NODE_ENV=development
```

Run the server:
```bash
npm run dev
```

### 3. Frontend Setup
Navigate into the `frontend` folder:
```bash
cd frontend
npm install
```

Run the React app:
```bash
npm run dev
```

---

## API Documentation Links
Once the backend is running, you can view the Swagger UI documentation at:
**[http://localhost:5000/api-docs](http://localhost:5000/api-docs)**

---

## Scalability Notes
- **Folder Structure**: Controllers, routes, and services (currently within controllers) are separated, making it easy to mock out database calls or add a dedicated services layer in the future.
- **Centralized Error Handling**: Ensures all API endpoints return consistent error responses, and avoids duplicate error logic scattered across controllers.
- **API Versioning**: Enforcing the `/api/v1` prefix means future breaking changes can be pushed to `/api/v2` without disrupting existing clients.

## Deployment Suggestions
- **Backend (Render/Heroku)**: Add process.env.MONGO_URI for your MongoDB Atlas connection. Inject JWT secrets securely via dashboard.
- **Frontend (Vercel/Netlify)**: Update the `api.js` baseURL to point strictly to the deployed backend URL instead of localhost. Combine the Vite build dir if aiming for a unified Express delivery, or deploy decoupled for best performance.
