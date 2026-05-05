const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

// ─────────────────────────────────────────────
// SIGNUP — POST /api/auth/signup
// ─────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate inputs
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    // Role comes from request body — defaults to 'user' if not provided
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'user'      // If no role sent, default to 'user'
    });

    await newUser.save();

    res.status(201).json({
      message: '✅ User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role      // Show role in response
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────────
// LOGIN — POST /api/auth/login
// ─────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: '❌ Invalid password' });
    }

    // Generate JWT token
    // IMPORTANT — role is included inside the token!
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role       // Role stored in token
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: '✅ Login successful',
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────────
// PUBLIC ROUTE — GET /api/auth/public
// Anyone can access this — no token needed
// ─────────────────────────────────────────────
router.get('/public', (req, res) => {
  res.json({ message: '🌍 This is a public route — anyone can access this!' });
});

// ─────────────────────────────────────────────
// USER ROUTE — GET /api/auth/profile
// Only logged in users can access — needs token
// ─────────────────────────────────────────────
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -__v');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: '✅ Profile fetched successfully',
      user: user
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────────
// ADMIN ROUTE — GET /api/auth/admin
// Only ADMIN role can access this
// verifyToken runs first, then verifyAdmin
// ─────────────────────────────────────────────
router.get('/admin', verifyToken, verifyAdmin, async (req, res) => {
  try {
    // Get ALL users from database — admin only feature!
    const users = await User.find().select('-password -__v');

    res.json({
      message: '👑 Welcome Admin! Here are all the users:',
      count: users.length,
      users: users
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────────
// ADMIN ONLY — DELETE /api/auth/admin/user/:id
// Only admin can delete a user
// ─────────────────────────────────────────────
router.delete('/admin/user/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: '✅ User deleted successfully by admin',
      deletedUser: {
        id: deletedUser._id,
        name: deletedUser.name,
        email: deletedUser.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;