
<div align="center">

# 🔐 TALA — Secure Credential Manager

**A full-stack password manager built with real-world security practices.**  
Store passwords, cards, API keys, and personal credentials — all behind a master password vault.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Open%20TALA-4F46E5?style=for-the-badge&logo=vercel)](https://tala-password-manager.vercel.app)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)

> ⚠️ **Demo Tip:** Use the demo account or register with a test email to explore the vault.

</div>

---


## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Master Password Vault | An extra layer of protection before accessing stored credentials |
| 🔑 Password Generator | Generate strong, customizable passwords instantly |
| 🧾 Multi-type Storage | Store passwords, cards, API keys, and personal info |
| 🔍 Search & Filter | Quickly find any saved credential |
| 🔗 Google Sign-In | One-click login via Firebase OAuth |
| 🍪 JWT + httpOnly Cookies | Secure, tamper-resistant session management |
| 📱 Responsive UI | Works seamlessly on desktop and mobile |

---

## 🔒 Security Architecture

TALA is built with a layered security model:

- **Password Hashing** — All user passwords are hashed with `bcrypt` before storage. Plain-text passwords never touch the database.
- **JWT with httpOnly Cookies** — Session tokens are stored in httpOnly cookies, making them inaccessible to JavaScript and safe from XSS attacks.
- **Encrypted Vault Data** — Sensitive credentials stored in the vault are encrypted before being saved to MongoDB Atlas.
- **Master Password Layer** — A separate master password gate protects the vault, independent of the login credentials.
- **Rate Limiting** — Login endpoint is rate-limited to prevent brute-force attacks.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** — Component-based UI
- **Tailwind CSS** — Utility-first styling
- **Axios** — HTTP client with interceptors
- **React Router** — Client-side routing

### Backend
- **Node.js + Express.js** — REST API server
- **MongoDB Atlas** — Cloud NoSQL database
- **JWT** — Stateless authentication tokens
- **bcrypt** — Password hashing library

### Auth & Deployment
- **Firebase** — Google OAuth integration
- **Vercel** — Frontend deployment
- **Render** — Backend deployment

---

## 📂 Project Structure

```
tala-password-manager/
├── client/               # React frontend (Vite)
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route-level pages
│   │   ├── hooks/        # Custom React hooks
│   │   └── utils/        # Helper functions
│   └── .env.example
│
└── server/               # Express backend
    ├── routes/           # API route handlers
    ├── middleware/        # Auth, rate limiting, error handling
    ├── models/            # Mongoose schemas
    ├── controllers/       # Business logic
    └── .env.example
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Firebase project (for Google Auth)

### 1. Clone the repository

```bash
git clone https://github.com/anantbarjatya/tala-password-manager.git
cd tala-password-manager
```

### 2. Install dependencies

```bash
# Backend
npm install

# Frontend
cd client && npm install
```

### 3. Configure environment variables

**Backend** — create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_jwt_secret
CLIENT_URL=http://localhost:5173
```

**Frontend** — create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
```

### 4. Run the project

```bash
# Terminal 1 — Backend
npm run server

# Terminal 2 — Frontend
cd client && npm run dev
```

App runs at `http://localhost:5173`

---

## 🧠 What I Learned Building This

TALA started as a challenge to go beyond basic CRUD apps and understand how real-world authentication and security works in production.

Key learnings:
- Implementing end-to-end security — from bcrypt hashing to encrypted vault storage
- Managing JWT sessions with httpOnly cookies and handling token expiry
- Integrating Firebase OAuth alongside a custom auth system
- Debugging CORS, cookie behavior, and environment mismatches in production
- Deploying a split frontend/backend architecture (Vercel + Render)

---

## 🗺️ Roadmap

- [ ] Guest demo mode (try without registering)
- [ ] Two-factor authentication (TOTP)
- [ ] Browser extension with autofill support
- [ ] Account deletion & data export
- [ ] Security activity log
- [ ] Import passwords from Chrome / LastPass

---

## 👨‍💻 Author

**Anant Barjatya**  
Full Stack Developer | Data Science Student

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat&logo=linkedin)](https://www.linkedin.com/in/anant-barjatya-1340b627b/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=flat&logo=github)](https://github.com/anantbarjatya)

---

<div align="center">

⭐ **If you found this useful, give it a star!** ⭐  
*It motivates me to keep building and improving.*

</div>