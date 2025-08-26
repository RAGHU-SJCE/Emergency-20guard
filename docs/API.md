# EmergencyGuard API Documentation

## Overview

The EmergencyGuard API provides endpoints for emergency response management, contact alerts, location services, and emergency history tracking.

**Base URL:** `/api/emergency`

## Authentication

Currently, the API does not require authentication for emergency endpoints to ensure immediate access during emergencies. Future versions may include optional user authentication for personalized features.

## Endpoints

### 1. Initiate Emergency Call

Initiates an emergency call and logs the event in the system.

**Endpoint:** `POST /api/emergency/call`

**Request Body:**

```json
{
  "emergencyType": "medical" | "fire" | "police" | "general",
  "timestamp": "2024-12-24T14:30:00.000Z",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "accuracy": 10
  },
  "userInfo": {
    "name": "John Doe",
    "phone": "+1-555-0123",
    "medicalInfo": "Type 1 Diabetes"
  }
}
```

**Response:**

```json
{
  "success": true,
  "callId": "emergency_1703443200000_abc123",
  "message": "Emergency call initiated successfully. Location shared with emergency services.",
  "emergencyNumber": "911",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.006,
    "address": "123 Main St, New York, NY"
  },
  "timestamp": "2024-12-24T14:30:00.000Z"
}
```

### 2. Alert Emergency Contacts

Sends notifications to emergency contacts via SMS and email.

**Endpoint:** `POST /api/emergency/alert-contacts`

**Request Body:**

```json
{
  "contacts": [
    {
      "name": "John Doe",
      "phone": "+1-555-0123",
      "email": "john@example.com",
      "relationship": "Spouse"
    }
  ],
  "message": "Emergency situation - medical emergency. Please check on me immediately.",
  "emergencyType": "medical",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.006
  }
}
```

**Response:**

```json
{
  "success": true,
  "alertId": "alert_1703443200000_def456",
  "contactsNotified": 1,
  "failedContacts": [],
  "message": "Successfully alerted 1 of 1 emergency contacts."
}
```

### 3. Log Emergency Event

Logs an emergency event for history and audit purposes.

**Endpoint:** `POST /api/emergency/log-event`

**Request Body:**

```json
{
  "type": "Emergency Call - medical",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.006,
    "address": "123 Main St, New York, NY"
  },
  "timestamp": "2024-12-24T14:30:00.000Z",
  "callId": "emergency_1703443200000_abc123",
  "additionalData": {}
}
```

**Response:**

```json
{
  "success": true,
  "eventId": "event_1703443200000_ghi789",
  "message": "Emergency event logged successfully.",
  "timestamp": "2024-12-24T14:30:00.000Z"
}
```

### 4. Get Emergency History

Retrieves emergency history for analysis and reporting.

**Endpoint:** `GET /api/emergency/history`

**Query Parameters:**

- `userId` (optional): Filter by user ID
- `limit` (optional): Number of records to return (default: 50)
- `offset` (optional): Number of records to skip (default: 0)

**Response:**

```json
{
  "success": true,
  "history": [
    {
      "id": "event_1703443200000_abc123",
      "type": "Medical Emergency",
      "date": "2024-12-24",
      "time": "14:30",
      "location": {
        "latitude": 40.7128,
        "longitude": -74.006,
        "address": "123 Main St, New York, NY"
      },
      "status": "Resolved",
      "responseTime": "2:45",
      "contacts": ["John Doe", "Jane Smith"],
      "notes": "Real emergency response - paramedics dispatched successfully",
      "emergencyNumber": "911",
      "callId": "emergency_1703443200000_def456"
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0
}
```

### 5. Get Emergency Statistics

Retrieves emergency statistics and analytics.

**Endpoint:** `GET /api/emergency/statistics`

**Query Parameters:**

- `userId` (optional): Filter by user ID

**Response:**

```json
{
  "success": true,
  "statistics": {
    "totalEmergencies": 15,
    "emergencyTypes": {
      "medical": 8,
      "fire": 2,
      "police": 3,
      "general": 2
    },
    "averageResponseTime": "3:24",
    "contactsAlerted": 45,
    "successfulAlerts": 42,
    "lastEmergency": "2024-12-24T14:30:00.000Z"
  }
}
```

### 6. Health Check

Checks the health status of the emergency system.

**Endpoint:** `GET /api/emergency/health`

**Response:**

```json
{
  "healthy": true,
  "timestamp": "2024-12-24T14:30:00.000Z",
  "services": {
    "database": "healthy",
    "notifications": "healthy",
    "location": "healthy"
  },
  "uptime": 86400
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "timestamp": "2024-12-24T14:30:00.000Z"
}
```

**Common HTTP Status Codes:**

- `200` - Success
- `400` - Bad Request (invalid request data)
- `500` - Internal Server Error
- `503` - Service Unavailable (for health check)

## Rate Limiting

Emergency endpoints have generous rate limits to ensure availability during crises:

- Emergency call: 10 requests per minute
- Contact alerts: 5 requests per minute
- History/Statistics: 60 requests per minute

## Security Considerations

1. **HTTPS Only:** All production traffic must use HTTPS
2. **Input Validation:** All inputs are validated and sanitized
3. **Location Privacy:** Location data is encrypted and access-controlled
4. **Audit Logging:** All emergency activities are logged for compliance
5. **Data Retention:** Emergency data is retained according to legal requirements

## Integration Examples

### JavaScript/TypeScript

```typescript
import { emergencyService } from "./services/emergencyService";

// Initiate emergency call
const response = await emergencyService.initiateEmergencyCall({
  type: "medical",
  location: {
    latitude: 40.7128,
    longitude: -74.006,
  },
});

// Alert emergency contacts
const alertResponse = await emergencyService.alertEmergencyContacts({
  contacts: [
    { name: "John Doe", phone: "+1-555-0123", relationship: "Spouse" },
  ],
  message: "Emergency situation - medical emergency.",
  emergencyType: "medical",
});
```

### cURL Examples

```bash
# Initiate emergency call
curl -X POST http://localhost:3000/api/emergency/call \
  -H "Content-Type: application/json" \
  -d '{
    "emergencyType": "medical",
    "timestamp": "2024-12-24T14:30:00.000Z",
    "location": {
      "latitude": 40.7128,
      "longitude": -74.0060
    }
  }'

# Get emergency history
curl http://localhost:3000/api/emergency/history?limit=10
```

## Development and Testing

### Demo Mode

When `DEMO_MODE=true` is set in environment variables:

- No real emergency services are contacted
- SMS and email notifications are logged to console instead of being sent
- Emergency numbers return mock data
- All other functionality works normally for testing

### Mock Data

The API includes comprehensive mock data for development and testing:

- Sample emergency events
- Mock emergency contacts
- Simulated response times
- Test location data

## Changelog

### v1.0.0 (2024-12-24)

- Initial API release
- Emergency call initiation
- Contact alert system
- Emergency history tracking
- Health monitoring
- Location services integration
