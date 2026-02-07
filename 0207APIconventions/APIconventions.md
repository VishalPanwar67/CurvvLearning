# HTTP + REST API Conventions

## 1. REST Fundamentals

REST APIs are built around **resources** and **standard HTTP semantics**. Correct usage ensures reliability, debuggability, and trust between services.

**Base Resource Example**
```
/v1/logs
```

---

## 2. The Big Five HTTP Methods

| Method | Meaning | Idempotent | Logging Service Usage |
|------|--------|------------|-----------------------|
| GET | Retrieve data | Yes | Fetch logs for dashboard / monitoring |
| POST | Create resource | No | Submit a new log entry |
| PUT | Replace resource | Yes | Replace entire log (rare) |
| PATCH | Partial update | No | Update log status (RESOLVED / SEEN) |
| DELETE | Remove resource | Yes | Delete old or invalid logs |

**Rule:** Never misuse POST for updates or GET for mutations.

---

## 3. Idempotency (Critical for Distributed Systems)

**Idempotency** means repeating the same request results in the **same server state**.

### Why it matters
- Network retries are common
- Microservices may resend requests
- Prevents duplicate logs and data corruption

### Method Behavior
- **Idempotent:** GET, PUT, DELETE
- **Non-idempotent:** POST

### Industry Solution
Use an **Idempotency-Key** header:
```
Idempotency-Key: 7f2b1a91-9c10-4b28
```

If the same key is seen again, return the previous response instead of creating a new log.

---

## 4. Request / Response Lifecycle

### Example: Create Log

**Request**
```
POST /v1/logs
Headers:
  Content-Type: application/json
  Authorization: Bearer <JWT>

Body:
{
  "traceId": "abc-123",
  "level": "ERROR",
  "message": "Connection timeout"
}
```

**Response**
```
Status: 201 Created
{
  "success": true,
  "message": "Log created successfully",
  "data": { ... }
}
```

---

## 5. HTTP Status Code Standards

### Success (2xx)
| Code | Meaning | Usage |
|----|-------|------|
| 200 | OK | Successful GET |
| 201 | Created | Successful POST |

### Client Errors (4xx)
| Code | Meaning | When to Use |
|----|-------|------------|
| 400 | Bad Request | Invalid DTO / payload |
| 401 | Unauthorized | Missing / invalid JWT |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Log spam protection |

### Server Errors (5xx)
| Code | Meaning | Scenario |
|----|-------|----------|
| 500 | Internal Error | Unhandled failure |
| 503 | Service Unavailable | DB down / maintenance |

---

## 6. HTTP Headers

### Standard Headers
- `Content-Type: application/json`
- `Accept: application/json`
- `User-Agent`

### Authentication Header
```
Authorization: Bearer <JWT>
```

Missing or invalid token → **401 Unauthorized**

### Custom Headers
```
X-Curvv-Trace-Id: req-992-abc
```

---

## 7. Custom Error Codes (Mandatory)

Always use **both**:
1. HTTP Status Code (machine-level)
2. Custom Error Code (business-level)

### Example
```
Status: 400 Bad Request
{
  "statusCode": 400,
  "errorCode": "LOG_INVALID_TIMESTAMP",
  "message": "Timestamp cannot be in the future",
  "timestamp": "2026-02-07T01:30:00Z"
}
```

---

## 8. Standard API Response Envelope

### Success Response
```
{
  "success": true,
  "message": "Log retrieved successfully",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 150
  }
}
```

### Error Response
```
{
  "success": false,
  "error": {
    "code": "CURVV_ERR_AUTH_01",
    "message": "Invalid JWT Token",
    "details": ["Token expired"]
  },
  "traceId": "req-992-abc",
  "timestamp": "2026-02-07T02:00:00Z"
}
```

---

## 9. DTO & Request Body Standards

- Use **camelCase**
- Avoid deep nesting
- Validate using DTOs
- Clearly document required fields

**Good Example**
```
{
  "traceId": "abc-123",
  "serviceName": "payments",
  "level": "ERROR",
  "message": "Timeout"
}
```

---

## 10. NestJS Best Practices

- Use decorators: `@Get()`, `@Post()`, `@Patch()`
- Use `@HttpCode()` intentionally
- Throw framework exceptions (`BadRequestException`, `UnauthorizedException`)
- Centralize response formatting using interceptors

---

