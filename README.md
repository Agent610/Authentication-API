# 🔐 Authentication API System

A production-style authentication and authorization API built with Node.js, Express, MongoDB, and JWT.

This project demonstrates secure backend engineering practices including JWT authentication, refresh token handling, role-based access control, password reset workflows, email verification, rate limiting, and layered backend architecture.

## Features

## Authentication & Authorization

- User registration and login
- JWT access token authentication
- Refresh token workflow
- Secure logout system
- Protected routes middleware
- Role-based access control (RBAC)

## Security Features

- Password hashing with bcrypt
- HTTP-only refresh token cookies
- Rate limiting protection
- Input validation with Zod
- Secure token verification
- Environment variable configuration

## User Account Features

- Email verification workflow
- Forgot password functionality
- Password reset system
- User profile endpoint

## Backend Architecture

- Modular MVC-inspired structure
- Controllers / Services / Middleware separation
- Centralized environment configuration
- Reusable utility functions
- Error handling middleware

## API Documentation

- Swagger/OpenAPI documentation support

## Tech Stack

## Backend

- Node.js
- Express.js

## Database

- MongoDB
- Mongoose

## Autentication & Security

- JWT (JSON Web Tokens)
- bcrypt
- express-rate-limit
- cookie-parser

## Validation & Utilities

- Zod
- dotenv

## Email Services

- Nodemailer

## Documentation & Testing

- Swagger UI Express
- Jest
- Supertest

## Project Structure

- src -> (config, controllers, middleware, models, routes, services, utils, app.js, server.js)
- tests -> (auth.test.js)
- env
- env.example
- .gitignore
- README

## Authentication Flow

1. User registers an account → password is hashed using bcrypt
2. Verification email is generated
3. User logs in → server validates credentials
4. Server issues:
   - Access Token (short-lived)
   - Refresh Token (long-lived)
5. Access token used for protected routes
6. Refresh token used to generate new access token

## API Endpoints

### Auth Routes

POST/api/auth/register
POST/api/auth/login
POST/api/auth/refresh
POST/api/auth/logout
POST/api/forgot-password
POST/api/reset-password/:token
GET/api/auth/verify-email/:token

## User Routes

GET/api/users/profile
PUT/api/users/profile

## Admin Routes

GET/api/admin/users
DELETE/api/admin/users/:id

## Security Features

- JWT authentication with refresh token support
- Password hashing using bcrypt
- Role-based authorization middleware
- Rate limiting against brute-force attacks
- HTTP-only cookie handling
- Validation layer for request protection
- Secure environment variable management

## Setup Instructions

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

## Future Improvements

- OAuth Authentication (Google/GitHub)
- Docker containerization
- CI/CD pipeline integration
- Redis token blacklisting
- Multi-factor authentication (MFA)
- Production deployment with Render + MongoDB Atlas

## Author

Devin Bhavsar
Software Engineer focused on backend development, authentication systems, APIs, and scalable web applications
