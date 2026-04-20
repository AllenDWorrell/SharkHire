# SharkHire 🦈

SharkHire is a web-based platform designed to centralize student employment opportunities at Nova Southeastern University, allowing students to browse jobs, apply, and track application statuses while enabling employers to manage listings and applicants.

---

## Features

- Browse Nova Student Employment (NSE) and Federal Work-Study (FWS) job listings
- Student registration, login, and application tracking
- Employer dashboard for posting and managing job listings
- Role-based access for students and employers

---

## Tech Stack

| Layer     | Technology          |
|-----------|---------------------|
| Frontend  | React (Vite), React Router, CSS |
| Backend   | Node.js, Express.js |
| Database  | MongoDB (Mongoose)  |

---

## Installation

### Prerequisites

- Node.js (v18+)
- npm

### Backend

```bash
cd backend
npm install
npm run dev
```

The API will start on **http://localhost:5000**.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will start on **http://localhost:5173**.

---

## Project Structure

```
sharkhire/
│
├── backend/
│   ├── config/
│   │   └── db.js                  
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   └── applicationController.js
│   ├── middleware/
│   │   └── authMiddleware.js      
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   └── Application.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   └── applicationRoutes.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── JobCard.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   └── EmployerDashboard.jsx
│   │   ├── services/
│   │   │   └── api.js            
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

