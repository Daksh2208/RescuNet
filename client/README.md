# ResQNet - Frontend & Backend Setup

## Latest Updates

The authentication module has been integrated successfully.

### Features Added

- User Registration
- User Login
- JWT Authentication
- Refresh Token (HTTP-only Cookie)
- Logout
- Axios API Integration
- Backend Authentication Middleware
- Role-based Authorization
- Prisma Authentication

---

# Pull Latest Changes

## Frontend

```bash
git checkout feature/frontend
git pull origin feature/frontend
```

## Backend

```bash
git checkout feature/backend
git pull origin feature/backend
```

---

# Install Dependencies

## Frontend

```bash
npm install
```

## Backend

```bash
npm install
```

---

# Environment Variables

## Backend (.env)

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
PORT=5000
```

---

## Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

# Run Backend

```bash
npm run dev
```

Backend runs at

```
http://localhost:5000
```

---

# Run Frontend

```bash
npm run dev
```

Frontend runs at

```
http://localhost:3000
```

---

# Authentication Flow

1. Register a new account
2. Login using email and password
3. Backend returns:
   - Access Token
   - Refresh Token (HTTP-only Cookie)
4. Frontend stores Access Token
5. Protected APIs require:

```
Authorization: Bearer <access_token>
```

---

# Current Status

- Authentication Module ✅
- Frontend-Backend Integration ✅

Next Development Tasks

- Incident Management
- AI Image Analysis
- Resource Management
- Shelter Management
- Notifications
- Dashboard
- Maps Integration