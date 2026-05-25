# 🔐 Authentication API System

A secure and scalable authentication API built with Node.js, Express, and JWT.  
This project demonstrates modern backend engineering practices including authentication, authorization, password hashing, and role-based access control.

---

## 🚀 Features

- User registration & login
- JWT authentication (Access + Refresh tokens)
- Password hashing using bcrypt
- Role-based access control (User / Admin)
- Protected routes middleware
- Token refresh mechanism
- Clean layered architecture (controllers, services, middleware)
- Environment-based configuration

---

## 🧠 Tech Stack

- Node.js
- Express.js
- MongoDB / PostgreSQL (choose one)
- JWT (JSON Web Tokens)
- bcrypt
- dotenv

---

## 📁 Project Structure

- src -> (config, controllers, middleware, models, routes, services, utils, app.js, server.js)
- tests -> (auth.test.js)
- env
- env.example
- .gitignore
- README

---

## 🔐 Authentication Flow

1. User registers → password is hashed
2. User logs in → server validates credentials
3. Server issues:
   - Access Token (short-lived)
   - Refresh Token (long-lived)
4. Access token used for protected routes
5. Refresh token used to generate new access token

---

## 📌 API Endpoints

### Auth Routes

POST/api/auth/register
POST/api/auth/login
POST/api/auth/refresh
POST/api/auth/logout

## User Routes

GET/api/users/profile
PUT/api/users/profile

## Admin Routes

GET/api/admin/users
DELETE/api/admin/users/:id

---

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- HTTP-only cookie support (optional upgrade)
- Role-based authorization middleware
- Input validation (planned)

---

## ⚙️ Setup Instructions

```bash
# Clone repo
git clone <https://github.com/Agent610/Authentication-API>

# Install dependencies
npm install

# Create environment variables
cp .env.example .env

# Run server
npm run dev
```
