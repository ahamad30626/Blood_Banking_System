## ⚙️ Prerequisites

| Tool | Version |
|------|---------|
| Java | 21+ |
| Mgit add .
git commit -m "Updated project"
git push origin mainaven | 3.8+ |
| Node.js | 18+ |
| MySQL | 8.0+ |

---

## 🔐 Step 1: Environment Variables Setup

**Why?** Credentials must never be committed to git.

### Backend
```bash
cd backend_blood_banking_system/blood_banking_system
copy .env.example .env        # Windows
cp .env.example .env          # Mac/Linux
```

Edit `.env` and set your values:
```properties
DB_PASSWORD=your_mysql_password
JWT_SECRET=a_long_random_secret_key_for_production_at_least_32_chars
DDL_AUTO=update         # use 'validate' in production
COOKIE_SECURE=false     # set 'true' in production (requires HTTPS)
```

> Spring Boot reads `${VAR_NAME:default}` from environment. In dev, the defaults in `application.properties` are used. Set real values as system env vars or in your IDE run config.

### Frontend
```bash
cd blood_banking_systemm
copy .env.example .env        # Windows
cp .env.example .env          # Mac/Linux
```

The only variable needed:
```
VITE_API_URL=/api
```
This uses the Vite proxy (requests go to `localhost:5173/api` → proxied to `localhost:8081`).

---
