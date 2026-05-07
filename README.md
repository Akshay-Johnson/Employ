## Employee Management System (MERN)

This project implements the Full Stack Intern assessment using:

- **Backend**: Node.js + Express + MongoDB (Mongoose)
- **Frontend**: React (Vite) + Tailwind CSS

Each employee record includes:

- `id` (Mongo `_id`)
- `name`
- `email` (unique)
- `department`
- `salary`
- `status` (`ACTIVE` / `INACTIVE`)

---

## Requirement Mapping (Assessment Checklist)

### 1) Add Employee

- **Endpoint**: `POST /api/employees`
- **Purpose**: create a new employee record.
- **Validation**:
  - required: `name`, `email`, `department`, `salary`
  - `salary` must be non-negative
  - `email` must be unique

### 2) Fetch Employee by ID

- **Endpoint**: `GET /api/employees/:id`
- **Purpose**: return a specific employee using Mongo `_id`.
- Returns `404` if not found and `400` for invalid id format.

### 3) Fetch All Active Employees

- **Endpoint**: `GET /api/employees`
- **Default behavior**: returns only employees with `status: "ACTIVE"`.
- This satisfies: “Deleted (INACTIVE) employees should not appear in Fetch All Active Employees”.

### 4) Update Employee

- **Endpoint**: `PUT /api/employees/:id`
- **Purpose**: update existing fields (`name`, `email`, `department`, `salary`, `status`).
- Unique email validation is enforced here as well.

### 5) Delete Employee (Soft Delete)

- **Endpoint**: `DELETE /api/employees/:id`
- **Behavior**: record is not removed; status is updated to `INACTIVE`.

### Notes / Extra

- Employee listing API also supports `GET /api/employees?status=ACTIVE|INACTIVE|ALL` for frontend filtering.
- Default remains `ACTIVE`, so assignment requirement is preserved.

---

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

(`.env.example` and `.env` are included.)

3. Start backend:

```bash
npm run dev
```

Backend runs at `http://localhost:5000`.

---

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

Vite runs on an available port (for example `http://localhost:5173`).

The frontend calls `/api/*`, and Vite proxies those requests to backend (`127.0.0.1:5000`).

---

## Project Structure

- `backend/src/models/Employee.js` - employee schema and constraints
- `backend/src/routes/employees.js` - CRUD + soft delete API routes
- `backend/src/index.js` - app bootstrap, middleware, DB connection
- `frontend/src/App.jsx` - main UI (form, table, filters, actions)
- `frontend/vite.config.mts` - Vite config and API proxy

---

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

