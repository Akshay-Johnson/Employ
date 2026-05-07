const express = require('express');
const Employee = require('../models/Employee');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, department, salary, status } = req.body;

    if (!name || !email || !department || salary === undefined) {
      return res.status(400).json({ message: 'name, email, department, and salary are required' });
    }

    const employee = await Employee.create({
      name,
      email,
      department,
      salary,
      status: status || 'ACTIVE',
    });

    res.status(201).json(employee);
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(400).json({ message: 'Email must be unique' });
    }
    res.status(500).json({ message: 'Failed to create employee', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    res.status(400).json({ message: 'Invalid employee ID', error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const status = (req.query.status || 'ACTIVE').toUpperCase();
    const filter = {};

    if (status !== 'ALL') {
      if (!['ACTIVE', 'INACTIVE'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status. Use ACTIVE, INACTIVE, or ALL' });
      }
      filter.status = status;
    }

    const employees = await Employee.find(filter).sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch employees', error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, email, department, salary, status } = req.body;

    const update = {};
    if (name !== undefined) update.name = name;
    if (email !== undefined) update.email = email;
    if (department !== undefined) update.department = department;
    if (salary !== undefined) update.salary = salary;
    if (status !== undefined) update.status = status;

    const employee = await Employee.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(400).json({ message: 'Email must be unique' });
    }
    res.status(400).json({ message: 'Failed to update employee', error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { status: 'INACTIVE' },
      { new: true }
    );
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee marked as INACTIVE', employee });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete employee', error: err.message });
  }
});

module.exports = router;

