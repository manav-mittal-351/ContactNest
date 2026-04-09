# 🐦 ContactNest - Smart MERN Contact Manager

ContactNest is a production-ready, full-stack MERN application designed for seamless contact management with a premium, modern interface. It features complete user authentication, data isolation, and a beautifully themed dashboard.

## 🚀 Live Demo
- **Frontend**: [Coming Soon](http://localhost:3000)
- **Backend API**: [Coming Soon](http://localhost:5000)

## ✨ Features
- **Secure Authentication**: Signup and Login with JWT and encrypted passwords (bcryptjs).
- **Data Isolation**: Users only see and manage their own private contacts.
- **Full CRUD**: Create, Read, Update, and Delete contacts with ease.
- **Real-time Search**: Instant filtering across your entire directory.
- **Dark Mode**: Smooth toggle between light and dark themes with persistent storage.
- **Password Visibility**: Eye toggle for secure password entry.
- **Micro-animations**: Enhanced UX with toast notifications and smooth transitions.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Lucide Icons, React Hot Toast, Vanilla CSS.
- **Backend**: Node.js, Express.js (MVC Architecture).
- **Database**: MongoDB (Mongoose ODM).
- **Security**: JSON Web Tokens (JWT), Bcrypt.js.

## 📸 Screenshots
| Login (Light) | Login (Dark) | Dashboard |
| :---: | :---: | :---: |
| ![Login Light](./screenshots/login-light.png) | ![Login Dark](./screenshots/login-dark.png) | ![Dashboard](./screenshots/dashboard.png) |

## 📁 Project Structure
```text
ContactNest/
├── client/          # React (Vite) frontend application
│   ├── src/pages/   # Dashboard, Login, Signup
│   └── src/context/ # Auth & Theme management
├── server/          # Node.js Express backend
│   ├── models/      # MongoDB Schema definitions
│   ├── controllers/ # Route logic handlers
│   └── routes/      # API endpoint definitions
└── package.json     # Main scripts for concurrent execution
```

## ⚙️ Installation & Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/manav-mittal-351/Contacts-Management-System.git
   cd Contacts-Management-System
   ```
2. **Setup Server**
   ```bash
   cd server
   npm install
   # Create a .env file and add your MONGO_URI and JWT_SECRET
   ```
3. **Setup Client**
   ```bash
   cd ../client
   npm install
   ```
4. **Run Application** (from root)
   ```bash
   npm run dev
   ```

## 🔐 Environment Variables
Create a `.env` file in the `/server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

## 🚀 API Endpoints
- **AUTH**: `/api/auth/signup`, `/api/auth/login`, `/api/auth/user`
- **CONTACTS**: `/api/contacts` (GET, POST, PUT, DELETE)

## 👤 Author
**Manav Mittal**  
[GitHub Profile](https://github.com/manav-mittal-351)

---
Built with ❤️ by Manav Mittal
