# Mini SaaS Admin Dashboard

A production-ready Admin Dashboard built with React, Node.js, Express, and PostgreSQL, designed to manage users, configurations, and system activity with secure authentication and role-based access control.

This project focuses on backend correctness, database design, and real-world admin workflows, rather than UI gimmicks.

---

## 🎥 Live Demo & Video Walkthrough

### 🌐 Live Application
- **Frontend (Vercel)**: [https://mini-saas-admin-dashboard.vercel.app](https://mini-saas-admin-dashboard.vercel.app)
- **Backend API (Render)**: [https://mini-saas-admin-dashboard.onrender.com](https://mini-saas-admin-dashboard.onrender.com)

### 📹 Full Feature Demo (3 min)
**https://drive.google.com/file/d/13RR2rJiGang0VgEZqsDv3amU9tMaeRmU/view?usp=sharing**

*Complete demonstration covering:*
- 🔐 **Authentication** - JWT-based login flow
- 👤 **User Management** - Edit profiles, change roles, toggle status
- 🖼️ **Avatar Upload** - File handling with Cloudinary integration
- ⚙️ **Configuration Management** - Add/edit system configs
- 📋 **Audit Logging** - Real-time tracking of admin actions

> ⚠️ **Note**: Backend uses free PostgreSQL instance which may spin down after inactivity. Full database schema provided for local setup.

---

## 🧠 Core Features (Implemented)

### 🔐 Authentication & Authorization
- JWT-based authentication with secure token management
- Password hashing using bcrypt (salt rounds: 10)
- Role-based access control (admin, user)
- Protected routes via middleware
- Self-deletion protection for admins

### 👤 User Management (Admin Only)
- View all users with pagination & filters
- Search by name or email
- Change user roles (Admin ↔ User)
- Toggle user status (Active / Inactive)
- Edit user profiles
- Delete users (with confirmation)
- Avatar upload and management

### 📝 Audit Logging (Enterprise Feature)
- Tracks all admin actions automatically
  - User updates (role, status, profile)
  - User deletions
  - Configuration changes
- Stored in dedicated `audit_logs` table
- Linked to performing user
- Filterable by entity type and user
- Timestamp tracking

### ⚙️ Configuration Management
- Manage application settings (key-value pairs)
- Enable/disable configurations dynamically
- Categorized settings (General, Email, etc.)
- CRUD operations for configs
- Used for feature flags and system settings

### 🗂️ File & Avatar Handling
- Secure avatar upload endpoint
- Cloudinary integration for image storage
- File metadata stored in database
- Image optimization and CDN delivery
- Profile picture management

---

## 🛠️ Tech Stack

### Frontend
- **React** (Vite) - Fast, modern build tool
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **React Router** - Client-side routing

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Cloudinary** - Image hosting

### Infrastructure
- **Render** - Backend hosting + PostgreSQL database
- **Vercel** - Frontend hosting

---

## 🗄️ Database Schema

### Tables
- **users** - User accounts with roles and status
- **audit_logs** - Activity tracking for compliance
- **configurations** - Application settings
- **files** (optional) - File metadata storage

**Full schema available in:** `schema.sql`

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- PostgreSQL 14+
- npm or yarn

### Local Setup

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/mini-saas-admin-dashboard.git
cd mini-saas-admin-dashboard
```

2. **Backend Setup**
```bash
cd backend
npm install
```

Create `.env` file:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/admin_dashboard
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run database migrations:
```bash
psql -U postgres -d admin_dashboard -f database/schema.sql
psql -U postgres -d admin_dashboard -f database/seed.sql
```

Start backend:
```bash
npm run dev
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000
```

Start frontend:
```bash
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## 📌 What This Project Demonstrates

✅ **Production-Ready Architecture**
- Proper separation of concerns (routes, controllers, services)
- Error handling and validation
- Security best practices (JWT, bcrypt, SQL injection prevention)

✅ **Real-World Features**
- Role-based access control
- Audit logging for compliance
- File upload handling
- Configuration management
- Pagination and filtering

✅ **Database Design**
- Normalized schema
- Proper foreign key relationships
- Indexes for performance
- Migration scripts

✅ **DevOps & Deployment**
- Environment-based configuration
- Production deployment (Vercel + Render)
- Database backup strategies
- Cloud-agnostic architecture

✅ **Clean Code Practices**
- RESTful API design
- Consistent naming conventions
- Modular structure
- Comments and documentation

---

## 🔒 Security Features

- ✅ JWT token authentication
- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ Protected API routes
- ✅ Role-based authorization
- ✅ SQL injection prevention (parameterized queries)
- ✅ CORS configuration
- ✅ Environment variable management
- ✅ Input validation and sanitization

---

## 📧 Contact

**Your Name**
- GitHub: https://github.com/Animesh2k3
- LinkedIn:https://www.linkedin.com/in/animeshnaithani/
- Email: animeshnathani2002@gmail.com

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## ⭐ Show Your Support

If you found this project helpful, please give it a ⭐️!
