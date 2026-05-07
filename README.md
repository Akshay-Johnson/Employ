## Employee Management System (MERN)

This project implements the Full Stack Intern assessment using:

- **Backend**: Node.js + Express + MongoDB (Mongoose)
- **Frontend**: React (Vite) + Tailwind CSS


## Requirement Mapping (Assessment Checklist)

### 1) Add Employee
### 2) Fetch Employee by ID
### 3) Fetch All Active Employees
### 4) Update Employee
### 5) Delete Employee (Soft Delete)

## Backend Setup

Location: `backend/`

1. Install dependencies:

```bash
cd backend
npm install
```

2. Configure environment:

```env
MONGO_URI=mongodb://127.0.0.1:27017/employee_management
PORT=5000
```
3. Start backend:

```bash
npm run dev
```

## Frontend Setup

Location: `frontend/`

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Start frontend:

```bash
npm run dev
```


## 1-Minute Interview Explanation

"I built a MERN Employee Management System with React + Vite on the frontend and Express + MongoDB on the backend.  
The employee model has name, unique email, department, salary, and status fields with status as `ACTIVE` or `INACTIVE`.

For CRUD:
- `POST /api/employees` adds a record with validations.
- `GET /api/employees/:id` fetches one employee by id.
- `PUT /api/employees/:id` updates any editable field.
- `DELETE /api/employees/:id` is a soft delete that sets status to `INACTIVE`.

To satisfy the requirement that deleted employees are hidden, the default list endpoint `GET /api/employees` returns only `ACTIVE` employees.  
I also added optional status filtering (`ACTIVE`, `INACTIVE`, `ALL`) in the UI for easier verification, but default behavior stays `ACTIVE` for compliance.

For validation, I used Mongoose schema rules plus duplicate-email error handling to enforce unique email."

