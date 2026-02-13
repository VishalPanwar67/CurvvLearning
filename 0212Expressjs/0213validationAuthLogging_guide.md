# Comprehensive Guide to Validation, Authentication, Authorization, and Logging in Express.js and NestJS

## Introduction

This guide provides a detailed explanation of key backend development
concepts: **Validation**, **Authentication (Auth)**, **Authorization**,
and **Logging**. These are essential for building secure, observable,
and maintainable APIs.

We cover implementations in: - **Express.js**: A minimalistic Node.js
framework, using manual approaches and built-in Node.js features (with
minimal dependencies like `mongodb` for DB logging). - **NestJS**: A
progressive Node.js framework that emphasizes structure, modularity, and
TypeScript, leveraging built-in tools like pipes, guards, and
interceptors.

Focus areas: - Input validation to ensure data integrity and security. -
Authentication to verify user identity (e.g., JWT-based). -
Authorization to control access (e.g., role-based). - Logging for
debugging, auditing, and monitoring, evolving from console/file to
MongoDB storage for queryable history.

Assumptions: - Node.js v20+. - TypeScript for NestJS examples. - MongoDB
for advanced logging (official driver: `npm install mongodb`). -
Environment variables (e.g., `JWT_SECRET`, `MONGO_URL`) managed via
`.env`.

---

## 1. Validation

Validation ensures incoming data (e.g., from requests) meets expected
formats, preventing errors and attacks like injection.

### Why It Matters

- **Security**: Blocks malicious input.
- **Reliability**: Avoids runtime errors.
- **User Experience**: Provides clear error messages.

### In Express.js

Use manual checks or libraries like `express-validator`. For a
from-scratch approach, we'll use built-in validation logic.

Example: Middleware for `/register` route.

```js
// middleware/validateRegister.js
module.exports = (req, res, next) => {
  const { email, password, age } = req.body;

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  if (!password || password.length < 8 || !/\d/.test(password)) {
    return res
      .status(400)
      .json({ error: "Password must be at least 8 characters with a number" });
  }

  if (!Number.isInteger(age) || age < 18 || age > 120) {
    return res
      .status(400)
      .json({ error: "Age must be an integer between 18 and 120" });
  }

  next();
};

// app.js
app.post("/register", validateRegister, (req, res) => {
  // Data is validated
  res.json({ message: "Registered" });
});
```

### In NestJS

Use `class-validator` with DTOs and the built-in `ValidationPipe`
(requires `npm install class-validator class-transformer`).

```ts
// src/auth/dto/register.dto.ts
import { IsEmail, IsString, MinLength, Matches, IsInt, Min, Max } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).+$/, { message: 'Password too weak' })
  password: string;

  @IsInt()
  @Min(18)
  @Max(120)
  age: number;
}

// main.ts (global pipe)
app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

// auth.controller.ts
@Post('register')
register(@Body() dto: RegisterDto) {
  // Auto-validated; throws 400 if invalid
  return { message: 'Registered' };
}
```

---

## 2. Authentication (Auth)

Authentication verifies "who" the user is, typically via credentials
like email/password, generating a token (JWT) for subsequent requests.

### Why It Matters

- Secures endpoints.
- Enables stateless sessions (JWT).

### In Express.js

Manual JWT handling (requires `npm install jsonwebtoken bcryptjs`).

```js
// auth.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // Assume User model (e.g., MongoDB)
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );
  res.json({ token });
});

// Auth middleware
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}

// Protected route
app.get("/profile", authMiddleware, (req, res) => res.json(req.user));
```

### In NestJS

Use `@nestjs/passport` and `@nestjs/jwt` (requires
`npm install @nestjs/passport passport passport-jwt @nestjs/jwt`).

```ts
// auth.module.ts
@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: '1h' } })],
  // Strategies, etc.
})

// jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  validate(payload: any) {
    return { id: payload.id, role: payload.role };
  }
}

// auth.guard.ts
export class JwtAuthGuard extends AuthGuard('jwt') {}

// auth.controller.ts
@Post('login')
login(@Body() dto: LoginDto) {
  // Validate credentials, sign JWT
  return this.authService.login(dto);
}

@Get('profile')
@UseGuards(JwtAuthGuard)
profile(@Req() req) {
  return req.user;
}
```

---

## 3. Authorization

Authorization checks "what" the authenticated user can do (e.g., roles:
admin, user).

### Why It Matters

- Enforces access control.
- Prevents unauthorized actions.

### In Express.js

Custom middleware.

```js
function restrictTo(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}

app.delete("/admin", authMiddleware, restrictTo("admin"), (req, res) =>
  res.json({ message: "Admin action" }),
);
```

### In NestJS

Custom guards and decorators.

```ts
// roles.decorator.ts
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true;
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}

// Controller
@Delete('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
adminAction() {
  return { message: 'Admin action' };
}
```

---

## 4. Logging

Logging records events for debugging, auditing, and analysis. We'll
cover console, file, and MongoDB storage (queryable by user).

### Why It Matters

- **Debugging**: Trace issues.
- **Auditing**: Track user actions.
- **Monitoring**: Detect anomalies.

### From-Scratch Implementation (No 3rd-Party Libs Except `mongodb`)

#### Console and File Logging (Shared Base)

Use Node.js built-ins (`console`, `fs`).

#### In Express.js

**Connection Helper** (`db/connect.js`):

```js
const { MongoClient } = require("mongodb");

let client, db;

async function connectDb() {
  if (client) return db;
  const url = process.env.MONGO_URL || "mongodb://localhost:27017/mylogsdb";
  client = new MongoClient(url);
  await client.connect();
  db = client.db();
  return db;
}

async function getLogsCollection() {
  const db = await connectDb();
  return db.collection("logs");
}

module.exports = { connectDb, getLogsCollection };
```

**Logger** (`utils/logger.js`):

```js
const fs = require("fs");
const path = require("path");
const { getLogsCollection } = require("../db/connect");

class SimpleLogger {
  constructor() {
    this.logFile = path.join(__dirname, "../logs/app.log");
    this.ensureLogDir();
  }

  ensureLogDir() {
    const dir = path.dirname(this.logFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  async _log(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    console.log(
      `[${timestamp}] [${level.toUpperCase()}] ${message} ${JSON.stringify(meta)}`,
    );

    // File append
    fs.appendFile(
      this.logFile,
      `[${timestamp}] [${level}] ${message} ${JSON.stringify(meta)}\n`,
      (err) => {
        if (err) console.error("File log failed", err);
      },
    );

    // MongoDB
    try {
      const collection = await getLogsCollection();
      await collection.insertOne({
        timestamp: new Date(),
        level,
        message,
        meta,
      });
    } catch (err) {
      console.error("DB log failed", err);
    }
  }

  info(message, meta) {
    this._log("info", message, meta);
  }
  error(message, meta) {
    this._log("error", message, meta);
  }
  // Add warn, debug similarly
}

module.exports = new SimpleLogger();
```

**Request Logger Middleware**:

```js
module.exports = (req, res, next) => {
  const start = Date.now();
  const originalEnd = res.end;
  res.end = (...args) => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.url} ${res.statusCode} ${duration}ms`, {
      userId: req.user?.id,
      ip: req.ip,
    });
    originalEnd.apply(res, args);
  };
  next();
};
```

**Query Logs**:

```js
async function getUserLogs(userId) {
  const collection = await getLogsCollection();
  return collection
    .find({ "meta.userId": userId })
    .sort({ timestamp: -1 })
    .limit(100)
    .toArray();
}
```

#### In NestJS

**DB Module** (`db.module.ts`):

```ts
import { Module } from "@nestjs/common";
import { MongoClient } from "mongodb";

@Module({
  providers: [
    {
      provide: "LOGS_COLLECTION",
      useFactory: async () => {
        const client = new MongoClient(process.env.MONGO_URL);
        await client.connect();
        return client.db().collection("logs");
      },
    },
  ],
  exports: ["LOGS_COLLECTION"],
})
export class DbModule {}
```

**Logger Service** (`logger.service.ts`):

```ts
import { Injectable, Inject } from "@nestjs/common";
import { Collection } from "mongodb";

@Injectable()
export class AppLogger {
  constructor(@Inject("LOGS_COLLECTION") private logsCollection: Collection) {}

  async log(level: string, message: string, meta: any = {}, context?: string) {
    console.log(
      `[${new Date().toISOString()}] [${level}] ${message} ${JSON.stringify(meta)} ${context || ""}`,
    );

    // File logging (similar to Express)

    await this.logsCollection.insertOne({
      timestamp: new Date(),
      level,
      message,
      meta,
      context,
    });
  }

  info(message: string, meta?: any, context?: string) {
    this.log("info", message, meta, context);
  }
  // Add others
}
```

**HTTP Interceptor** (`logging.interceptor.ts`):

```ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { AppLogger } from "./logger.service";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: AppLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse();
        this.logger.info(
          `${req.method} ${req.url} ${res.statusCode}`,
          { userId: req.user?.id, ip: req.ip },
          "HTTP",
        );
      }),
    );
  }
}

// main.ts
app.useGlobalInterceptors(new LoggingInterceptor(app.get(AppLogger)));
```

**Logs Service for Queries** (`logs.service.ts`):

```ts
import { Injectable, Inject } from "@nestjs/common";
import { Collection } from "mongodb";

@Injectable()
export class LogsService {
  constructor(@Inject("LOGS_COLLECTION") private logsCollection: Collection) {}

  async getUserLogs(userId: number, limit = 100) {
    return this.logsCollection
      .find({ "meta.userId": userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();
  }
}
```

---
