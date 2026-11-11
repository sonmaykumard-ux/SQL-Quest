import { Project } from '../types';

export const PORTFOLIO_PROJECTS: Project[] = [
  {
    id: 'proj_ecommerce',
    number: 1,
    title: 'E-Commerce Revenue & Retention Analysis',
    category: 'Retail & Commercial Analytics',
    datasetId: 'ecommerce',
    scenario: 'You are the Lead Data Analyst for NovaRetail, an expanding online consumer store. The Chief Commercial Officer needs actionable metrics on customer lifetime spend, top-performing product categories, and order fulfillment status.',
    difficulty: 'Beginner',
    estimatedHours: '1 - 2 hours',
    skillsLearned: ['Multi-table JOINs', 'Revenue Aggregations', 'GROUP BY & HAVING', 'Customer Lifetime Value'],
    tasks: [
      {
        id: 'p1_t1',
        taskNumber: 1,
        title: 'Total Revenue by Product Category',
        businessQuestion: 'Which product categories bring in the highest revenue? Calculate total units sold and total revenue generated for each category, sorted from highest to lowest revenue.',
        hint: 'Join products with order_items on product_id, sum the total product sales (quantity * unit_price), and group by products.category.',
        solutionQuery: `
SELECT 
  p.category, 
  SUM(oi.quantity) AS total_units_sold, 
  ROUND(SUM(oi.quantity * oi.unit_price), 2) AS total_revenue
FROM products p
JOIN order_items oi ON p.product_id = oi.product_id
GROUP BY p.category
ORDER BY total_revenue DESC;
        `.trim(),
        explanation: 'Joining product inventory data with line-item transactions calculates granular revenue by category.',
      },
      {
        id: 'p1_t2',
        taskNumber: 2,
        title: 'High-Value Customer Ranking',
        businessQuestion: 'Identify the top customers based on total historical spending. Display first_name, last_name, country, and total_spent for customers who have spent more than $200.',
        hint: 'Join customers with orders on customer_id, group by customer attributes, and filter using HAVING SUM(total_amount) > 200.',
        solutionQuery: `
SELECT 
  c.first_name, 
  c.last_name, 
  c.country, 
  ROUND(SUM(o.total_amount), 2) AS total_spent
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.first_name, c.last_name, c.country
HAVING SUM(o.total_amount) > 200
ORDER BY total_spent DESC;
        `.trim(),
        explanation: 'HAVING filters the aggregated revenue results per customer.',
      },
    ],
  },
  {
    id: 'proj_hr',
    number: 2,
    title: 'Enterprise HR & Compensation Equity Analytics',
    category: 'People & Organizational Analytics',
    datasetId: 'hr',
    scenario: 'The Chief People Officer requires an executive audit of department compensation distribution, manager spans of control, and correlation between performance ratings and salaries.',
    difficulty: 'Intermediate',
    estimatedHours: '2 hours',
    skillsLearned: ['SELF JOINs', 'Window Functions', 'Departmental Budget Analysis', 'Performance Correlation'],
    tasks: [
      {
        id: 'p2_t1',
        taskNumber: 1,
        title: 'Department Salary Breakdown & Headcount',
        businessQuestion: 'For each department, compute the total headcount, minimum salary, maximum salary, and average salary rounded to 2 decimal places.',
        hint: 'Join departments with employees, group by department_name, and run COUNT, MIN, MAX, AVG.',
        solutionQuery: `
SELECT 
  d.department_name, 
  COUNT(e.employee_id) AS headcount, 
  MIN(e.salary) AS min_salary, 
  MAX(e.salary) AS max_salary, 
  ROUND(AVG(e.salary), 2) AS avg_salary
FROM departments d
JOIN employees e ON d.department_id = e.department_id
GROUP BY d.department_name
ORDER BY avg_salary DESC;
        `.trim(),
        explanation: 'Provides essential HR benchmarks across corporate business units.',
      },
      {
        id: 'p2_t2',
        taskNumber: 2,
        title: 'Salary Ranking Within Department',
        businessQuestion: 'Rank employees within their department by salary using DENSE_RANK(). Display department_name, first_name, job_title, salary, and the rank.',
        hint: 'Use DENSE_RANK() OVER (PARTITION BY e.department_id ORDER BY e.salary DESC).',
        solutionQuery: `
SELECT 
  d.department_name, 
  e.first_name, 
  e.job_title, 
  e.salary, 
  DENSE_RANK() OVER(PARTITION BY d.department_id ORDER BY e.salary DESC) AS dept_salary_rank
FROM employees e
JOIN departments d ON e.department_id = d.department_id
ORDER BY d.department_name, dept_salary_rank;
        `.trim(),
        explanation: 'Partitioning window functions reveals relative compensation standing within each team.',
      },
    ],
  },
  {
    id: 'proj_rfm',
    number: 3,
    title: 'Customer Segmentation & RFM Modeling',
    category: 'Marketing Science & Growth',
    datasetId: 'ecommerce',
    scenario: 'Classify e-commerce buyers into distinct marketing personas (Champions, Loyal Customers, At Risk) using Recency, Frequency, and Monetary scoring.',
    difficulty: 'Advanced',
    estimatedHours: '3 hours',
    skillsLearned: ['Complex CTEs', 'CASE WHEN Segmentation', 'Frequency Analysis', 'Monetary Aggregation'],
    tasks: [
      {
        id: 'p3_t1',
        taskNumber: 1,
        title: 'Customer Frequency & Monetary Metrics',
        businessQuestion: 'Build a CTE that computes order count (frequency) and total spending (monetary) for each customer, then categorize them as "High Value" (spent > $300), "Medium Value" ($100-$300), or "Low Value".',
        hint: 'Use a CTE or subquery grouping orders by customer_id, then apply CASE WHEN in the outer query.',
        solutionQuery: `
WITH CustomerMetrics AS (
  SELECT 
    c.customer_id, 
    c.first_name, 
    COUNT(o.order_id) AS order_count, 
    SUM(o.total_amount) AS total_spend
  FROM customers c
  LEFT JOIN orders o ON c.customer_id = o.customer_id
  GROUP BY c.customer_id, c.first_name
)
SELECT 
  first_name, 
  order_count, 
  COALESCE(total_spend, 0) AS total_spend,
  CASE 
    WHEN total_spend >= 300 THEN 'High Value'
    WHEN total_spend >= 100 THEN 'Medium Value'
    ELSE 'Low Value'
  END AS customer_tier
FROM CustomerMetrics
ORDER BY total_spend DESC;
        `.trim(),
        explanation: 'Translates raw SQL transactional records into executive customer tiers for lifecycle marketing.',
      },
    ],
  },
  {
    id: 'proj_banking',
    number: 4,
    title: 'Banking Risk & Transaction Outlier Audit',
    category: 'Financial Risk & Fraud',
    datasetId: 'banking',
    scenario: 'Identify abnormal debit spending patterns, assess customer debt-to-balance ratios, and find active loan risks for the risk compliance committee.',
    difficulty: 'Intermediate',
    estimatedHours: '2 hours',
    skillsLearned: ['Financial Ledger Auditing', 'Subqueries', 'Credit Score Analysis', 'Conditional Aggregates'],
    tasks: [
      {
        id: 'p4_t1',
        taskNumber: 1,
        title: 'Customer Total Liquidity Across Accounts',
        businessQuestion: 'Calculate total liquid balance across all checking and savings accounts for each customer. Show full_name, credit_score, and total_balance.',
        hint: 'Join bank_customers with accounts on customer_id, group by customer, and sum balance.',
        solutionQuery: `
SELECT 
  bc.full_name, 
  bc.credit_score, 
  ROUND(SUM(a.balance), 2) AS total_balance
FROM bank_customers bc
JOIN accounts a ON bc.customer_id = a.customer_id
GROUP BY bc.customer_id, bc.full_name, bc.credit_score
ORDER BY total_balance DESC;
        `.trim(),
        explanation: 'Consolidates multiple checking/savings accounts per customer to compute net asset exposure.',
      },
    ],
  },
  {
    id: 'proj_sales_funnel',
    number: 5,
    title: 'B2B Sales Quota Attainment & Pipeline',
    category: 'Revenue Operations (RevOps)',
    datasetId: 'sales',
    scenario: 'Evaluate sales rep performance against quarterly targets, compute commission earnings, and identify deal stage conversion bottlenecks.',
    difficulty: 'Intermediate',
    estimatedHours: '2 hours',
    skillsLearned: ['Quota Attainment %', 'Target vs Actuals', 'Regional Aggregations', 'Sales Operations'],
    tasks: [
      {
        id: 'p5_t1',
        taskNumber: 1,
        title: 'Sales Rep Quota Attainment Percentage',
        businessQuestion: 'For each sales rep, calculate their closed-won revenue, compare it to their Q1-2024 target, and compute their attainment percentage.',
        hint: 'Join sales_reps with transactions (filter stage = "Closed Won") and targets on rep_id.',
        solutionQuery: `
SELECT 
  sr.name AS rep_name, 
  t.target_revenue, 
  SUM(tx.deal_amount) AS won_revenue, 
  ROUND((SUM(tx.deal_amount) / t.target_revenue) * 100, 1) AS attainment_pct
FROM sales_reps sr
JOIN targets t ON sr.rep_id = t.rep_id
JOIN transactions tx ON sr.rep_id = tx.rep_id
WHERE tx.stage = 'Closed Won'
GROUP BY sr.rep_id, sr.name, t.target_revenue
ORDER BY attainment_pct DESC;
        `.trim(),
        explanation: 'Compares real closed deals against corporate goals to measure team performance.',
      },
    ],
  },
  {
    id: 'proj_kpi_dashboard',
    number: 6,
    title: 'Clinical Operations & Healthcare Utilization',
    category: 'Healthcare Operations & BI Prep',
    datasetId: 'healthcare',
    scenario: 'Prepare clean analytical tables for a Power BI hospital dashboard tracking doctor utilization, patient copay balances, and appointment volume.',
    difficulty: 'Advanced',
    estimatedHours: '2 - 3 hours',
    skillsLearned: ['Star Schema Preparation', 'Healthcare Revenue Cycle', 'Doctor Utilization', 'Date Metrics'],
    tasks: [
      {
        id: 'p6_t1',
        taskNumber: 1,
        title: 'Physician Revenue & Patient Encounters',
        businessQuestion: 'For each doctor, count their total appointments and sum the total clinical fees generated, ordered by revenue descending.',
        hint: 'Join doctors with appointments on doctor_id, group by doctor attributes, and compute COUNT and SUM.',
        solutionQuery: `
SELECT 
  d.doctor_name, 
  d.specialty, 
  COUNT(a.appointment_id) AS total_encounters, 
  SUM(a.fee) AS total_fees_generated
FROM doctors d
LEFT JOIN appointments a ON d.doctor_id = a.doctor_id
GROUP BY d.doctor_id, d.doctor_name, d.specialty
ORDER BY total_fees_generated DESC;
        `.trim(),
        explanation: 'Generates core operational KPIs for clinic management and physician productivity.',
      },
    ],
  },
];
