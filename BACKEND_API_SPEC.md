# Backend API Specification for Med Reminder App

This document outlines the complete backend API that needs to be implemented to support the frontend application.

## Overview

The backend should be a Node.js/Express application with MongoDB database, implementing:

- RESTful API endpoints
- JWT-based authentication (no Firebase)
- Email sending with nodemailer
- Scheduled jobs for reminders and daily resets
- CORS configuration for frontend access

## Environment Variables

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/med-reminder-app
# or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/med-reminder-app

# Auth (JWT)
JWT_SECRET=replace-with-strong-secret
JWT_EXPIRES_IN=7d

# Email Configuration
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM="MedLove Reminders <your-gmail@gmail.com>"

# App Configuration
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:3000
```

## Database Schemas

### Users Collection

```javascript
{
  _id: ObjectId,
  email: String,
  displayName: String,
  photoURL: String,
  passwordHash: String, // bcrypt hash
  preferences: {
    theme: String, // "light" | "dark"
    notifications: Boolean,
    timezone: String // e.g., "America/New_York"
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Medications Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to Users
  name: String,
  dosage: String,
  frequency: String, // "daily" | "weekly" | "custom"
  times: [String], // ["09:00", "21:00"]
  startDate: Date,
  endDate: Date,
  notes: String,
  color: String,
  icon: String,
  isActive: Boolean,
  takenToday: Boolean,
  takenOnDate: String, // YYYY-MM-DD format
  lastTakenAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Medication Logs Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  medicationId: ObjectId,
  medicationName: String,
  dosage: String,
  scheduledTime: String, // HH:MM format
  status: String, // "reminder_sent" | "taken" | "missed"
  date: String, // YYYY-MM-DD format
  takenAt: Date,
  reminderSentAt: Date,
  createdAt: Date
}
```

### Streaks Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  medicationId: ObjectId,
  currentStreak: Number,
  longestStreak: Number,
  lastTaken: Date,
  updatedAt: Date
}
```

## API Endpoints

### Authentication Middleware (JWT)

All protected endpoints require a backend-issued JWT:

```javascript
import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "No token provided" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub };
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
```

### Auth Endpoints (JWT)

#### POST /api/auth/register

Create a user account.

Body:

```json
{
  "email": "user@example.com",
  "password": "strong-password",
  "displayName": "John"
}
```

Response (201):

```json
{ "id": "user-id", "email": "user@example.com", "displayName": "John" }
```

#### POST /api/auth/login

Authenticate and get JWT.

Body:

```json
{ "email": "user@example.com", "password": "strong-password" }
```

Response (200):

```json
{
  "token": "<jwt>",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "displayName": "John"
  }
}
```

#### GET /api/auth/me

Return current user from JWT.

Headers:

```
Authorization: Bearer <jwt>
```

Response (200):

```json
{ "id": "user-id", "email": "user@example.com", "displayName": "John" }
```

### Medications Endpoints

#### GET /api/medications

Get all medications for the authenticated user.

**Headers:**

```
Authorization: Bearer <jwt>
```

**Response:**

```json
[
  {
    "id": "medication-id",
    "userId": "user-id",
    "name": "Vitamin D",
    "dosage": "1000 IU",
    "frequency": "daily",
    "times": ["09:00", "21:00"],
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": null,
    "notes": "Take with food",
    "color": "#3B82F6",
    "icon": "💊",
    "isActive": true,
    "takenToday": false,
    "takenOnDate": null,
    "lastTakenAt": null,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### POST /api/medications

Create a new medication.

**Headers:**

```
Authorization: Bearer <jwt>
Content-Type: application/json
```

**Body:**

```json
{
  "name": "Vitamin D",
  "dosage": "1000 IU",
  "frequency": "daily",
  "times": ["09:00", "21:00"],
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": null,
  "notes": "Take with food",
  "color": "#3B82F6",
  "icon": "💊",
  "isActive": true
}
```

**Response:**

```json
{
  "id": "new-medication-id",
  "userId": "user-id",
  "name": "Vitamin D",
  "dosage": "1000 IU",
  "frequency": "daily",
  "times": ["09:00", "21:00"],
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": null,
  "notes": "Take with food",
  "color": "#3B82F6",
  "icon": "💊",
  "isActive": true,
  "takenToday": false,
  "takenOnDate": null,
  "lastTakenAt": null,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### PATCH /api/medications/:id

Update a medication.

**Headers:**

```
Authorization: Bearer <jwt>
Content-Type: application/json
```

**Body:**

```json
{
  "name": "Updated Vitamin D",
  "dosage": "2000 IU",
  "isActive": false
}
```

**Response:**

```json
{
  "id": "medication-id",
  "userId": "user-id",
  "name": "Updated Vitamin D",
  "dosage": "2000 IU",
  "frequency": "daily",
  "times": ["09:00", "21:00"],
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": null,
  "notes": "Take with food",
  "color": "#3B82F6",
  "icon": "💊",
  "isActive": false,
  "takenToday": false,
  "takenOnDate": null,
  "lastTakenAt": null,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### DELETE /api/medications/:id

Delete a medication.

**Headers:**

```
Authorization: Bearer <jwt>
```

**Response:**

```json
{
  "message": "Medication deleted successfully"
}
```

#### POST /api/medications/:id/toggle-taken

Mark medication as taken for today.

**Headers:**

```
Authorization: Bearer <jwt>
```

**Response:**

```json
{
  "message": "Medication marked as taken",
  "takenAt": "2024-01-01T12:00:00.000Z"
}
```

### Medication Logs Endpoints

#### GET /api/medication-logs

Get medication logs with optional filtering.

**Headers:**

```
Authorization: Bearer <jwt>
```

**Query Parameters:**

- `medicationId` (optional): Filter by specific medication
- `startDate` (optional): Start date filter (YYYY-MM-DD)
- `endDate` (optional): End date filter (YYYY-MM-DD)

**Response:**

```json
[
  {
    "id": "log-id",
    "userId": "user-id",
    "medicationId": "medication-id",
    "medicationName": "Vitamin D",
    "dosage": "1000 IU",
    "scheduledTime": "09:00",
    "status": "taken",
    "date": "2024-01-01",
    "takenAt": "2024-01-01T09:05:00.000Z",
    "reminderSentAt": "2024-01-01T09:00:00.000Z",
    "createdAt": "2024-01-01T09:00:00.000Z"
  }
]
```

### Streaks Endpoints

#### GET /api/streaks/:medicationId

Get streak data for a specific medication.

**Headers:**

```
Authorization: Bearer <firebase-token>
```

**Response:**

```json
{
  "id": "streak-id",
  "userId": "user-id",
  "medicationId": "medication-id",
  "currentStreak": 5,
  "longestStreak": 10,
  "lastTaken": "2024-01-01T09:00:00.000Z",
  "updatedAt": "2024-01-01T09:00:00.000Z"
}
```

#### PATCH /api/streaks/:medicationId

Update streak data when medication is taken/missed.

**Headers:**

```
Authorization: Bearer <firebase-token>
Content-Type: application/json
```

**Body:**

```json
{
  "taken": true
}
```

**Response:**

```json
{
  "id": "streak-id",
  "userId": "user-id",
  "medicationId": "medication-id",
  "currentStreak": 6,
  "longestStreak": 10,
  "lastTaken": "2024-01-01T09:00:00.000Z",
  "updatedAt": "2024-01-01T09:00:00.000Z"
}
```

### Stats Endpoints

#### GET /api/stats

Get user statistics.

**Headers:**

```
Authorization: Bearer <firebase-token>
```

**Response:**

```json
{
  "streak": 5,
  "compliance": 85,
  "weeklyCount": 12,
  "todayCompleted": 3,
  "todayTotal": 4
}
```

### Email Endpoints

#### POST /api/emails/reminder

Send medication reminder email.

**Headers:**

```
Authorization: Bearer <firebase-token>
Content-Type: application/json
```

**Body:**

```json
{
  "medicationId": "medication-id",
  "medicationName": "Vitamin D",
  "dosage": "1000 IU",
  "time": "09:00"
}
```

**Response:**

```json
{
  "message": "Reminder email sent successfully",
  "messageId": "email-message-id"
}
```

#### POST /api/emails/follow-up

Send follow-up reminder email.

**Headers:**

```
Authorization: Bearer <firebase-token>
Content-Type: application/json
```

**Body:**

```json
{
  "medicationId": "medication-id",
  "medicationName": "Vitamin D",
  "dosage": "1000 IU",
  "time": "09:00",
  "reminderCount": 2
}
```

**Response:**

```json
{
  "message": "Follow-up email sent successfully",
  "messageId": "email-message-id"
}
```

<!-- Firebase verify endpoint removed. Using JWT endpoints above. -->

## Scheduled Jobs

### Medication Reminder Job

Run every minute to check for medications due for reminders.

```javascript
// Cron job: every minute
const checkMedicationReminders = async () => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
  const currentDate = now.toISOString().split("T")[0]; // YYYY-MM-DD format

  // Find active medications due for reminders
  const medications = await Medication.find({
    isActive: true,
    times: currentTime,
    takenToday: false,
    takenOnDate: { $ne: currentDate },
  }).populate("userId");

  for (const medication of medications) {
    const user = medication.userId;

    // Send reminder email
    await sendMedicationReminder({
      userEmail: user.email,
      userName: user.displayName,
      medicationName: medication.name,
      dosage: medication.dosage,
      time: currentTime,
      medicationId: medication._id,
    });

    // Create log entry
    await MedicationLog.create({
      userId: user._id,
      medicationId: medication._id,
      medicationName: medication.name,
      dosage: medication.dosage,
      scheduledTime: currentTime,
      status: "reminder_sent",
      date: currentDate,
      reminderSentAt: now,
    });
  }
};
```

### Daily Reset Job

Run daily at midnight UTC to reset `takenToday` flags.

```javascript
// Cron job: daily at midnight UTC
const dailyReset = async () => {
  const now = new Date();

  // Get all users with their timezones
  const users = await User.find({}, "preferences.timezone");

  for (const user of users) {
    const timezone = user.preferences?.timezone || "UTC";
    const todayInTz = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .format(now)
      .replace(/\//g, "-"); // YYYY-MM-DD

    // Reset medications for this user
    await Medication.updateMany(
      {
        userId: user._id,
        takenToday: true,
        takenOnDate: { $ne: todayInTz },
      },
      {
        takenToday: false,
        takenOnDate: null,
      }
    );
  }
};
```

### Follow-up Reminder Job

Run every 30 minutes to send follow-up reminders for missed medications.

```javascript
// Cron job: every 30 minutes
const sendFollowUpReminders = async () => {
  const now = new Date();
  const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

  // Find medications that had reminders sent 30+ minutes ago but weren't taken
  const logs = await MedicationLog.find({
    status: "reminder_sent",
    reminderSentAt: { $lte: thirtyMinutesAgo },
    takenAt: { $exists: false },
  }).populate("userId medicationId");

  for (const log of logs) {
    const user = log.userId;
    const medication = log.medicationId;

    // Count how many follow-ups have been sent today
    const followUpCount = await MedicationLog.countDocuments({
      userId: user._id,
      medicationId: medication._id,
      date: log.date,
      status: "follow_up_sent",
    });

    if (followUpCount < 3) {
      // Max 3 follow-ups per day
      // Send follow-up email
      await sendFollowUpReminder({
        userEmail: user.email,
        userName: user.displayName,
        medicationName: medication.name,
        dosage: medication.dosage,
        time: log.scheduledTime,
        medicationId: medication._id,
        reminderCount: followUpCount + 1,
      });

      // Create follow-up log entry
      await MedicationLog.create({
        userId: user._id,
        medicationId: medication._id,
        medicationName: medication.name,
        dosage: medication.dosage,
        scheduledTime: log.scheduledTime,
        status: "follow_up_sent",
        date: log.date,
        reminderSentAt: now,
      });
    }
  }
};
```

## CORS Configuration

```javascript
const cors = require("cors");

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
```

## Error Handling

All endpoints should return consistent error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional error details (optional)"
}
```

Common HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Implementation Notes

1. **MongoDB Connection**: Use Mongoose for MongoDB operations
2. **Email Service**: Use nodemailer with Gmail SMTP (or a provider like SendGrid in prod)
3. **Cron Jobs**: Use node-cron or similar library for scheduled tasks
4. **Validation**: Use Zod/Joi for request validation (times: HH:MM; frequency enum)
5. **Logging**: Implement proper logging with winston or similar
6. **Rate Limiting**: Add limits to `/emails/*` (e.g., 5/min/user)
7. **Health Check**: Add `/health` and `/ready` endpoints

## Frontend Integration

The frontend expects:

- Base URL: `process.env.NEXT_PUBLIC_API_BASE_URL` (default: `http://localhost:4000/api`)
- Backend JWT token in `Authorization: Bearer <jwt>` header
- All dates in ISO string format
- Consistent error response format
- CORS enabled for the frontend domain

## Deployment Considerations

1. **Environment Variables**: Secure storage of sensitive credentials
2. **Database**: MongoDB Atlas for production
3. **Email**: Consider using SendGrid or similar service for production
4. **Monitoring**: Implement health checks and monitoring
5. **Scaling**: Consider horizontal scaling for high user loads
6. **Security**: Implement proper security headers and validation
7. **API Versioning**: Consider `/api/v1/*` prefix
8. **Pagination**: Support `limit` and `cursor` for list endpoints
