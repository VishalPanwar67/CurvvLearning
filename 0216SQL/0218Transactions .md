# Transactions & Concurrency in Relational Databases
---

## Table of Contents

1. [Core Mental Model](#1-core-mental-model)
2. [ACID — Practical Interpretation](#2-acid--practical-interpretation)
3. [Concurrency Anomalies (with step-by-step examples)](#3-concurrency-anomalies-with-step-by-step-examples)
4. [Isolation Levels — Real DB Behavior](#4-isolation-levels--real-db-behavior)
5. [Deadlocks — Deep Dive](#5-deadlocks--deep-dive)
6. [Production Patterns: Task Assignment](#6-production-patterns-task-assignment)
7. [Monitoring & Observability Checklist](#7-monitoring--observability-checklist)
8. [Quick Decision Framework](#8-quick-decision-framework)
9. [Retry Strategies (App-level)](#9-retry-strategies-app-level)
10. [Anti‑Patterns to Avoid](#10-antipatterns-to-avoid)
11. [Testing Concurrency in Practice](#11-testing-concurrency-in-practice)
12. [Operational Checklist](#12-operational-checklist)

---

## 1. Core Mental Model

A **transaction** is not merely a group of SQL statements.

It is a **correctness contract** provided by the database that guarantees:
- safe execution under failures,
- predictable behavior under concurrency,
- and preservation of invariants.

### Business Transaction vs Database Transaction

A single business action (e.g., _assign task + notify user + update analytics_) may span multiple DB transactions.

**Rule of thumb:**
- If two writes are causally dependent and partial success breaks invariants → **same DB transaction**.
- If reads drive writes (check‑then‑act) → keep them inside the same transaction with proper locking or conditions.

### Practical Engineering Rule

> Design transactions around **invariants**, not around API endpoints.

Examples of invariants:
- balance cannot go negative
- task can have only one assignee
- slug must remain unique
- inventory cannot go below zero

---

## 2. ACID — Practical Interpretation

| Property | Real Guarantee | Common Implementation | Failure Saved You From | Production Implication |
|---|---|---|---|---|
| **Atomicity** | All-or-nothing | WAL + undo/redo logs | Crash mid-transfer | No partial writes |
| **Consistency** | Constraints must pass before commit | FK/UNIQUE/CHECK validation | Invalid FK visible | Business rules enforced in DB |
| **Isolation** | Concurrent txs behave as if ordered | MVCC or locking | Subtle race conditions | Correctness vs throughput tradeoff |
| **Durability** | Commit survives crash | fsync + WAL persistence | Power loss after COMMIT | Safe persistence guarantees |

### Engineer Insight

Isolation is where most production bugs hide — especially under load.

---

## 3. Concurrency Anomalies (with step-by-step examples)

These anomalies explain why isolation levels exist.

### 3.1 Dirty Read

Transaction T2 reads data written by T1 that later rolls back.

```sql
T1: BEGIN;
    UPDATE accounts SET balance = balance - 100 WHERE id=1;

T2: SELECT balance FROM accounts WHERE id=1;  -- sees uncommitted value

T1: ROLLBACK;
```

**Why bad:** decisions are made from data that never existed.

---

### 3.2 Non-Repeatable Read (Fuzzy Read)

Same row read twice returns different committed values.

```sql
T1: BEGIN;
SELECT stock FROM products WHERE id=7; -- 50

-- T2 updates and commits

SELECT stock FROM products WHERE id=7; -- 40
```

**Impact:** logic assumes stable value but gets changed data.

---

### 3.3 Phantom Read

Same query returns different set of rows.

```sql
T1: BEGIN;
SELECT * FROM orders
WHERE created_at > '2026-02-01' AND status='pending'; -- 3 rows

-- T2 inserts matching row and commits

SELECT * FROM orders
WHERE created_at > '2026-02-01' AND status='pending'; -- 4 rows
```

**Impact:** totals, reports, and aggregations become inconsistent.

---

## 4. Isolation Levels — Real DB Behavior

| Isolation Level | Dirty | Non-repeatable | Phantom | PostgreSQL | MySQL InnoDB | Typical Use |
|---|---|---|---|---|---|---|
| Read Uncommitted | Yes | Yes | Yes | Rare | Rare | Almost never |
| Read Committed | No | Yes | Yes | Statement snapshot | Statement snapshot | Default web workloads |
| Repeatable Read | No | No | Yes* | MVCC snapshot | Gap locks | Financial/report workloads |
| Serializable | No | No | No | SSI conflict detection | Predicate/gap locking | Strongest correctness |

\* PostgreSQL uses snapshot isolation; phantom-like anomalies are less common in practice but theoretically possible.

### Defaults

- PostgreSQL → **Read Committed**
- MySQL InnoDB → **Repeatable Read**

### Tradeoff

Stronger isolation:
- ↑ correctness
- ↓ throughput
- ↑ contention / retries

---

## 5. Deadlocks — Deep Dive

A deadlock happens when two transactions wait on each other forever.

Databases detect cycles and kill one transaction.

### Common Deadlock Patterns

1. **Opposite order updates**
```
T1: users -> tasks
T2: tasks -> users
```

2. **Range + point locks (MySQL gap lock issue)**

3. **Long transactions holding many rows**

### Prevention (Best → Worst)

1. Access tables in a fixed global order.
2. Keep transactions short (ideally < 50–200 ms).
3. Prefer optimistic concurrency when possible.
4. Use `SELECT ... FOR UPDATE` only when needed.
5. Lower isolation if business allows.
6. Auto-retry transient failures.

### Retryable Error Codes

- PostgreSQL: `40P01` (deadlock_detected)
- MySQL: `1213`
- SQL Server: `1205`

---

## 6. Production Patterns: Task Assignment

### Variant A — Pessimistic Locking

```sql
BEGIN;

SELECT *
FROM tasks
WHERE id = 100
  AND status = 'open'
  AND assignee_id IS NULL
FOR UPDATE;

UPDATE tasks
SET status = 'assigned',
    assignee_id = 42
WHERE id = 100;

INSERT INTO assignments(task_id, user_id)
VALUES (100, 42);

COMMIT;
```

**Pros:** simple mental model  
**Cons:** more lock contention

---

### Variant B — Optimistic Concurrency (Recommended)

```sql
BEGIN;

UPDATE tasks
SET status = 'assigned',
    assignee_id = 42,
    version = version + 1
WHERE id = 100
  AND version = 19
  AND status = 'open'
  AND assignee_id IS NULL;

-- if affected_rows = 0 => conflict => retry

INSERT INTO assignments(task_id, user_id)
VALUES (100, 42);

COMMIT;
```

**Pros:** high scalability, fewer locks  
**Cons:** requires retry logic

---

### Variant C — Upsert to Avoid Insert Races (PostgreSQL)

```sql
INSERT INTO task_user_assignments(task_id, user_id)
VALUES (100, 42)
ON CONFLICT (task_id) DO NOTHING;
```

Then check result using `RETURNING` or affected rows.

---

## 7. Monitoring & Observability Checklist

Track these continuously:

- Deadlock rate (alert if sustained)
- Transaction duration p95 / p99
- Lock wait time
- Rollback rate
- Retry success ratio

### Useful DB Views

**PostgreSQL**
- `pg_stat_activity`
- `pg_locks`
- `pg_stat_database`

**MySQL**
- `performance_schema`
- `SHOW ENGINE INNODB STATUS`

---

## 8. Quick Decision Framework

| Scenario | Isolation | Concurrency Style | Retry |
|---|---|---|---|
| Simple CRUD | Read Committed | Optimistic or none | Rare |
| Money / inventory | Repeatable Read | Optimistic + version | Yes |
| Leaderboards | Read Committed + advisory lock | Mixed | Sometimes |
| Reporting | Repeatable Read | Snapshot | No |
| Prevent duplicates under race | Serializable | N/A | Yes |

---

## 9. Retry Strategies (App-level)

Retries are mandatory for resilient systems.

### Recommended Policy

- Exponential backoff + jitter
- Max attempts: 3–5
- Retry only transient errors

Pseudo-flow:

```text
attempt = 1
while attempt <= max:
    begin transaction
    try:
        commit
        break
    except deadlock/serialization:
        rollback
        sleep(randomized_backoff)
        attempt += 1
```

### Important

Never retry:
- validation failures
- unique constraint violations caused by business logic mistakes

---

## 10. Anti‑Patterns to Avoid

- ❌ Long transactions performing network calls
- ❌ Reading outside transaction then writing inside (check‑then‑act race)
- ❌ Locking entire tables unnecessarily
- ❌ Holding transactions open during user interaction
- ❌ Disabling constraints and relying only on app logic

---

## 11. Testing Concurrency in Practice

Recommended exercise:

1. Implement optimistic task assignment.
2. Start 100 concurrent clients.
3. Add random sleeps.
4. Observe:
   - conflicts
   - retries
   - zero data corruption

### What You Should See

- Some retries
- No duplicate assignments
- Consistent final state

If duplicates appear → your invariant is not protected by the DB.

---

## 12. Operational Checklist

Before shipping:

- [ ] Transaction boundaries defined around invariants
- [ ] Appropriate isolation selected
- [ ] Retry logic implemented
- [ ] Deadlock handling tested
- [ ] Monitoring dashboards configured
- [ ] Timeouts enforced
- [ ] Long-running transactions investigated

---

