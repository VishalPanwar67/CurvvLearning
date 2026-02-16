## Sample Schema for Examples

### Employees Table (core for filtering, sorting, aggregates)

| employee_id | first_name | last_name  | department   | salary  | hire_date   | manager_id |
|-------------|------------|------------|--------------|---------|-------------|------------|
| 1 | Alice | Johnson | Sales | 75000 | 2020-01-15 | NULL |
| 2 | Bob | Smith | Engineering | 95000 | 2019-03-01 | 1 |
| 3 | Carol | Williams | Marketing | 65000 | 2021-06-01 | 1 |
| 4 | David | Brown | Engineering | 85000 | 2018-11-20 | 2 |
| 5 | Emma | Jones | Sales | 70000 | 2022-02-10 | 1 |
| ... (up to 15 rows) | ... | ... | ... | ... | ... | ... |

### Sales Table (for aggregations and joins)

| sale_id | employee_id | amount | sale_date | region |
|---------|-------------|--------|-----------|--------|
| 1 | 1 | 15000 | 2023-01-10 | North |
| 2 | 2 | 25000 | 2023-02-15 | South |
| ... | ... | ... | ... | ... |

**Key Notes**
- Use `CREATE TABLE` + `INSERT` statements in your practice environment (LeetCode, DB Fiddle, SQLite).
- Assume **MySQL** syntax by default; note variations.
- Always test edge cases: empty tables, all NULLs, ties, duplicates.

---

## 1.1 Basic Queries

### SELECT, WHERE, DISTINCT, ORDER BY, LIMIT/TOP

```sql
SELECT [DISTINCT] column1 [AS alias],
       expression AS calculated_col
FROM table_name
WHERE condition
ORDER BY column [ASC|DESC], ...
LIMIT n [OFFSET m];  -- MySQL/PostgreSQL

-- OR
SELECT TOP n ...     -- SQL Server
```

**Use Cases**

```sql
SELECT first_name, last_name, salary
FROM Employees
WHERE department = 'Engineering';
```

```sql
SELECT first_name,
       salary * 1.10 AS projected_salary
FROM Employees;
```

**Tricky Use Cases**

```sql
SELECT * FROM Employees
ORDER BY hire_date DESC
LIMIT 10 OFFSET 20;  -- Page 3
```

**Pitfalls & Tips**
- `SELECT *` fine in interviews; avoid in production.
- `ORDER BY` on unindexed columns → full scans.
- PostgreSQL/MySQL use `LIMIT`; SQL Server uses `TOP` or `OFFSET/FETCH`.

---

## 1.2 Filtering & Logic

### AND / OR / NOT, BETWEEN, IN / NOT IN, LIKE, CASE

```sql
WHERE (department = 'Sales' OR department = 'Marketing')
  AND salary > 70000
  AND NOT (hire_date IS NULL);
```

**BETWEEN (inclusive)**

```sql
WHERE salary BETWEEN 60000 AND 90000;
```

**IN**

```sql
WHERE department IN ('Sales', 'Engineering');
```

**LIKE**

```sql
WHERE first_name LIKE 'A%';
WHERE last_name LIKE '%son';
WHERE email LIKE '___@%';
```

**CASE WHEN**

```sql
SELECT first_name,
       CASE
           WHEN salary >= 90000 THEN 'Senior'
           WHEN salary >= 70000 THEN 'Mid'
           ELSE 'Junior'
       END AS level
FROM Employees;
```

**Custom sorting**

```sql
ORDER BY CASE
             WHEN department = 'Engineering' THEN 1
             ELSE 2
         END,
         salary DESC;
```

**Pitfalls**
- `salary = NULL` ❌ → use `IS NULL`.
- Precedence: NOT > AND > OR.
- Large `IN` lists may hurt performance.

---

## 1.3 Aggregations

### COUNT, SUM, AVG, MIN, MAX + GROUP BY + HAVING

```sql
SELECT
    COUNT(*) AS total_employees,
    COUNT(salary) AS salaried_count,
    SUM(salary) AS total_payroll,
    AVG(salary) AS avg_salary,
    MIN(salary) AS min_salary,
    MAX(salary) AS max_salary
FROM Employees;
```

**GROUP BY**

```sql
SELECT department,
       COUNT(*) AS headcount,
       AVG(salary) AS avg_salary
FROM Employees
GROUP BY department;
```

**HAVING**

```sql
SELECT department, COUNT(*) AS headcount
FROM Employees
GROUP BY department
HAVING COUNT(*) > 3 AND AVG(salary) > 70000;
```

**Conditional Aggregates**

```sql
SELECT
    department,
    SUM(CASE WHEN salary > 80000 THEN salary ELSE 0 END) AS high_earners_payroll,
    COUNT(CASE WHEN hire_date >= '2022-01-01' THEN 1 END) AS new_hires
FROM Employees
GROUP BY department;
```

**NULL Handling**

| Function | Behavior with NULL | Tip |
|----------|--------------------|-----|
| COUNT(*) | counts rows | total rows |
| COUNT(col) | ignores NULL | non-null count |
| SUM/AVG | ignore NULL | use COALESCE |
| MIN/MAX | ignore NULL | NULL only if all NULL |

---

## 1.4 Common Interview Patterns

### Top N

```sql
SELECT first_name, salary
FROM Employees
ORDER BY salary DESC
LIMIT 5;
```

### Second Highest Salary

```sql
SELECT MAX(salary) AS second_highest_salary
FROM Employees
WHERE salary < (SELECT MAX(salary) FROM Employees);
```

```sql
SELECT DISTINCT salary
FROM Employees
ORDER BY salary DESC
LIMIT 1 OFFSET 1;
```

```sql
SELECT salary
FROM (
    SELECT salary,
           DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
    FROM Employees
) t
WHERE rnk = 2;
```

### Total Sales per Region

```sql
SELECT
    s.region,
    COUNT(*) AS num_sales,
    SUM(s.amount) AS total_sales,
    AVG(s.amount) AS avg_sale
FROM Sales s
JOIN Employees e ON s.employee_id = e.employee_id
GROUP BY s.region
HAVING SUM(s.amount) > 50000
ORDER BY total_sales DESC;
```

---

## 1.5 Tricky Use Cases

**Detect duplicates**

```sql
SELECT first_name, last_name, COUNT(*)
FROM Employees
GROUP BY first_name, last_name
HAVING COUNT(*) > 1;
```

**Employees earning more than manager**

```sql
SELECT e.first_name, e.salary, m.salary AS manager_salary
FROM Employees e
JOIN Employees m ON e.manager_id = m.employee_id
WHERE e.salary > m.salary;
```

**Salary buckets**

```sql
SELECT
    CASE
        WHEN salary < 60000 THEN 'Low'
        WHEN salary < 90000 THEN 'Medium'
        ELSE 'High'
    END AS salary_band,
    COUNT(*) AS count
FROM Employees
GROUP BY salary_band;
```

---

## 1.6 Best Practices (Fundamentals)

- Write readable SQL.
- Think aloud.
- Mention edge cases.
- Clarify ties and NULLs.
- Mention indexes on filter/order/group columns.
- Practice daily.

---

# 2. JOINS (Extremely High Priority)

Joins are the **heart of relational databases** and appear in nearly every SQL interview.

## Join Types
- INNER JOIN
- LEFT JOIN
- RIGHT JOIN
- SELF JOIN
- CROSS JOIN

---

## 2.1 INNER JOIN

```sql
SELECT e.first_name, s.amount, s.region
FROM Employees e
INNER JOIN Sales s ON e.employee_id = s.employee_id;
```

Aggregation example:

```sql
SELECT e.department,
       COUNT(s.sale_id) AS num_sales,
       SUM(s.amount) AS total_amount
FROM Employees e
INNER JOIN Sales s ON e.employee_id = s.employee_id
GROUP BY e.department;
```

**Pitfalls**
- NULLs never match.
- 1:M relationships create duplicates.
- Index join keys.

---

## 2.2 LEFT JOIN (Most Important)

```sql
SELECT e.employee_id, e.first_name,
       COALESCE(s.amount, 0) AS amount, s.region
FROM Employees e
LEFT JOIN Sales s ON e.employee_id = s.employee_id
ORDER BY e.employee_id;
```

**Employees without sales**

```sql
SELECT e.first_name
FROM Employees e
LEFT JOIN Sales s ON e.employee_id = s.employee_id
WHERE s.sale_id IS NULL;
```

**Key insight**
- Conditions in `ON` preserve outer rows.
- Conditions in `WHERE` can turn LEFT into INNER.

---

## 2.3 RIGHT JOIN

```sql
SELECT s.sale_id, e.first_name, s.amount
FROM Employees e
RIGHT JOIN Sales s ON e.employee_id = s.employee_id
ORDER BY s.sale_id;
```

**Orphan records**

```sql
SELECT s.sale_id, s.amount
FROM Employees e
RIGHT JOIN Sales s ON e.employee_id = s.employee_id
WHERE e.employee_id IS NULL;
```

---

## 2.4 SELF JOIN

```sql
SELECT e.employee_id AS emp_id, e.first_name AS employee,
       m.employee_id AS mgr_id, m.first_name AS manager
FROM Employees e
JOIN Employees m ON e.manager_id = m.employee_id;
```

**Employees earning more than manager**

```sql
SELECT e.first_name, e.salary, m.salary AS manager_salary
FROM Employees e
JOIN Employees m ON e.manager_id = m.employee_id
WHERE e.salary > m.salary;
```

---

## 2.5 CROSS JOIN

```sql
SELECT d.department_name, r.region
FROM Departments d
CROSS JOIN (SELECT DISTINCT region FROM Sales) r
ORDER BY d.department_name, r.region;
```

**Warning:** Row explosion (n × m).

---

## 2.6 Join Interview Patterns

- Missing records → LEFT JOIN + IS NULL
- Comparisons → SELF JOIN
- Multi-table aggregation
- Top N with joins

---

# 3. Window Functions (FAANG Favorite)

Window functions perform analytics **without collapsing rows**.

## Core Syntax

```sql
SELECT
    column1,
    window_function() OVER (
        [PARTITION BY ...]
        [ORDER BY ...]
        [ROWS/RANGE ...]
    ) AS alias
FROM table;
```

---

## 3.1 Ranking Functions

### ROW_NUMBER, RANK, DENSE_RANK

```sql
SELECT
    first_name, salary,
    ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num,
    RANK() OVER (ORDER BY salary DESC) AS rnk,
    DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rnk
FROM Employees;
```

**Top 2 per department**

```sql
SELECT department, first_name, salary, rnk
FROM (
    SELECT e.department, e.first_name, e.salary,
           RANK() OVER (
               PARTITION BY e.department
               ORDER BY e.salary DESC
           ) AS rnk
    FROM Employees e
) t
WHERE rnk <= 2;
```

---

## 3.2 Aggregate Windows

```sql
SELECT
    sale_date,
    amount,
    SUM(amount) OVER (ORDER BY sale_date) AS running_total,
    AVG(amount) OVER (PARTITION BY region) AS avg_per_region
FROM Sales;
```

Rolling average:

```sql
AVG(amount) OVER (
    ORDER BY sale_date
    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
)
```

---

## 3.3 Value Access Functions

```sql
LAG(amount, 1) OVER (PARTITION BY employee_id ORDER BY sale_date) AS prev_sale,
LEAD(amount, 1) OVER (...) AS next_sale,
FIRST_VALUE(amount) OVER (PARTITION BY department ORDER BY amount DESC) AS highest_in_dept
```

---

## 3.4 PARTITION / ORDER / Frames

- PARTITION BY = group without collapse
- ORDER BY = sequence
- ROWS = physical rows
- RANGE = value based

---

## 3.5 Window Interview Patterns

- Top N per group
- Running totals
- Ranking with ties
- Cumulative percentages

---

# 4. Subqueries & CTEs (Very Frequent)

## 4.1 Scalar Subqueries

```sql
SELECT first_name, salary,
       (SELECT AVG(salary) FROM Employees) AS company_avg
FROM Employees
WHERE salary > (SELECT AVG(salary) FROM Employees);
```

---

## 4.2 Correlated Subqueries

```sql
SELECT e.first_name, e.salary
FROM Employees e
WHERE salary > (
    SELECT AVG(salary)
    FROM Employees e2
    WHERE e2.department = e.department
);
```

**Warning:** can be O(n²).

---

## 4.3 EXISTS / NOT EXISTS

```sql
SELECT first_name
FROM Employees e
WHERE EXISTS (
    SELECT 1
    FROM Sales s
    WHERE s.employee_id = e.employee_id
);
```

```sql
WHERE NOT EXISTS (...)
```

---

## 4.4 CTEs (WITH)

```sql
WITH dept_avgs AS (
    SELECT department, AVG(salary) AS avg_salary
    FROM Employees
    GROUP BY department
),
high_earners AS (
    SELECT e.first_name, e.department, e.salary
    FROM Employees e
    JOIN dept_avgs da
      ON e.department = da.department
    WHERE e.salary > da.avg_salary
)
SELECT *
FROM high_earners
ORDER BY salary DESC;
```

### Recursive CTE

```sql
WITH RECURSIVE org AS (
    SELECT employee_id, first_name, manager_id, 0 AS level
    FROM Employees
    WHERE manager_id IS NULL
    UNION ALL
    SELECT e.employee_id, e.first_name, e.manager_id, o.level + 1
    FROM Employees e
    JOIN org o ON e.manager_id = o.employee_id
)
SELECT *
FROM org
ORDER BY level;
```

---

## 4.5 CTE vs Subquery

| Aspect | Subquery | CTE |
|--------|----------|-----|
| Readability | nested | clean |
| Reuse | no | yes |
| Performance | inline | may materialize |
| Best for | simple filters | complex pipelines |

---

# 5. Advanced Aggregation & Analytics

## 5.1 Time Bucketing

```sql
SELECT
    DATE_FORMAT(sale_date, '%Y-%m') AS month,
    COUNT(*) AS num_sales,
    SUM(amount) AS total_revenue
FROM Sales
GROUP BY month
ORDER BY month;
```

PostgreSQL equivalent:

```sql
DATE_TRUNC('month', sale_date)
```

---

## 5.2 Rolling Metrics

```sql
SELECT
    sale_date,
    amount,
    SUM(amount) OVER (
        ORDER BY sale_date
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) AS rolling_3m_sum
FROM Sales;
```

---

## 5.3 MoM Growth

```sql
WITH monthly AS (
    SELECT DATE_TRUNC('month', sale_date) AS month,
           SUM(amount) AS revenue
    FROM Sales
    GROUP BY month
)
SELECT
    month,
    revenue,
    LAG(revenue) OVER (ORDER BY month) AS prev_month,
    (revenue - LAG(revenue) OVER (ORDER BY month))
      / NULLIF(LAG(revenue) OVER (ORDER BY month), 0) * 100 AS mom_growth_pct
FROM monthly;
```

---

## 5.4 Cohort Retention

```sql
WITH cohorts AS (
    SELECT
        user_id,
        DATE_TRUNC('month', signup_date) AS cohort_month,
        DATE_TRUNC('month', last_active) AS activity_month,
        DATEDIFF(MONTH, signup_date, last_active) + 1 AS months_active
    FROM Users
),
retention AS (
    SELECT
        cohort_month,
        months_active,
        COUNT(DISTINCT user_id) AS retained_users
    FROM cohorts
    GROUP BY cohort_month, months_active
)
SELECT
    cohort_month,
    MAX(CASE WHEN months_active = 1 THEN retained_users END) AS cohort_size
FROM retention
GROUP BY cohort_month
ORDER BY cohort_month;
```

---

## 5.5 Consecutive Periods & Gaps

```sql
WITH monthly_activity AS (
    SELECT
        user_id,
        DATE_TRUNC('month', sale_date) AS month
    FROM Sales
    GROUP BY user_id, month
),
gaps AS (
    SELECT
        user_id,
        month,
        LAG(month) OVER (
            PARTITION BY user_id
            ORDER BY month
        ) AS prev_month
    FROM monthly_activity
)
SELECT user_id, COUNT(*) AS consecutive_months
FROM gaps
GROUP BY user_id
HAVING COUNT(*) >= 3;
```

---

## 5.6 Churn

```sql
WITH churn AS (
    SELECT
        DATE_TRUNC('month', signup_date) AS month,
        COUNT(
            CASE
                WHEN last_active < DATE_ADD(signup_date, INTERVAL 30 DAY)
                THEN 1
            END
        ) AS churned_30d
    FROM Users
    GROUP BY month
)
SELECT month,
       churned_30d / COUNT(*) * 100 AS churn_rate_pct
FROM churn;
```

---

## DBMS Variations

| Feature | MySQL | PostgreSQL |
|--------|-------|------------|
| Date Buckets | DATE_FORMAT | DATE_TRUNC |
| Gaps | manual joins | GENERATE_SERIES |
| Windows | 8.0+ | full support |

---
