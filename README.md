# RideFlow API 🚖

A scalable, role-based ride booking backend , built with **Node.js**, **Express.js**, **MongoDB**, **Mongoose**, **TypeScript**, **JWT Authentication**, and **BullMQ**.

## Features

### Authentication & Authorization

- JWT-based authentication
- Secure password hashing
- Role-based access control
- Roles:
  - Admin
  - Rider
  - Driver

### Rider Features

- Request a ride
- View ride history
- Cancel ride (before acceptance)
- View fare and ride details

### Driver Features

- Create driver profile
- Update availability (Online/Offline)
- Update current location
- Accept assigned rides
- Update ride status
- View assigned rides
- View earnings history

### Admin Features

- View users
- View drivers
- Approve drivers
- Suspend drivers
- Block / Unblock users
- View all rides

### Ride Assignment

- Automatic driver assignment using BullMQ workers
- Driver selection based on:
  - Availability
  - Approval status
  - Online status
  - Geospatial proximity
- Retry mechanism when drivers do not accept

### Ride Lifecycle

```text
REQUESTED
   ↓
ACCEPTED
   ↓
COMPLETED
```

Or:

```text
REQUESTED
   ↓
CANCELLED
```

---

# Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- Redis
- BullMQ
- JWT
- bcrypt

---

# Project Structure

```text
src/
├── modules/
│   ├── auth/
│   ├── user/
│   ├── driver/
│   ├── ride/
│
├── middlewares/
├── utils/
├── config/
├── app.ts
└── server.ts
```

---

# API Endpoints

## Auth

| Method | Endpoint              |
| ------ | --------------------- |
| POST   | /api/v1/auth/register |
| POST   | /api/v1/auth/login    |
| GET    | /api/v1/auth/me       |

---

## Users

| Method | Endpoint                  |
| ------ | ------------------------- |
| GET    | /api/v1/users/me          |
| GET    | /api/v1/users             |
| PATCH  | /api/v1/users/:id/block   |
| PATCH  | /api/v1/users/:id/unblock |

---

## Drivers

| Method | Endpoint                                                 |
| ------ | -------------------------------------------------------- | -------- | --------- | -------- |
| POST   | /api/v1/driver/profile                                   |
| GET    | /api/v1/driver/profile                                   |
| PATCH  | /api/v1/driver/availability                              |
| PATCH  | /api/v1/driver/location                                  |
| GET    | /api/v1/driver/earnings                                  |
| GET    | /api/v1/driver (admin)                                   |
| GET    | /api/v1/driver/request (driver assigned requests)        |
| PATCH  | /api/v1/driver/status/:id (admin — body: status=approved | rejected | suspended | pending) |

---

## Rides

| Method | Endpoint                                                                            |
| ------ | ----------------------------------------------------------------------------------- | -------- | --------- | ------------ |
| POST   | /api/v1/rider/request                                                               |
| PATCH  | /api/v1/rider/cancel/:rideId                                                        |
| GET    | /api/v1/rider/history                                                               |
| PATCH  | /api/v1/driver/status/:id (driver updates ride status; payload: { status: REQUESTED | ACCEPTED | COMPLETED | CANCELLED }) |
| GET    | /api/v1/ride (admin list)                                                           |
| GET    | /api/v1/ride/:id (admin details)                                                    |

---

# Geospatial Support

Driver locations and ride locations are stored using MongoDB GeoJSON format:

```json
{
  "type": "Point",
  "coordinates": [90.4125, 23.8103]
}
```

MongoDB 2dsphere indexes are used for location-based driver assignment.

---

# Fare Calculation

Distance is calculated using the Haversine Formula.

```text
Fare = Base Fare + (Distance × Rate Per KM)
```

Example:

```text
Base Fare = 50 BDT
Rate Per KM = 20 BDT

Distance = 10 KM

Fare = 50 + (10 × 20)
Fare = 250 BDT
```

---

# Business Rules

### Rider

- Cannot create multiple active rides
- Can cancel only before ride acceptance

### Driver

- Must be approved by admin
- Must be online
- Cannot accept multiple rides simultaneously

### User

- Blocked users cannot access protected resources

### Ride

- Only assigned driver can accept/update ride
- Status transitions are validated
- Complete ride history is stored

---

# Environment Variables

```env
PORT=5000

DATABASE_URL=your_mongodb_connection_string

JWT_ACCESS_SECRET=your_secret
JWT_ACCESS_EXPIRES_IN=7d

BCRYPT_SALT_ROUNDS=10

REDIS_HOST=localhost
REDIS_PORT=6379
```

---

# Running the Project

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Start production:

```bash
npm start
```

---

# Future Improvements

- Driver ratings
- Rider feedback
- Surge pricing
- Real-time location tracking
- WebSocket notifications
- Payment integration
- Admin analytics dashboard

---

# Author

**Asifur Rahman**

RideFlow API – Backend Ride Booking Platform
