import { Dataset } from '../types';

export const ECOMMERCE_DATASET: Dataset = {
  id: 'ecommerce',
  name: 'E-Commerce Store',
  category: 'Retail & Consumer',
  description: 'Online retail store with customers, product catalog, orders, items, and payments.',
  initSql: `
    CREATE TABLE IF NOT EXISTS customers (
      customer_id INTEGER PRIMARY KEY,
      first_name TEXT,
      last_name TEXT,
      email TEXT,
      city TEXT,
      country TEXT,
      signup_date TEXT
    );

    CREATE TABLE IF NOT EXISTS products (
      product_id INTEGER PRIMARY KEY,
      product_name TEXT,
      category TEXT,
      price REAL,
      stock_quantity INTEGER
    );

    CREATE TABLE IF NOT EXISTS orders (
      order_id INTEGER PRIMARY KEY,
      customer_id INTEGER,
      order_date TEXT,
      total_amount REAL,
      status TEXT,
      FOREIGN KEY(customer_id) REFERENCES customers(customer_id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      item_id INTEGER PRIMARY KEY,
      order_id INTEGER,
      product_id INTEGER,
      quantity INTEGER,
      unit_price REAL,
      FOREIGN KEY(order_id) REFERENCES orders(order_id),
      FOREIGN KEY(product_id) REFERENCES products(product_id)
    );

    CREATE TABLE IF NOT EXISTS payments (
      payment_id INTEGER PRIMARY KEY,
      order_id INTEGER,
      payment_method TEXT,
      amount REAL,
      payment_status TEXT,
      FOREIGN KEY(order_id) REFERENCES orders(order_id)
    );

    INSERT INTO customers VALUES 
    (1, 'Alice', 'Chen', 'alice.chen@email.com', 'San Francisco', 'USA', '2023-01-15'),
    (2, 'Bob', 'Smith', 'bob.smith@email.com', 'London', 'UK', '2023-02-20'),
    (3, 'Carla', 'Mendes', 'carla.m@email.com', 'São Paulo', 'Brazil', '2023-03-05'),
    (4, 'David', 'Kim', 'david.k@email.com', 'Seoul', 'South Korea', '2023-03-22'),
    (5, 'Elena', 'Rostova', 'elena.r@email.com', 'Berlin', 'Germany', '2023-04-10'),
    (6, 'Farhan', 'Khan', 'farhan.k@email.com', 'Dubai', 'UAE', '2023-05-18'),
    (7, 'Grace', 'Hopper', 'grace.h@email.com', 'New York', 'USA', '2023-06-01'),
    (8, 'Hiroshi', 'Tanaka', 'hiroshi.t@email.com', 'Tokyo', 'Japan', '2023-07-14');

    INSERT INTO products VALUES
    (101, 'Quantum Noise-Cancelling Headphones', 'Electronics', 199.99, 45),
    (102, 'Ergonomic Mechanical Keyboard', 'Electronics', 129.50, 80),
    (103, 'Organic Cotton Minimalist T-Shirt', 'Apparel', 28.00, 200),
    (104, 'All-Weather Trail Running Shoes', 'Footwear', 115.00, 60),
    (105, 'Insulated Stainless Water Bottle', 'Accessories', 24.99, 150),
    (106, 'Smart Fitness Tracker Pro', 'Electronics', 89.99, 95),
    (107, 'Waterproof Commuter Backpack', 'Accessories', 74.50, 40),
    (108, 'Ceramic Pour-Over Coffee Maker', 'Kitchen', 34.00, 30);

    INSERT INTO orders VALUES
    (1001, 1, '2024-01-10', 329.49, 'Completed'),
    (1002, 2, '2024-01-15', 129.50, 'Completed'),
    (1003, 1, '2024-02-01', 28.00, 'Completed'),
    (1004, 3, '2024-02-14', 199.99, 'Completed'),
    (1005, 4, '2024-02-28', 214.98, 'Shipped'),
    (1006, 5, '2024-03-05', 74.50, 'Completed'),
    (1007, 2, '2024-03-12', 314.99, 'Processing'),
    (1008, 7, '2024-03-18', 414.48, 'Completed');

    INSERT INTO order_items VALUES
    (1, 1001, 101, 1, 199.99),
    (2, 1001, 102, 1, 129.50),
    (3, 1002, 102, 1, 129.50),
    (4, 1003, 103, 1, 28.00),
    (5, 1004, 101, 1, 199.99),
    (6, 1005, 104, 1, 115.00),
    (7, 1005, 106, 1, 89.99),
    (8, 1006, 107, 1, 74.50),
    (9, 1007, 101, 1, 199.99),
    (10, 1007, 104, 1, 115.00),
    (11, 1008, 101, 2, 199.99),
    (12, 1008, 105, 1, 24.99);

    INSERT INTO payments VALUES
    (501, 1001, 'Credit Card', 329.49, 'Success'),
    (502, 1002, 'PayPal', 129.50, 'Success'),
    (503, 1003, 'Credit Card', 28.00, 'Success'),
    (504, 1004, 'Apple Pay', 199.99, 'Success'),
    (505, 1005, 'Credit Card', 214.98, 'Success'),
    (506, 1006, 'Debit Card', 74.50, 'Success'),
    (507, 1007, 'PayPal', 314.99, 'Pending'),
    (508, 1008, 'Credit Card', 414.48, 'Success');
  `,
  tables: [
    {
      name: 'customers',
      rowCount: 8,
      description: 'Customer personal details and signup geography.',
      columns: [
        { name: 'customer_id', type: 'INTEGER', isPrimary: true },
        { name: 'first_name', type: 'TEXT' },
        { name: 'last_name', type: 'TEXT' },
        { name: 'email', type: 'TEXT' },
        { name: 'city', type: 'TEXT' },
        { name: 'country', type: 'TEXT' },
        { name: 'signup_date', type: 'TEXT' },
      ],
    },
    {
      name: 'products',
      rowCount: 8,
      description: 'Inventory items, prices, and catalog categories.',
      columns: [
        { name: 'product_id', type: 'INTEGER', isPrimary: true },
        { name: 'product_name', type: 'TEXT' },
        { name: 'category', type: 'TEXT' },
        { name: 'price', type: 'REAL' },
        { name: 'stock_quantity', type: 'INTEGER' },
      ],
    },
    {
      name: 'orders',
      rowCount: 8,
      description: 'Customer transactions, dates, total amounts, and delivery status.',
      columns: [
        { name: 'order_id', type: 'INTEGER', isPrimary: true },
        { name: 'customer_id', type: 'INTEGER', isForeign: true },
        { name: 'order_date', type: 'TEXT' },
        { name: 'total_amount', type: 'REAL' },
        { name: 'status', type: 'TEXT' },
      ],
    },
    {
      name: 'order_items',
      rowCount: 12,
      description: 'Line items linking specific products to orders.',
      columns: [
        { name: 'item_id', type: 'INTEGER', isPrimary: true },
        { name: 'order_id', type: 'INTEGER', isForeign: true },
        { name: 'product_id', type: 'INTEGER', isForeign: true },
        { name: 'quantity', type: 'INTEGER' },
        { name: 'unit_price', type: 'REAL' },
      ],
    },
    {
      name: 'payments',
      rowCount: 8,
      description: 'Payment transactions, methods, and authorization status.',
      columns: [
        { name: 'payment_id', type: 'INTEGER', isPrimary: true },
        { name: 'order_id', type: 'INTEGER', isForeign: true },
        { name: 'payment_method', type: 'TEXT' },
        { name: 'amount', type: 'REAL' },
        { name: 'payment_status', type: 'TEXT' },
      ],
    },
  ],
};

export const HR_DATASET: Dataset = {
  id: 'hr',
  name: 'Human Resources & Talent',
  category: 'Enterprise / People Analytics',
  description: 'Organizational hierarchy, departments, employee compensation, and ratings.',
  initSql: `
    CREATE TABLE IF NOT EXISTS departments (
      department_id INTEGER PRIMARY KEY,
      department_name TEXT,
      location TEXT,
      budget REAL
    );

    CREATE TABLE IF NOT EXISTS employees (
      employee_id INTEGER PRIMARY KEY,
      first_name TEXT,
      last_name TEXT,
      department_id INTEGER,
      job_title TEXT,
      salary REAL,
      hire_date TEXT,
      manager_id INTEGER,
      FOREIGN KEY(department_id) REFERENCES departments(department_id)
    );

    CREATE TABLE IF NOT EXISTS performance_reviews (
      review_id INTEGER PRIMARY KEY,
      employee_id INTEGER,
      rating INTEGER,
      review_year INTEGER,
      feedback TEXT,
      FOREIGN KEY(employee_id) REFERENCES employees(employee_id)
    );

    INSERT INTO departments VALUES
    (10, 'Engineering', 'Building A - Floor 4', 1200000),
    (20, 'Data & Analytics', 'Building A - Floor 3', 850000),
    (30, 'Product & Design', 'Building B - Floor 2', 600000),
    (40, 'Sales & Marketing', 'Building B - Floor 1', 950000),
    (50, 'Human Resources', 'Building C - Floor 1', 400000);

    INSERT INTO employees VALUES
    (1, 'Sarah', 'Connor', 10, 'VP of Engineering', 185000, '2019-03-15', NULL),
    (2, 'Marcus', 'Vance', 10, 'Senior Software Engineer', 135000, '2020-06-01', 1),
    (3, 'Priya', 'Patel', 20, 'Head of Analytics', 160000, '2019-08-20', NULL),
    (4, 'Liam', 'O''Connor', 20, 'Senior Data Analyst', 115000, '2021-02-10', 3),
    (5, 'Chloe', 'Dubois', 20, 'Junior Data Analyst', 72000, '2023-01-15', 4),
    (6, 'Kenji', 'Sato', 10, 'Backend Engineer', 110000, '2021-09-01', 1),
    (7, 'Maya', 'Lin', 30, 'Lead Product Designer', 125000, '2020-11-12', NULL),
    (8, 'Carlos', 'Reyes', 40, 'Sales Director', 140000, '2018-05-04', NULL),
    (9, 'Zoe', 'Kovacs', 40, 'Account Executive', 82000, '2022-04-18', 8),
    (10, 'Aiden', 'Taylor', 50, 'HR Business Partner', 92000, '2021-07-25', NULL);

    INSERT INTO performance_reviews VALUES
    (101, 2, 5, 2023, 'Exceeded all architectural delivery targets.'),
    (102, 4, 5, 2023, 'Created company-wide SQL analytics warehouse models.'),
    (103, 5, 4, 2023, 'Demonstrated quick mastery of complex analytical queries.'),
    (104, 6, 4, 2023, 'Consistent code reliability and API optimization.'),
    (105, 9, 3, 2023, 'Met quota during Q2 and Q4, pipeline development needed.');
  `,
  tables: [
    {
      name: 'departments',
      rowCount: 5,
      description: 'Company divisions, physical buildings, and annual budgets.',
      columns: [
        { name: 'department_id', type: 'INTEGER', isPrimary: true },
        { name: 'department_name', type: 'TEXT' },
        { name: 'location', type: 'TEXT' },
        { name: 'budget', type: 'REAL' },
      ],
    },
    {
      name: 'employees',
      rowCount: 10,
      description: 'Employee demographics, roles, managers, and base compensation.',
      columns: [
        { name: 'employee_id', type: 'INTEGER', isPrimary: true },
        { name: 'first_name', type: 'TEXT' },
        { name: 'last_name', type: 'TEXT' },
        { name: 'department_id', type: 'INTEGER', isForeign: true },
        { name: 'job_title', type: 'TEXT' },
        { name: 'salary', type: 'REAL' },
        { name: 'hire_date', type: 'TEXT' },
        { name: 'manager_id', type: 'INTEGER' },
      ],
    },
    {
      name: 'performance_reviews',
      rowCount: 5,
      description: 'Annual performance evaluations and qualitative feedback.',
      columns: [
        { name: 'review_id', type: 'INTEGER', isPrimary: true },
        { name: 'employee_id', type: 'INTEGER', isForeign: true },
        { name: 'rating', type: 'INTEGER' },
        { name: 'review_year', type: 'INTEGER' },
        { name: 'feedback', type: 'TEXT' },
      ],
    },
  ],
};

export const SALES_DATASET: Dataset = {
  id: 'sales',
  name: 'Global B2B Sales',
  category: 'Commercial & Revenue',
  description: 'B2B sales pipeline with sales reps, territories, revenue deals, and quota targets.',
  initSql: `
    CREATE TABLE IF NOT EXISTS regions (
      region_id INTEGER PRIMARY KEY,
      region_name TEXT,
      continent TEXT
    );

    CREATE TABLE IF NOT EXISTS sales_reps (
      rep_id INTEGER PRIMARY KEY,
      name TEXT,
      region_id INTEGER,
      hire_year INTEGER,
      commission_rate REAL,
      FOREIGN KEY(region_id) REFERENCES regions(region_id)
    );

    CREATE TABLE IF NOT EXISTS transactions (
      txn_id INTEGER PRIMARY KEY,
      rep_id INTEGER,
      client_name TEXT,
      deal_amount REAL,
      deal_date TEXT,
      stage TEXT,
      FOREIGN KEY(rep_id) REFERENCES sales_reps(rep_id)
    );

    CREATE TABLE IF NOT EXISTS targets (
      target_id INTEGER PRIMARY KEY,
      rep_id INTEGER,
      quarter TEXT,
      target_revenue REAL,
      FOREIGN KEY(rep_id) REFERENCES sales_reps(rep_id)
    );

    INSERT INTO regions VALUES
    (1, 'North America East', 'Americas'),
    (2, 'North America West', 'Americas'),
    (3, 'EMEA Central', 'Europe'),
    (4, 'Asia Pacific', 'Asia');

    INSERT INTO sales_reps VALUES
    (101, 'Jordan Bell', 1, 2021, 0.08),
    (102, 'Samantha Wu', 2, 2019, 0.10),
    (103, 'Matteo Rossi', 3, 2020, 0.09),
    (104, 'Ananya Sharma', 4, 2022, 0.07);

    INSERT INTO transactions VALUES
    (1, 101, 'Acme Corp', 45000, '2024-01-12', 'Closed Won'),
    (2, 102, 'TechNova Inc', 88000, '2024-01-28', 'Closed Won'),
    (3, 101, 'Starlight Media', 15000, '2024-02-05', 'Closed Won'),
    (4, 103, 'Nordic Retail Group', 62000, '2024-02-18', 'Closed Won'),
    (5, 104, 'Pacific FinTech', 94000, '2024-02-25', 'Closed Won'),
    (6, 102, 'CloudScale Labs', 120000, '2024-03-02', 'Closed Won'),
    (7, 103, 'Alpine Logistics', 34000, '2024-03-15', 'Negotiation'),
    (8, 104, 'Sakura Health', 51000, '2024-03-20', 'Closed Won');

    INSERT INTO targets VALUES
    (1, 101, 'Q1-2024', 50000),
    (2, 102, 'Q1-2024', 150000),
    (3, 103, 'Q1-2024', 80000),
    (4, 104, 'Q1-2024', 120000);
  `,
  tables: [
    {
      name: 'regions',
      rowCount: 4,
      description: 'Geographic sales sales territories.',
      columns: [
        { name: 'region_id', type: 'INTEGER', isPrimary: true },
        { name: 'region_name', type: 'TEXT' },
        { name: 'continent', type: 'TEXT' },
      ],
    },
    {
      name: 'sales_reps',
      rowCount: 4,
      description: 'Account executives, assigned territory, and commission percentages.',
      columns: [
        { name: 'rep_id', type: 'INTEGER', isPrimary: true },
        { name: 'name', type: 'TEXT' },
        { name: 'region_id', type: 'INTEGER', isForeign: true },
        { name: 'hire_year', type: 'INTEGER' },
        { name: 'commission_rate', type: 'REAL' },
      ],
    },
    {
      name: 'transactions',
      rowCount: 8,
      description: 'Individual deal contracts, client names, closing dates, and stages.',
      columns: [
        { name: 'txn_id', type: 'INTEGER', isPrimary: true },
        { name: 'rep_id', type: 'INTEGER', isForeign: true },
        { name: 'client_name', type: 'TEXT' },
        { name: 'deal_amount', type: 'REAL' },
        { name: 'deal_date', type: 'TEXT' },
        { name: 'stage', type: 'TEXT' },
      ],
    },
    {
      name: 'targets',
      rowCount: 4,
      description: 'Quarterly quota targets for performance tracking.',
      columns: [
        { name: 'target_id', type: 'INTEGER', isPrimary: true },
        { name: 'rep_id', type: 'INTEGER', isForeign: true },
        { name: 'quarter', type: 'TEXT' },
        { name: 'target_revenue', type: 'REAL' },
      ],
    },
  ],
};

export const BANKING_DATASET: Dataset = {
  id: 'banking',
  name: 'Retail & Commercial Banking',
  category: 'Financial Services',
  description: 'Bank customer accounts, credit scores, transaction audit trails, and personal loans.',
  initSql: `
    CREATE TABLE IF NOT EXISTS bank_customers (
      customer_id INTEGER PRIMARY KEY,
      full_name TEXT,
      credit_score INTEGER,
      city TEXT,
      join_year INTEGER
    );

    CREATE TABLE IF NOT EXISTS accounts (
      account_id INTEGER PRIMARY KEY,
      customer_id INTEGER,
      account_type TEXT,
      balance REAL,
      opened_date TEXT,
      FOREIGN KEY(customer_id) REFERENCES bank_customers(customer_id)
    );

    CREATE TABLE IF NOT EXISTS bank_transactions (
      trans_id INTEGER PRIMARY KEY,
      account_id INTEGER,
      trans_date TEXT,
      amount REAL,
      trans_type TEXT,
      category TEXT,
      FOREIGN KEY(account_id) REFERENCES accounts(account_id)
    );

    CREATE TABLE IF NOT EXISTS loans (
      loan_id INTEGER PRIMARY KEY,
      customer_id INTEGER,
      loan_amount REAL,
      interest_rate REAL,
      status TEXT,
      FOREIGN KEY(customer_id) REFERENCES bank_customers(customer_id)
    );

    INSERT INTO bank_customers VALUES
    (201, 'Arthur Pendelton', 745, 'Boston', 2018),
    (202, 'Beatriz Gomez', 680, 'Miami', 2021),
    (203, 'Cedric Robinson', 810, 'Seattle', 2015),
    (204, 'Daria Volkova', 720, 'Chicago', 2022),
    (205, 'Emre Yilmaz', 650, 'New York', 2023);

    INSERT INTO accounts VALUES
    (3001, 201, 'Checking', 4250.75, '2018-04-10'),
    (3002, 201, 'Savings', 35000.00, '2018-09-15'),
    (3003, 202, 'Checking', 1850.20, '2021-01-20'),
    (3004, 203, 'Checking', 12400.50, '2015-06-11'),
    (3005, 203, 'Investment', 145000.00, '2017-03-01'),
    (3006, 204, 'Savings', 8900.00, '2022-08-19'),
    (3007, 205, 'Checking', 950.00, '2023-02-14');

    INSERT INTO bank_transactions VALUES
    (1, 3001, '2024-03-01', -120.50, 'Debit', 'Groceries'),
    (2, 3001, '2024-03-05', 3500.00, 'Credit', 'Salary Deposit'),
    (3, 3002, '2024-03-10', 500.00, 'Credit', 'Transfer from Checking'),
    (4, 3003, '2024-03-12', -45.00, 'Debit', 'Dining'),
    (5, 3004, '2024-03-14', -1800.00, 'Debit', 'Mortgage'),
    (6, 3005, '2024-03-15', 1250.00, 'Credit', 'Dividend'),
    (7, 3007, '2024-03-16', -85.20, 'Debit', 'Utilities');

    INSERT INTO loans VALUES
    (701, 201, 250000, 4.25, 'Active'),
    (702, 202, 15000, 7.50, 'Active'),
    (703, 204, 35000, 5.80, 'Approved');
  `,
  tables: [
    {
      name: 'bank_customers',
      rowCount: 5,
      description: 'Account holders, credit scores, and customer longevity.',
      columns: [
        { name: 'customer_id', type: 'INTEGER', isPrimary: true },
        { name: 'full_name', type: 'TEXT' },
        { name: 'credit_score', type: 'INTEGER' },
        { name: 'city', type: 'TEXT' },
        { name: 'join_year', type: 'INTEGER' },
      ],
    },
    {
      name: 'accounts',
      rowCount: 7,
      description: 'Checking, savings, and investment ledger balances.',
      columns: [
        { name: 'account_id', type: 'INTEGER', isPrimary: true },
        { name: 'customer_id', type: 'INTEGER', isForeign: true },
        { name: 'account_type', type: 'TEXT' },
        { name: 'balance', type: 'REAL' },
        { name: 'opened_date', type: 'TEXT' },
      ],
    },
    {
      name: 'bank_transactions',
      rowCount: 7,
      description: 'Debits, credits, merchants, and money flow categories.',
      columns: [
        { name: 'trans_id', type: 'INTEGER', isPrimary: true },
        { name: 'account_id', type: 'INTEGER', isForeign: true },
        { name: 'trans_date', type: 'TEXT' },
        { name: 'amount', type: 'REAL' },
        { name: 'trans_type', type: 'TEXT' },
        { name: 'category', type: 'TEXT' },
      ],
    },
    {
      name: 'loans',
      rowCount: 3,
      description: 'Issued mortgages, personal loans, and APR terms.',
      columns: [
        { name: 'loan_id', type: 'INTEGER', isPrimary: true },
        { name: 'customer_id', type: 'INTEGER', isForeign: true },
        { name: 'loan_amount', type: 'REAL' },
        { name: 'interest_rate', type: 'REAL' },
        { name: 'status', type: 'TEXT' },
      ],
    },
  ],
};

export const HEALTHCARE_DATASET: Dataset = {
  id: 'healthcare',
  name: 'Healthcare & Clinical Center',
  category: 'Medical / Healthcare Analytics',
  description: 'Patients, physicians, diagnoses, appointment records, and insurance billings.',
  initSql: `
    CREATE TABLE IF NOT EXISTS patients (
      patient_id INTEGER PRIMARY KEY,
      name TEXT,
      age INTEGER,
      gender TEXT,
      blood_type TEXT,
      city TEXT
    );

    CREATE TABLE IF NOT EXISTS doctors (
      doctor_id INTEGER PRIMARY KEY,
      doctor_name TEXT,
      specialty TEXT,
      department_name TEXT,
      years_experience INTEGER
    );

    CREATE TABLE IF NOT EXISTS appointments (
      appointment_id INTEGER PRIMARY KEY,
      patient_id INTEGER,
      doctor_id INTEGER,
      appointment_date TEXT,
      diagnosis TEXT,
      fee REAL,
      status TEXT,
      FOREIGN KEY(patient_id) REFERENCES patients(patient_id),
      FOREIGN KEY(doctor_id) REFERENCES doctors(doctor_id)
    );

    CREATE TABLE IF NOT EXISTS billings (
      bill_id INTEGER PRIMARY KEY,
      appointment_id INTEGER,
      total_amount REAL,
      insurance_covered REAL,
      patient_paid REAL,
      payment_status TEXT,
      FOREIGN KEY(appointment_id) REFERENCES appointments(appointment_id)
    );

    INSERT INTO patients VALUES
    (1, 'Daniel Evans', 45, 'M', 'O+', 'Atlanta'),
    (2, 'Maria Santos', 32, 'F', 'A+', 'Savannah'),
    (3, 'Johnathan Wu', 68, 'M', 'B-', 'Atlanta'),
    (4, 'Rachel Green', 29, 'F', 'AB+', 'Roswell'),
    (5, 'Omar Al-Mansoor', 54, 'M', 'O-', 'Marietta');

    INSERT INTO doctors VALUES
    (101, 'Dr. Evelyn Reed', 'Cardiology', 'Internal Medicine', 16),
    (102, 'Dr. Julian Thorne', 'Neurology', 'Neurosciences', 12),
    (103, 'Dr. Aisha Morales', 'Pediatrics', 'Family Medicine', 8),
    (104, 'Dr. Robert Sterling', 'Orthopedics', 'Surgical Sciences', 20);

    INSERT INTO appointments VALUES
    (501, 1, 101, '2024-02-10', 'Hypertension Consultation', 250.00, 'Completed'),
    (502, 2, 103, '2024-02-14', 'Annual Wellness Check', 150.00, 'Completed'),
    (503, 3, 101, '2024-02-22', 'Arrhythmia Follow-up', 320.00, 'Completed'),
    (504, 4, 102, '2024-03-01', 'Migraine Evaluation', 280.00, 'Completed'),
    (505, 5, 104, '2024-03-08', 'Knee Joint Pain', 210.00, 'Completed'),
    (506, 1, 101, '2024-03-15', 'Cardio Stress Test', 450.00, 'Completed');

    INSERT INTO billings VALUES
    (901, 501, 250.00, 200.00, 50.00, 'Paid'),
    (902, 502, 150.00, 150.00, 0.00, 'Paid'),
    (903, 503, 320.00, 240.00, 80.00, 'Paid'),
    (904, 504, 280.00, 180.00, 100.00, 'Pending'),
    (905, 505, 210.00, 160.00, 50.00, 'Paid'),
    (906, 506, 450.00, 350.00, 100.00, 'Pending');
  `,
  tables: [
    {
      name: 'patients',
      rowCount: 5,
      description: 'Registered clinical patients and baseline demographics.',
      columns: [
        { name: 'patient_id', type: 'INTEGER', isPrimary: true },
        { name: 'name', type: 'TEXT' },
        { name: 'age', type: 'INTEGER' },
        { name: 'gender', type: 'TEXT' },
        { name: 'blood_type', type: 'TEXT' },
        { name: 'city', type: 'TEXT' },
      ],
    },
    {
      name: 'doctors',
      rowCount: 4,
      description: 'Hospital physician staff, medical department, and clinical tenure.',
      columns: [
        { name: 'doctor_id', type: 'INTEGER', isPrimary: true },
        { name: 'doctor_name', type: 'TEXT' },
        { name: 'specialty', type: 'TEXT' },
        { name: 'department_name', type: 'TEXT' },
        { name: 'years_experience', type: 'INTEGER' },
      ],
    },
    {
      name: 'appointments',
      rowCount: 6,
      description: 'Medical encounters, physician pairings, diagnoses, and consultation costs.',
      columns: [
        { name: 'appointment_id', type: 'INTEGER', isPrimary: true },
        { name: 'patient_id', type: 'INTEGER', isForeign: true },
        { name: 'doctor_id', type: 'INTEGER', isForeign: true },
        { name: 'appointment_date', type: 'TEXT' },
        { name: 'diagnosis', type: 'TEXT' },
        { name: 'fee', type: 'REAL' },
        { name: 'status', type: 'TEXT' },
      ],
    },
    {
      name: 'billings',
      rowCount: 6,
      description: 'Copays, insurance coverage breakdown, and remittance status.',
      columns: [
        { name: 'bill_id', type: 'INTEGER', isPrimary: true },
        { name: 'appointment_id', type: 'INTEGER', isForeign: true },
        { name: 'total_amount', type: 'REAL' },
        { name: 'insurance_covered', type: 'REAL' },
        { name: 'patient_paid', type: 'REAL' },
        { name: 'payment_status', type: 'TEXT' },
      ],
    },
  ],
};

export const ALL_DATASETS: Record<string, Dataset> = {
  ecommerce: ECOMMERCE_DATASET,
  hr: HR_DATASET,
  sales: SALES_DATASET,
  banking: BANKING_DATASET,
  healthcare: HEALTHCARE_DATASET,
};

export const DATASET_LIST: Dataset[] = [
  ECOMMERCE_DATASET,
  HR_DATASET,
  SALES_DATASET,
  BANKING_DATASET,
  HEALTHCARE_DATASET,
];
