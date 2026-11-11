import { Level } from '../types';

export const CURRICULUM_LEVELS: Level[] = [
  {
    id: 1,
    number: 1,
    title: 'SQL Fundamentals',
    subtitle: 'Tables, Columns, SELECT, and your first queries',
    color: '#10B981', // emerald
    iconName: 'database',
    lessons: [
      {
        id: 'l1_1',
        levelId: 1,
        title: 'Welcome to SQL & Relational Databases',
        description: 'Understand relational tables, rows, columns, and primary keys.',
        durationMinutes: 5,
        topics: ['What is SQL?', 'Relational Databases', 'Tables & Rows', 'Primary Keys'],
        summaryMarkdown: `
### What is SQL?
**Structured Query Language (SQL)** is the universal language for querying and transforming data in relational database management systems (RDBMS) like SQLite, PostgreSQL, MySQL, and BigQuery.

### Key Concepts:
- **Table**: A structured collection of data organized into rows and columns (e.g. \`customers\`, \`employees\`).
- **Row (Record)**: A single item or record (e.g., Alice Chen).
- **Column (Attribute)**: A specific piece of information (e.g., \`email\`, \`salary\`).
- **Primary Key**: A unique identifier for every row in a table (e.g., \`customer_id\`).
        `,
        exercises: [
          {
            id: 'l1_1_e1',
            type: 'mcq',
            prompt: 'In a relational database, what uniquely identifies each record in a table?',
            options: ['A Column Alias', 'A Primary Key', 'A Foreign Script', 'A Temporary View'],
            correctAnswerIndex: 1,
            explanation: 'A Primary Key enforces entity integrity by uniquely identifying every individual record/row in a table.',
            xpReward: 5,
          },
          {
            id: 'l1_1_e2',
            type: 'fill_blank',
            prompt: 'Complete the sentence: In SQL, a single horizontal record representing an entity is called a ___.',
            template: 'In a table, each individual entity record is called a ___.',
            blankOptions: ['Row', 'Column', 'Schema', 'Index'],
            correctBlank: 'Row',
            explanation: 'Tables consist of rows (records) and columns (attributes or fields).',
            xpReward: 5,
          },
          {
            id: 'l1_1_e3',
            type: 'write_query',
            datasetId: 'ecommerce',
            prompt: 'Retrieve all columns and rows from the "customers" table using SELECT *.',
            defaultQuery: '-- Write your first SQL query below\nSELECT ',
            targetQuery: 'SELECT * FROM customers;',
            explanation: 'The asterisk (*) represents all columns. SELECT * FROM customers retrieves the entire table.',
            xpReward: 15,
          },
        ],
      },
      {
        id: 'l1_2',
        levelId: 1,
        title: 'Choosing Columns & Renaming with Aliases',
        description: 'Select specific columns, remove duplicates with DISTINCT, and alias with AS.',
        durationMinutes: 6,
        topics: ['SELECT Column List', 'Column Aliases (AS)', 'DISTINCT', 'Calculated Expressions'],
        summaryMarkdown: `
### Selecting Specific Columns
Instead of returning all columns with \`*\`, production queries specify only the necessary columns:
\`\`\`sql
SELECT first_name, email FROM customers;
\`\`\`

### Removing Duplicates with DISTINCT
\`\`\`sql
SELECT DISTINCT city FROM customers;
\`\`\`

### Renaming with AS (Aliases)
\`\`\`sql
SELECT first_name AS customer_name, price * 1.1 AS price_with_tax FROM products;
\`\`\`
        `,
        exercises: [
          {
            id: 'l1_2_e1',
            type: 'fill_blank',
            prompt: 'Which keyword eliminates duplicate rows from your query results?',
            template: 'SELECT ___ city FROM customers;',
            blankOptions: ['DISTINCT', 'UNIQUE', 'DIFFERENT', 'GROUP'],
            correctBlank: 'DISTINCT',
            explanation: 'SELECT DISTINCT filters out duplicate values so each distinct value appears only once.',
            xpReward: 5,
          },
          {
            id: 'l1_2_e2',
            type: 'write_query',
            datasetId: 'ecommerce',
            prompt: 'Select the "product_name" and "price" from "products", giving "product_name" the alias "item_title".',
            defaultQuery: 'SELECT product_name AS item_title, price FROM products;',
            targetQuery: 'SELECT product_name AS item_title, price FROM products;',
            explanation: 'Column aliases create clean, human-readable column headers for downstream reports.',
            xpReward: 15,
          },
          {
            id: 'l1_2_e3',
            type: 'write_query',
            datasetId: 'ecommerce',
            prompt: 'Find all unique cities where customers live from the "customers" table.',
            defaultQuery: 'SELECT DISTINCT city FROM customers;',
            targetQuery: 'SELECT DISTINCT city FROM customers;',
            explanation: 'SELECT DISTINCT city returns each unique city without repeats.',
            xpReward: 15,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    number: 2,
    title: 'Filtering and Conditions',
    subtitle: 'Master WHERE, Comparison Operators, IN, LIKE, and CASE WHEN',
    color: '#3B82F6', // blue
    iconName: 'filter',
    lessons: [
      {
        id: 'l2_1',
        levelId: 2,
        title: 'The WHERE Clause & Comparison Operators',
        description: 'Filter rows with =, !=, <, >, <=, >=, AND, OR, and NOT.',
        durationMinutes: 7,
        topics: ['WHERE Clause', 'Comparison Operators', 'Logical AND / OR', 'NOT'],
        summaryMarkdown: `
### Filtering with WHERE
The \`WHERE\` clause acts like a filter on rows:
\`\`\`sql
SELECT product_name, price 
FROM products 
WHERE price > 100 AND category = 'Electronics';
\`\`\`
- String literals use single quotes: \`'Electronics'\`
- Combine conditions with \`AND\`, \`OR\`, and \`NOT\`
        `,
        exercises: [
          {
            id: 'l2_1_e1',
            type: 'mcq',
            prompt: 'Which operator matches rows where a condition is NOT true?',
            options: ['NOT', 'NEVER', 'EXCEPT', 'UNLESS'],
            correctAnswerIndex: 0,
            explanation: 'The NOT logical operator negates a boolean condition.',
            xpReward: 5,
          },
          {
            id: 'l2_1_e2',
            type: 'write_query',
            datasetId: 'ecommerce',
            prompt: 'Retrieve all products from "products" with price greater than 50 and category equal to "Electronics".',
            defaultQuery: 'SELECT * FROM products WHERE price > 50 AND category = \'Electronics\';',
            targetQuery: 'SELECT * FROM products WHERE price > 50 AND category = \'Electronics\';',
            explanation: 'Using AND requires both the price and category conditions to evaluate to true.',
            xpReward: 15,
          },
          {
            id: 'l2_1_e3',
            type: 'fix_bug',
            datasetId: 'ecommerce',
            buggyQuery: 'SELECT * FROM customers WHERE city = "London" OR city = Paris;',
            targetQuery: 'SELECT * FROM customers WHERE city = \'London\' OR city = \'Paris\';',
            bugDescription: 'String literals in SQL must be enclosed in single quotes, not bare identifiers or double quotes.',
            prompt: 'Fix the query to find customers living in London or Paris with proper SQL string syntax.',
            explanation: 'In standard SQL, string literals are enclosed in single quotes like \'Paris\'.',
            xpReward: 15,
          },
        ],
      },
      {
        id: 'l2_2',
        levelId: 2,
        title: 'Range, List, Wildcards & Ordering',
        description: 'Use BETWEEN, IN, LIKE, ORDER BY, LIMIT, and CASE WHEN.',
        durationMinutes: 8,
        topics: ['BETWEEN', 'IN Operator', 'LIKE & % Wildcards', 'ORDER BY & LIMIT', 'CASE WHEN'],
        summaryMarkdown: `
### Useful Filtering Tools:
- **IN ('A', 'B')**: Matches any value in a list
- **BETWEEN 10 AND 50**: Inclusive range check
- **LIKE '%Phone%'**: Pattern match with wildcard (% = zero or more characters, _ = single character)
- **ORDER BY column DESC LIMIT 5**: Sort and grab top records
- **CASE WHEN condition THEN val ELSE alt END**: Conditional if/else logic
        `,
        exercises: [
          {
            id: 'l2_2_e1',
            type: 'fill_blank',
            prompt: 'Complete the query to sort products from highest price to lowest.',
            template: 'SELECT product_name, price FROM products ORDER BY price ___;',
            blankOptions: ['DESC', 'ASC', 'HIGH', 'MAX'],
            correctBlank: 'DESC',
            explanation: 'DESC sorts values in descending order (highest to lowest).',
            xpReward: 5,
          },
          {
            id: 'l2_2_e2',
            type: 'write_query',
            datasetId: 'ecommerce',
            prompt: 'Find the top 3 most expensive products from "products". Include product_name and price.',
            defaultQuery: 'SELECT product_name, price FROM products ORDER BY price DESC LIMIT 3;',
            targetQuery: 'SELECT product_name, price FROM products ORDER BY price DESC LIMIT 3;',
            explanation: 'ORDER BY price DESC LIMIT 3 returns the three highest priced items.',
            xpReward: 15,
          },
        ],
      },
    ],
  },
  {
    id: 3,
    number: 3,
    title: 'Aggregate Functions & Grouping',
    subtitle: 'COUNT, SUM, AVG, MIN, MAX, GROUP BY, and HAVING',
    color: '#8B5CF6', // purple
    iconName: 'bar-chart-2',
    lessons: [
      {
        id: 'l3_1',
        levelId: 3,
        title: 'Core Aggregates: COUNT, SUM, AVG, MIN, MAX',
        description: 'Summarize thousands of rows into actionable business numbers.',
        durationMinutes: 7,
        topics: ['COUNT(*)', 'COUNT(DISTINCT col)', 'SUM & AVG', 'MIN & MAX', 'NULL in Aggregates'],
        summaryMarkdown: `
### Aggregate Functions
Aggregates collapse multiple rows into a single summary value:
- \`COUNT(*)\`: Count total rows
- \`SUM(total_amount)\`: Add all numbers together
- \`AVG(salary)\`: Compute the arithmetic mean
- \`MIN(price)\` & \`MAX(price)\`: Lowest and highest values
        `,
        exercises: [
          {
            id: 'l3_1_e1',
            type: 'write_query',
            datasetId: 'hr',
            prompt: 'Calculate the total number of employees, the average salary, and the maximum salary from the "employees" table.',
            defaultQuery: 'SELECT COUNT(*) AS total_employees, AVG(salary) AS avg_salary, MAX(salary) AS max_salary FROM employees;',
            targetQuery: 'SELECT COUNT(*) AS total_employees, AVG(salary) AS avg_salary, MAX(salary) AS max_salary FROM employees;',
            explanation: 'Aggregates summarize table-wide metrics into single row metrics.',
            xpReward: 15,
          },
          {
            id: 'l3_1_e2',
            type: 'mcq',
            prompt: 'What does AVG(salary) do when a row has a NULL salary?',
            options: ['It treats NULL as 0', 'It ignores the NULL row', 'It throws a runtime error', 'It returns NULL for everything'],
            correctAnswerIndex: 1,
            explanation: 'SQL aggregate functions (except COUNT(*)) automatically ignore NULL values during computation.',
            xpReward: 5,
          },
        ],
      },
      {
        id: 'l3_2',
        levelId: 3,
        title: 'GROUP BY and HAVING Filter',
        description: 'Aggregate data across categories and filter aggregated results.',
        durationMinutes: 8,
        topics: ['GROUP BY clause', 'Multi-column grouping', 'HAVING vs WHERE', 'Conditional Aggregation'],
        summaryMarkdown: `
### GROUP BY & HAVING
Use \`GROUP BY\` to calculate metrics per category:
\`\`\`sql
SELECT department_id, COUNT(*) AS emp_count, AVG(salary) AS avg_sal
FROM employees
GROUP BY department_id
HAVING AVG(salary) > 100000;
\`\`\`
**Crucial Rule**:
- \`WHERE\` filters individual rows **before** grouping.
- \`HAVING\` filters aggregate buckets **after** grouping.
        `,
        exercises: [
          {
            id: 'l3_2_e1',
            type: 'write_query',
            datasetId: 'ecommerce',
            prompt: 'Calculate the total inventory stock (SUM of stock_quantity) for each product category in "products".',
            defaultQuery: 'SELECT category, SUM(stock_quantity) AS total_stock FROM products GROUP BY category;',
            targetQuery: 'SELECT category, SUM(stock_quantity) AS total_stock FROM products GROUP BY category;',
            explanation: 'GROUP BY category splits records into groups and applies SUM to each group.',
            xpReward: 15,
          },
          {
            id: 'l3_2_e2',
            type: 'fill_blank',
            prompt: 'Which keyword filters aggregated group results?',
            template: 'SELECT department_id, COUNT(*) FROM employees GROUP BY department_id ___ COUNT(*) > 2;',
            blankOptions: ['HAVING', 'WHERE', 'FILTER', 'WHEN'],
            correctBlank: 'HAVING',
            explanation: 'HAVING is specifically used to filter groups based on aggregate conditions.',
            xpReward: 5,
          },
        ],
      },
    ],
  },
  {
    id: 4,
    number: 4,
    title: 'SQL Joins & Relationships',
    subtitle: 'Connect tables: INNER, LEFT, RIGHT, FULL OUTER, and SELF joins',
    color: '#EC4899', // pink
    iconName: 'git-merge',
    lessons: [
      {
        id: 'l4_1',
        levelId: 4,
        title: 'INNER JOIN and LEFT JOIN',
        description: 'Combine data across foreign keys and understand missing matches.',
        durationMinutes: 8,
        topics: ['Relational Schema', 'INNER JOIN', 'LEFT JOIN', 'Handling NULLs from joins'],
        summaryMarkdown: `
### INNER JOIN
Returns only rows where there is a match in **both** tables:
\`\`\`sql
SELECT e.first_name, d.department_name
FROM employees e
INNER JOIN departments d ON e.department_id = d.department_id;
\`\`\`

### LEFT JOIN (LEFT OUTER JOIN)
Returns **all** rows from the left table, plus matched rows from the right table (or NULL if no match):
\`\`\`sql
SELECT c.first_name, o.order_id
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id;
\`\`\`
        `,
        exercises: [
          {
            id: 'l4_1_e1',
            type: 'write_query',
            datasetId: 'hr',
            prompt: 'Join "employees" (alias e) with "departments" (alias d) to show first_name, last_name, and department_name.',
            defaultQuery: 'SELECT e.first_name, e.last_name, d.department_name FROM employees e INNER JOIN departments d ON e.department_id = d.department_id;',
            targetQuery: 'SELECT e.first_name, e.last_name, d.department_name FROM employees e INNER JOIN departments d ON e.department_id = d.department_id;',
            explanation: 'An INNER JOIN matches records where e.department_id equals d.department_id.',
            xpReward: 15,
          },
          {
            id: 'l4_1_e2',
            type: 'write_query',
            datasetId: 'ecommerce',
            prompt: 'Use a LEFT JOIN between "customers" (alias c) and "orders" (alias o) to show customer_id, first_name, and order_id.',
            defaultQuery: 'SELECT c.customer_id, c.first_name, o.order_id FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id;',
            targetQuery: 'SELECT c.customer_id, c.first_name, o.order_id FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id;',
            explanation: 'LEFT JOIN keeps all customers even if they have not yet made any orders (o.order_id will be NULL).',
            xpReward: 15,
          },
        ],
      },
      {
        id: 'l4_2',
        levelId: 4,
        title: 'Multi-Table Joins & Self Joins',
        description: 'Link 3+ tables and match hierarchical organizational data.',
        durationMinutes: 9,
        topics: ['Chaining Joins', 'SELF JOIN', 'Anti-Joins with IS NULL'],
        summaryMarkdown: `
### Self Joins for Hierarchies:
A table can be joined to itself to model parent-child relationships (like employees and their managers):
\`\`\`sql
SELECT emp.first_name AS employee, mgr.first_name AS manager
FROM employees emp
LEFT JOIN employees mgr ON emp.manager_id = mgr.employee_id;
\`\`\`
        `,
        exercises: [
          {
            id: 'l4_2_e1',
            type: 'write_query',
            datasetId: 'hr',
            prompt: 'Write a SELF JOIN on "employees" to list each employee\'s first_name as "employee" and their manager\'s first_name as "manager". Use LEFT JOIN so leaders without managers appear.',
            defaultQuery: 'SELECT emp.first_name AS employee, mgr.first_name AS manager FROM employees emp LEFT JOIN employees mgr ON emp.manager_id = mgr.employee_id;',
            targetQuery: 'SELECT emp.first_name AS employee, mgr.first_name AS manager FROM employees emp LEFT JOIN employees mgr ON emp.manager_id = mgr.employee_id;',
            explanation: 'SELF JOIN joins the employees table to itself using the manager_id foreign key.',
            xpReward: 15,
          },
        ],
      },
    ],
  },
  {
    id: 5,
    number: 5,
    title: 'String, Date & Data Cleaning',
    subtitle: 'Text transformation, Date parsing, COALESCE, and CAST',
    color: '#F59E0B', // amber
    iconName: 'tool',
    lessons: [
      {
        id: 'l5_1',
        levelId: 5,
        title: 'Data Cleaning Functions',
        description: 'UPPER, LOWER, LENGTH, SUBSTRING, COALESCE, and CAST.',
        durationMinutes: 7,
        topics: ['UPPER / LOWER', 'SUBSTR & LENGTH', 'COALESCE for NULLs', 'CAST & Type conversions'],
        summaryMarkdown: `
### String & Cleaning Essentials:
- \`UPPER(name)\` / \`LOWER(email)\`: Case normalization
- \`SUBSTR(text, start, length)\`: Extract parts of string
- \`COALESCE(val1, val2, 'Default')\`: Return first non-null argument
- \`CAST(price AS INTEGER)\`: Convert between data types
        `,
        exercises: [
          {
            id: 'l5_1_e1',
            type: 'write_query',
            datasetId: 'ecommerce',
            prompt: 'Convert all customer emails to lowercase and first names to uppercase in "customers".',
            defaultQuery: 'SELECT UPPER(first_name) AS upper_name, LOWER(email) AS lower_email FROM customers;',
            targetQuery: 'SELECT UPPER(first_name) AS upper_name, LOWER(email) AS lower_email FROM customers;',
            explanation: 'UPPER and LOWER normalize string data for clean reporting.',
            xpReward: 15,
          },
          {
            id: 'l5_1_e2',
            type: 'fill_blank',
            prompt: 'Which function returns the first non-null value among its arguments?',
            template: 'SELECT ___(phone_number, email, \'No Contact\') FROM customers;',
            blankOptions: ['COALESCE', 'NULLIF', 'NVL2', 'IFNULL'],
            correctBlank: 'COALESCE',
            explanation: 'COALESCE is standard SQL for replacing NULL values with fallbacks.',
            xpReward: 5,
          },
        ],
      },
    ],
  },
  {
    id: 6,
    number: 6,
    title: 'Subqueries & Nested Conditions',
    subtitle: 'Correlated subqueries, EXISTS, IN, and Derived Tables',
    color: '#06B6D4', // cyan
    iconName: 'layers',
    lessons: [
      {
        id: 'l6_1',
        levelId: 6,
        title: 'Subqueries in WHERE and FROM',
        description: 'Execute queries inside queries to solve dynamic comparisons.',
        durationMinutes: 8,
        topics: ['Scalar Subqueries', 'IN Subqueries', 'EXISTS / NOT EXISTS', 'Derived Tables'],
        summaryMarkdown: `
### Subquery Examples:
Find employees earning above the company-wide average salary:
\`\`\`sql
SELECT first_name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
\`\`\`
The subquery inside the parentheses calculates the average dynamically!
        `,
        exercises: [
          {
            id: 'l6_1_e1',
            type: 'write_query',
            datasetId: 'hr',
            prompt: 'Find all employees earning more than the company average salary. Select first_name, job_title, and salary.',
            defaultQuery: 'SELECT first_name, job_title, salary FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);',
            targetQuery: 'SELECT first_name, job_title, salary FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);',
            explanation: 'The subquery dynamically calculates AVG(salary) without hardcoding values.',
            xpReward: 15,
          },
        ],
      },
    ],
  },
  {
    id: 7,
    number: 7,
    title: 'Set Operations',
    subtitle: 'Combine datasets using UNION, UNION ALL, INTERSECT, and EXCEPT',
    color: '#6366F1', // indigo
    iconName: 'disc',
    lessons: [
      {
        id: 'l7_1',
        levelId: 7,
        title: 'UNION vs UNION ALL',
        description: 'Stack tables vertically and manage duplicates.',
        durationMinutes: 6,
        topics: ['UNION', 'UNION ALL', 'Column alignment rules', 'INTERSECT & EXCEPT'],
        summaryMarkdown: `
### Set Operations
- **UNION**: Combines queries and removes duplicates (slower due to deduping sort)
- **UNION ALL**: Combines queries while preserving all duplicates (faster)
- **INTERSECT**: Returns rows common to both queries
- **EXCEPT**: Returns rows in the first query not present in the second
        `,
        exercises: [
          {
            id: 'l7_1_e1',
            type: 'mcq',
            prompt: 'What is the primary difference between UNION and UNION ALL?',
            options: [
              'UNION removes duplicate records, while UNION ALL keeps all records',
              'UNION only works on numbers, UNION ALL works on strings',
              'UNION requires different column counts, UNION ALL requires same',
              'UNION ALL can only join tables horizontally',
            ],
            correctAnswerIndex: 0,
            explanation: 'UNION executes a deduplication step; UNION ALL appends the result sets directly.',
            xpReward: 5,
          },
        ],
      },
    ],
  },
  {
    id: 8,
    number: 8,
    title: 'Common Table Expressions (CTEs)',
    subtitle: 'The WITH clause for clean, readable, modular SQL logic',
    color: '#84CC16', // lime
    iconName: 'code',
    lessons: [
      {
        id: 'l8_1',
        levelId: 8,
        title: 'Building CTEs with WITH',
        description: 'Break complex queries into step-by-step named temporary result sets.',
        durationMinutes: 8,
        topics: ['WITH syntax', 'Multiple CTEs', 'Readability advantages over nested subqueries'],
        summaryMarkdown: `
### Why CTEs?
CTEs make code readable and maintainable:
\`\`\`sql
WITH HighEarningDepts AS (
  SELECT department_id, AVG(salary) as avg_sal
  FROM employees
  GROUP BY department_id
  HAVING AVG(salary) > 100000
)
SELECT d.department_name, h.avg_sal
FROM HighEarningDepts h
JOIN departments d ON h.department_id = d.department_id;
\`\`\`
        `,
        exercises: [
          {
            id: 'l8_1_e1',
            type: 'write_query',
            datasetId: 'ecommerce',
            prompt: 'Write a CTE named "CustomerTotals" that groups orders by customer_id and calculates SUM(total_amount) as total_spent, then select all rows from CustomerTotals.',
            defaultQuery: 'WITH CustomerTotals AS (\n  SELECT customer_id, SUM(total_amount) AS total_spent\n  FROM orders\n  GROUP BY customer_id\n)\nSELECT * FROM CustomerTotals;',
            targetQuery: 'WITH CustomerTotals AS (SELECT customer_id, SUM(total_amount) AS total_spent FROM orders GROUP BY customer_id) SELECT * FROM CustomerTotals;',
            explanation: 'A CTE defines a reusable named block that feeds directly into the main query.',
            xpReward: 15,
          },
        ],
      },
    ],
  },
  {
    id: 9,
    number: 9,
    title: 'Window Functions',
    subtitle: 'ROW_NUMBER, RANK, DENSE_RANK, LEAD, LAG, and Running Totals',
    color: '#E11D48', // rose
    iconName: 'trending-up',
    lessons: [
      {
        id: 'l9_1',
        levelId: 9,
        title: 'OVER(), PARTITION BY, and Ranking',
        description: 'Compute analytics without collapsing rows into a single group.',
        durationMinutes: 10,
        topics: ['OVER clause', 'PARTITION BY', 'ROW_NUMBER()', 'RANK() vs DENSE_RANK()'],
        summaryMarkdown: `
### Window Functions
Unlike GROUP BY, window functions retain all individual rows while calculating metrics across partitions:
\`\`\`sql
SELECT 
  first_name, 
  salary, 
  department_id,
  RANK() OVER(PARTITION BY department_id ORDER BY salary DESC) as rank_in_dept
FROM employees;
\`\`\`
        `,
        exercises: [
          {
            id: 'l9_1_e1',
            type: 'write_query',
            datasetId: 'hr',
            prompt: 'Assign a salary rank to each employee across the company using RANK() OVER(ORDER BY salary DESC). Select first_name, salary, and the rank column as "salary_rank".',
            defaultQuery: 'SELECT first_name, salary, RANK() OVER(ORDER BY salary DESC) AS salary_rank FROM employees;',
            targetQuery: 'SELECT first_name, salary, RANK() OVER(ORDER BY salary DESC) AS salary_rank FROM employees;',
            explanation: 'RANK() assigns descending ranks based on salary.',
            xpReward: 15,
          },
        ],
      },
    ],
  },
  {
    id: 10,
    number: 10,
    title: 'Advanced Data Analytics & Business KPIs',
    subtitle: 'RFM segmentation, Cohort retention, Churn, and MoM growth',
    color: '#14B8A6', // teal
    iconName: 'activity',
    lessons: [
      {
        id: 'l10_1',
        levelId: 10,
        title: 'Key Business Metrics & Cohort Analysis',
        description: 'Calculate Customer Lifetime Value (LTV), AOV, Churn, and MoM trends.',
        durationMinutes: 10,
        topics: ['Average Order Value (AOV)', 'RFM Analysis', 'Retention & Churn', 'Time-series growth'],
        summaryMarkdown: `
### Essential Business Formulas in SQL:
- **Average Order Value (AOV)**: \`SUM(total_amount) / COUNT(order_id)\`
- **Customer Lifetime Value (LTV)**: Total historical revenue generated per customer
- **RFM Segmentation**: Recency (last purchase), Frequency (count), Monetary (total revenue)
        `,
        exercises: [
          {
            id: 'l10_1_e1',
            type: 'write_query',
            datasetId: 'ecommerce',
            prompt: 'Calculate the overall Average Order Value (AOV) from the "orders" table (SUM of total_amount divided by COUNT of order_id) as "aov".',
            defaultQuery: 'SELECT ROUND(SUM(total_amount) / COUNT(order_id), 2) AS aov FROM orders;',
            targetQuery: 'SELECT ROUND(SUM(total_amount) / COUNT(order_id), 2) AS aov FROM orders;',
            explanation: 'AOV measures the average spending per completed transaction.',
            xpReward: 15,
          },
        ],
      },
    ],
  },
  {
    id: 11,
    number: 11,
    title: 'Database Design & DDL',
    subtitle: 'CREATE TABLE, Constraints, Normalization (1NF/2NF/3NF), and ACID',
    color: '#F97316', // orange
    iconName: 'server',
    lessons: [
      {
        id: 'l11_1',
        levelId: 11,
        title: 'Table Schemas, Constraints & Normalization',
        description: 'Design robust schemas with PRIMARY KEY, FOREIGN KEY, CHECK, and 3NF.',
        durationMinutes: 8,
        topics: ['CREATE TABLE', 'Foreign Key Constraints', '1NF, 2NF, 3NF Normalization', 'ACID Transactions'],
        summaryMarkdown: `
### Normalization (3NF)
- **1NF**: Atomic values, no repeating groups
- **2NF**: In 1NF + all non-key columns depend on the whole primary key
- **3NF**: In 2NF + no transitive dependencies (no non-key column depends on another non-key column)
        `,
        exercises: [
          {
            id: 'l11_1_e1',
            type: 'mcq',
            prompt: 'Which property in ACID guarantees that all parts of a transaction succeed or all fail together?',
            options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
            correctAnswerIndex: 0,
            explanation: 'Atomicity ensures "all-or-nothing" execution for database transactions.',
            xpReward: 5,
          },
        ],
      },
    ],
  },
  {
    id: 12,
    number: 12,
    title: 'SQL Performance & Optimization',
    subtitle: 'Execution plans, Indexes, EXPLAIN, and Sargable queries',
    color: '#0284C7', // sky
    iconName: 'zap',
    lessons: [
      {
        id: 'l12_1',
        levelId: 12,
        title: 'Indexes & Query Bottlenecks',
        description: 'Speed up queries by 100x using composite indexes and index scans.',
        durationMinutes: 9,
        topics: ['EXPLAIN QUERY PLAN', 'B-Tree Indexes', 'Full Table Scans vs Index Lookups', 'Sargable WHERE clauses'],
        summaryMarkdown: `
### Query Optimization Rules:
- Avoid wrapping filtered columns in functions like \`WHERE YEAR(order_date) = 2024\` (not sargable); use \`WHERE order_date >= '2024-01-01' AND order_date < '2025-01-01'\` instead!
- Only \`SELECT\` columns you need; avoid \`SELECT *\` in production.
- Use \`EXPLAIN QUERY PLAN\` to inspect how SQLite or Postgres executes your query.
        `,
        exercises: [
          {
            id: 'l12_1_e1',
            type: 'write_query',
            datasetId: 'ecommerce',
            prompt: 'Run EXPLAIN QUERY PLAN on "SELECT * FROM customers WHERE city = \'London\';" to inspect the query execution strategy.',
            defaultQuery: 'EXPLAIN QUERY PLAN SELECT * FROM customers WHERE city = \'London\';',
            targetQuery: 'EXPLAIN QUERY PLAN SELECT * FROM customers WHERE city = \'London\';',
            explanation: 'EXPLAIN QUERY PLAN displays the internal SQLite virtual database engine steps (SCAN TABLE customers).',
            xpReward: 15,
          },
        ],
      },
    ],
  },
  {
    id: 13,
    number: 13,
    title: 'Data Warehousing & Analytics Engineering',
    subtitle: 'OLTP vs OLAP, Fact vs Dimension, Star Schema, and dbt concepts',
    color: '#8B5CF6', // violet
    iconName: 'archive',
    lessons: [
      {
        id: 'l13_1',
        levelId: 13,
        title: 'Dimensional Modeling & Star Schema',
        description: 'Design analytics-first data warehouses with fact and dimension tables.',
        durationMinutes: 9,
        topics: ['OLTP vs OLAP', 'Fact Tables (metrics)', 'Dimension Tables (context)', 'Star vs Snowflake Schema', 'dbt'],
        summaryMarkdown: `
### OLTP vs OLAP
- **OLTP**: Row-oriented, highly normalized (3NF), fast inserts/updates for operational apps.
- **OLAP**: Columnar, dimensional (Star Schema), denormalized for lightning-fast aggregated analytical scans.
        `,
        exercises: [
          {
            id: 'l13_1_e1',
            type: 'mcq',
            prompt: 'In a Star Schema, which table holds numerical metrics like revenue, quantity, and discount?',
            options: ['Fact Table', 'Dimension Table', 'Bridge Table', 'Lookup Table'],
            correctAnswerIndex: 0,
            explanation: 'Fact tables store quantitative measurements and foreign keys to dimension tables.',
            xpReward: 5,
          },
        ],
      },
    ],
  },
  {
    id: 14,
    number: 14,
    title: 'SQL Dialects & Cloud Data Warehouses',
    subtitle: 'PostgreSQL, MySQL, SQL Server, BigQuery, Snowflake, and SQLite differences',
    color: '#D97706', // amber dark
    iconName: 'globe',
    lessons: [
      {
        id: 'l14_1',
        levelId: 14,
        title: 'Dialect Comparison & Migration Guide',
        description: 'Know syntax differences across BigQuery, Snowflake, Postgres, and SQLite.',
        durationMinutes: 8,
        topics: ['Date Arithmetic differences', 'Pagination (LIMIT vs OFFSET vs TOP)', 'String concatenation (|| vs CONCAT)', 'Window functions support'],
        summaryMarkdown: `
### Syntax Differences Cheat Sheet:
| Feature | SQLite / Postgres | SQL Server (T-SQL) | BigQuery | Snowflake |
|---|---|---|---|---|
| String Concat | \`'A' || 'B'\` | \`'A' + 'B'\` | \`CONCAT('A', 'B')\` | \`'A' || 'B'\` |
| Limit Rows | \`LIMIT 10\` | \`TOP 10\` | \`LIMIT 10\` | \`LIMIT 10\` |
| Date Add | \`DATE('now', '+1 day')\` | \`DATEADD(day, 1, GETDATE())\` | \`DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY)\` | \`DATEADD(day, 1, CURRENT_DATE())\` |
        `,
        exercises: [
          {
            id: 'l14_1_e1',
            type: 'mcq',
            prompt: 'How does Microsoft SQL Server limit the first 10 rows of a query result?',
            options: ['SELECT TOP 10 ...', '... LIMIT 10', '... MAXROWS 10', 'FETCH 10 ONLY'],
            correctAnswerIndex: 0,
            explanation: 'T-SQL in SQL Server uses SELECT TOP N at the beginning of the statement.',
            xpReward: 5,
          },
        ],
      },
    ],
  },
];
