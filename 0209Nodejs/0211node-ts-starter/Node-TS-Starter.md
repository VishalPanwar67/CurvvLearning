# 📘 Node-TS-Starter — Project Wiki

## 1. Executive Summary

Node-TS-Starter is a **high-performance, strictly typed foundation** for modern Node.js backend services.

It is designed to eliminate the three most common causes of production failures:

- **Configuration Drift**
- **Implicit Runtime Errors**
- **Style & Architecture Inconsistency**

This starter enforces **fail-fast configuration validation**, **true Node.js ESM rules**, and **automated quality gates**, ensuring the codebase is *production-ready from Day 1*.

---

## 2. Core Architecture Principles

### I. Foundation Layer (Runtime & Compilation)

Stability begins with predictability.

#### Node.js Version Locking
- `.nvmrc` is the **single source of truth** for the Node runtime.
- Guarantees identical behavior across:
  - Local development
  - CI pipelines
  - Production servers

#### TypeScript Configuration Philosophy
Configured for **Maximum Type Safety**:

- `strict: true` — enables all strict checks
- `module: nodenext` — real Node.js ESM behavior
- `verbatimModuleSyntax: true` — no hidden transpilation magic
- `skipLibCheck: true` — faster builds without sacrificing safety

This ensures **compile-time correctness matches runtime behavior**.

---

### II. Safety Layer (Environment Validation)

Environment variables are treated as **untrusted input**, not configuration.

#### Why This Matters
Most production outages are caused by:
- Missing environment variables
- Invalid values (`PORT=abc`)
- Silent fallbacks

#### Zod-Based Fail-Fast Strategy
- All environment variables are validated at startup
- Invalid configuration **crashes the app immediately**
- Errors are human-readable and actionable

Result:
- No zombie processes
- No undefined runtime behavior
- Full IntelliSense support across the app

---

### III. Quality & Observability Layer

#### Winston Logging
Replaces `console.log` with structured, leveled logging.

Features:
- Log levels (`error`, `warn`, `info`, `debug`)
- JSON logs for production observability
- Console-friendly logs for development
- Compatible with ELK, Datadog, CloudWatch

#### ESLint + Prettier
Clear separation of concerns:

- **ESLint** → correctness & logic
- **Prettier** → formatting & style

This removes formatting debates from code reviews and enforces consistency automatically.

---

### IV. Automation & Developer Experience

Cognitive load is reduced through standardized scripts:

- `dev` → Fast reload development server
- `build` → Clean TypeScript compilation
- `lint` → Detect logic issues
- `lint:fix` → Auto-fix formatting & minor issues

Developers focus on **business logic**, not tooling.

---

## 3. Directory Structure

```text
.
├── dist/                   # Compiled JavaScript (auto-generated)
├── node_modules/           # Dependencies
├── src/                    # Source code
│   ├── config/             # Environment & app configuration
│   │   └── index.ts        # Zod-validated config export
│   ├── utils/              # Shared utilities
│   │   └── logger.ts       # Winston logger setup
│   └── index.ts            # Application entry point
├── .env                    # Local secrets (never commit)
├── .eslintignore
├── .eslintrc.json
├── .nvmrc
├── .prettierrc
├── package.json
├── tsconfig.json
└── README.md
```

---

## 4. Operational Guide

### Initial Setup

1. Enter the project directory
2. Ensure correct Node version:
   ```bash
   nvm use
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create `.env` and define required variables

---

### Daily Workflow

- Start development:
  ```bash
  npm run dev
  ```

- Lint code:
  ```bash
  npm run lint
  ```

- Fix formatting:
  ```bash
  npm run lint:fix
  ```

- Build for production:
  ```bash
  npm run build
  ```

---

## 5. Security & Best Practices

- Never commit `.env`
- Always validate environment variables
- Run `npm audit` periodically
- Never run `ts-node` in production
- Always deploy compiled JavaScript from `dist/`

---

## 6. Contributor Guidelines

- Follow ESM import rules (`.js` extensions)
- Do not bypass Zod validation
- Avoid introducing global mutable state
- Keep utilities pure and testable

---
