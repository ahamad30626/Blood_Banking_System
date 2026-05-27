# 🩸 Blood Banking System

A full-stack Blood Banking System built with **React + Vite** (frontend) and **Spring Boot + MySQL** (backend), featuring JWT authentication, modern dark UI, and full CRUD for donors and blood requests.

---

## 📁 Project Structure

```
Blood_banking_system/
├── backend_blood_banking_system/
│   └── blood_banking_system/        ← Spring Boot Maven project
│       ├── src/main/java/com/example/demo/
│       │   ├── config/              ← CORS + JWT Interceptor
│       │   ├── controller/          ← REST controllers
│       │   ├── dto/                 ← Request/Response DTOs
│       │   ├── exception/           ← Global exception handler
│       │   ├── model/               ← JPA entities (User, Donor, BloodRequest)
│       │   ├── repository/          ← Spring Data JPA repos
│       │   ├── service/             ← Business logic
│       │   └── util/                ← JwtUtil
│       └── src/main/resources/
│           └── application.properties
├── blood_banking_systemm/           ← React + Vite frontend
│   └── src/
│       ├── api/api.js               ← Axios instance with JWT interceptor
│       ├── context/AuthContext.jsx  ← Auth state with localStorage
│       └── components/              ← All React pages and components
└── database/
    └── schema.sql                   ← MySQL schema + sample data
```

---

## ⚙️ Prerequisites

| Tool | Version |
|------|---------|
| Java | 21+ |
| Maven | 3.8+ |
| Node.js | 18+ |
| MySQL | 8.0+ |

---

## 🗄️ Step 1: MySQL Database Setup

1. Open **MySQL Workbench** or MySQL CLI
2. Run the schema file:

```sql
source C:/Users/shaik/OneDrive/Desktop/Blood_banking_system/database/schema.sql
```

Or manually:
```sql
CREATE DATABASE IF NOT EXISTS blood_banking_system;
```

> Spring Boot will **auto-create all tables** via `ddl-auto=update`.  
> The schema.sql adds sample data for testing.

---

## 🔧 Step 2: Backend Setup (Spring Boot)

### Configure DB password
Edit `backend_blood_banking_system/blood_banking_system/src/main/resources/application.properties`:

```properties
spring.datasource.password=Reddy@6040   ← Your MySQL root password
```

### Run the backend
```bash
cd backend_blood_banking_system/blood_banking_system
mvnw.cmd spring-boot:run
```

Backend starts at: **http://localhost:8081**

---

## 💻 Step 3: Frontend Setup (React + Vite)

```bash
cd blood_banking_systemm
npm install
npm run dev
```

Frontend starts at: **http://localhost:5173**

---

## 🌐 REST API Endpoints

### Auth
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/auth/register` | Register user, returns JWT |
| POST | `/api/auth/login` | Login user, returns JWT |

### Donors
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/donors` | Get all donors (public) |
| POST | `/api/donors` | Register a donor (auth required) |
| POST | `/api/donors/login` | Donor login |

### Blood Requests
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/requests` | Get all requests (public) |
| POST | `/api/requests` | Submit request (auth required) |
| PUT | `/api/requests/{id}/status` | Update status (auth required) |
| DELETE | `/api/requests/{id}` | Delete request (auth required) |

---

## 🔑 JWT Authentication Flow

1. User registers/logs in → backend returns `{ token, name, email }`
2. Frontend stores token in **localStorage**
3. Every API request includes: `Authorization: Bearer <token>`
4. Backend validates token via **JwtInterceptor**
5. GET endpoints are public; POST/PUT/DELETE require valid JWT

---

## 🧪 Test Accounts (from sample data)

| Email | Password | Role |
|-------|----------|------|
| admin@bloodbank.com | admin123 | ADMIN |
| ravi@example.com | password1 | USER |
| priya@example.com | password2 | USER |

---

## 🎨 Features

- ✅ Modern dark-themed UI with red accent colors
- ✅ JWT authentication (stored in localStorage, survives refresh)
- ✅ Protected routes (Donors, Blood Request require login)
- ✅ Donor registration with blood group, location, phone
- ✅ Blood request submission with status tracking (PENDING/FULFILLED/CANCELLED)
- ✅ Search & filter on donor and request tables
- ✅ Responsive design (mobile hamburger menu)
- ✅ Loading states and form validation
- ✅ Global error handling (frontend + backend)
- ✅ CORS configured globally

---

## 🚀 Quick Start (Both servers)

**Terminal 1 — Backend:**
```bash
cd backend_blood_banking_system/blood_banking_system
mvnw.cmd spring-boot:run
```

**Terminal 2 — Frontend:**
```bash
cd blood_banking_systemm
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.
