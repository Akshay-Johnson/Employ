const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const employeesRouter = require('./routes/employees');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/employees', employeesRouter);

// Basic health route
app.get('/', (req, res) => {
  res.send('Employee Management API is running');
});

// Database connection
// Use 127.0.0.1 by default to avoid IPv6 (::1) issues on some Windows setups.
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/employee_management';
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI, { autoIndex: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

