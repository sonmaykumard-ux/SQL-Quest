import { InterviewQuestion } from '../types';

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'int_1',
    category: 'Beginner',
    title: 'Second Highest Salary',
    question: 'How do you find the second highest salary from an employees table without using hardcoded limits that break on ties?',
    difficulty: 'Easy',
    queryExample: `
-- Approach 1: Subquery with MAX
SELECT MAX(salary) AS second_highest_salary
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);

-- Approach 2: Window Function (DENSE_RANK)
WITH RankedSalaries AS (
  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rnk
  FROM employees
)
SELECT salary 
FROM RankedSalaries 
WHERE rnk = 2;
    `.trim(),
    expectedResultExplanation: 'Returns a single scalar salary number representing the exact second highest distinct compensation.',
    commonMistakes: 'Using `ORDER BY salary DESC LIMIT 1 OFFSET 1` without DENSE_RANK fails if multiple employees tie for the top salary.',
  },
  {
    id: 'int_2',
    category: 'Joins',
    title: 'Find Customers Who Never Placed an Order',
    question: 'Write a query to identify all customers in the database who have never placed a single order. How does performance compare between LEFT JOIN and NOT EXISTS?',
    difficulty: 'Medium',
    queryExample: `
-- Approach 1: LEFT JOIN with NULL check (Anti-Join)
SELECT c.customer_id, c.first_name, c.email
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL;

-- Approach 2: NOT EXISTS (Highly optimized by query planners)
SELECT c.customer_id, c.first_name, c.email
FROM customers c
WHERE NOT EXISTS (
  SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id
);
    `.trim(),
    expectedResultExplanation: 'Lists customers with no corresponding rows in the orders table.',
    commonMistakes: 'Using `WHERE customer_id NOT IN (SELECT customer_id FROM orders)` fails silently if the subquery contains any NULL values due to 3-valued logic (NULL evaluation).',
  },
  {
    id: 'int_3',
    category: 'Window Functions',
    title: 'Top 3 Highest Paid Employees per Department',
    question: 'Write a SQL query to find the top 3 highest paid employees in every department. Which window function handles salary ties best?',
    difficulty: 'Hard',
    queryExample: `
WITH RankedEmployees AS (
  SELECT 
    e.first_name,
    e.salary,
    d.department_name,
    DENSE_RANK() OVER (
      PARTITION BY e.department_id 
      ORDER BY e.salary DESC
    ) AS salary_rank
  FROM employees e
  JOIN departments d ON e.department_id = d.department_id
)
SELECT department_name, first_name, salary, salary_rank
FROM RankedEmployees
WHERE salary_rank <= 3
ORDER BY department_name, salary_rank;
    `.trim(),
    expectedResultExplanation: 'Returns at most 3 distinct top salary ranks per department partition.',
    commonMistakes: 'Using `RANK()` instead of `DENSE_RANK()` can skip ranks (e.g. 1, 1, 3), potentially excluding the third place candidate if there is a tie for first.',
  },
  {
    id: 'int_4',
    category: 'Window Functions',
    title: 'Calculate Month-over-Month (MoM) Growth',
    question: 'How do you calculate the month-over-month percentage growth in revenue using the LAG() window function?',
    difficulty: 'Medium',
    queryExample: `
WITH MonthlyRevenue AS (
  SELECT 
    SUBSTR(order_date, 1, 7) AS order_month,
    SUM(total_amount) AS current_rev
  FROM orders
  GROUP BY SUBSTR(order_date, 1, 7)
)
SELECT 
  order_month,
  current_rev,
  LAG(current_rev, 1) OVER (ORDER BY order_month) AS prev_rev,
  ROUND(
    ((current_rev - LAG(current_rev, 1) OVER (ORDER BY order_month)) 
     / LAG(current_rev, 1) OVER (ORDER BY order_month)) * 100, 
    2
  ) AS mom_growth_pct
FROM MonthlyRevenue;
    `.trim(),
    expectedResultExplanation: 'Displays current monthly revenue alongside the previous month\'s revenue and calculated percentage change.',
    commonMistakes: 'Forgetting to handle division by zero or NULL for the very first month in the timeline.',
  },
  {
    id: 'int_5',
    category: 'Optimization',
    title: 'Explain Sargable Queries and Index Scans',
    question: 'What makes a SQL query "sargable" (Search Argument Able), and why does wrapping indexed columns in functions kill query performance?',
    difficulty: 'Medium',
    queryExample: `
-- ❌ NON-SARGABLE (Forces a full table scan because function runs on every row):
SELECT * FROM orders WHERE SUBSTR(order_date, 1, 4) = '2024';

-- ✅ SARGABLE (Allows the engine to perform a B-Tree Index Range Scan):
SELECT * FROM orders 
WHERE order_date >= '2024-01-01' AND order_date < '2025-01-01';
    `.trim(),
    expectedResultExplanation: 'The sargable query leverages existing B-Tree index pointers to execute in O(log N) time rather than O(N) full table scan.',
    commonMistakes: 'Applying functions like `YEAR()`, `LOWER()`, or math operations on column names inside the WHERE clause.',
  },
  {
    id: 'int_6',
    category: 'Case Studies',
    title: 'Consecutive Active Login Days (Gaps and Islands)',
    question: 'How do you identify users who have logged in for 3 or more consecutive days? Explain the Gaps and Islands pattern.',
    difficulty: 'Hard',
    queryExample: `
WITH RankedLogins AS (
  SELECT 
    user_id,
    login_date,
    ROW_NUMBER() OVER(PARTITION BY user_id ORDER BY login_date) as rn
  FROM user_logins
),
GroupedIslands AS (
  SELECT 
    user_id,
    login_date,
    DATE(login_date, '-' || rn || ' days') as island_group
  FROM RankedLogins
)
SELECT 
  user_id, 
  MIN(login_date) as streak_start, 
  MAX(login_date) as streak_end, 
  COUNT(*) as streak_length
FROM GroupedIslands
GROUP BY user_id, island_group
HAVING COUNT(*) >= 3;
    `.trim(),
    expectedResultExplanation: 'Subtracting a consecutive row number from an unbroken sequence of dates creates a constant date tag, isolating consecutive streaks.',
    commonMistakes: 'Trying to solve consecutive intervals with complex self-joins, which run in O(N^2) or O(N^3) time and break on larger datasets.',
  },
];
