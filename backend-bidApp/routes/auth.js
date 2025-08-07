const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
  try {
    console.log('Register request body:', req.body);
    const user = await User.create(req.body);
    res.status(201).json({
      message: 'User registered successfully',
      user,
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(400).json({
      message: 'Failed to register',
      error: err.message,
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    console.log('Login request body:', req.body);
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json({
      message: 'Logged in successfully',
      user,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      message: 'Failed to login',
      error: err.message,
    });
  }
});

router.get('/me', async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      message: 'User details retrieved',
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({
      message: 'Failed to retrieve user details',
      error: err.message,
    });
  }
});

module.exports = router;