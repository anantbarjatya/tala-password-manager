````md
# 🔐 TALA — Secure Credential Manager

<p align="center">
  A modern full-stack password manager built with security-first principles.  
  Store credentials, cards, and sensitive data in one secure vault.
</p>

<p align="center">
  <a href="https://tala-password-manager.vercel.app"><img src="https://img.shields.io/badge/Live-Demo-success?style=for-the-badge&logo=vercel" /></a>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
</p>

---

## 🌐 Live Demo

👉 **Try the App:** https://tala-password-manager.vercel.app

---

## 🚀 Features

- Secure user authentication
- Email & Password login
- Google Sign-In using Firebase
- Master Password protected vault
- Store credentials, cards, notes, and API keys
- Search and filter saved data
- Password generator
- Responsive modern UI
- Secure logout and session handling
- Production deployment

---

## 🔒 Security Highlights

TALA was built to understand real-world security in modern web applications.

- User passwords are hashed using **bcrypt**
- JWT authentication stored in **httpOnly cookies**
- Sensitive vault data encrypted before storage
- Separate **Master Password** layer for vault access
- Rate limiting to reduce brute-force attacks
- Protected routes and user-level data isolation

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- JWT
- bcrypt

### Authentication
- Firebase Google Auth

### Deployment
- Vercel (Frontend)
- Render (Backend)

---

## 📂 Project Structure

```bash
client/   # Frontend
server/   # Backend
````

---

## ⚙️ Run Locally

### 1. Clone Repository

```bash
git clone https://github.com/anantbarjatya/tala-password-manager.git
cd tala-password-manager
```

### 2. Install Dependencies

```bash
npm install
cd client
npm install
```

### 3. Setup Environment Variables

Create `.env` files inside frontend and backend folders.

#### Backend `.env`

```env
PORT=
MONGO_URI=
JWT_SECRET=
CLIENT_URL=
```

#### Frontend `.env`

```env
VITE_API_URL=
VITE_FIREBASE_API_KEY=
```

### 4. Start Project

Backend:

```bash
npm run server
```

Frontend:

```bash
cd client
npm run dev
```

---

## 💡 Why I Built This

TALA was built to explore end-to-end security in web apps — from authentication flows and encrypted storage to deployment and real production debugging.

Instead of creating another basic CRUD project, I wanted to build something practical that solves a real user problem.

---

## 📈 Future Improvements

* Guest demo mode
* Delete account feature
* Browser extension
* Autofill support
* Two-factor authentication
* Security activity logs

---

## 👨‍💻 Author

**Anant Barjatya**
Full Stack Developer | Data Science Student

🔗 LinkedIn: [https://www.linkedin.com/in/anant-barjatya-1340b627b/](https://www.linkedin.com/in/anant-barjatya-1340b627b/)

---

## ⭐ Support

If you liked this project, consider giving it a star on GitHub.

```
::contentReference[oaicite:0]{index=0}
```
