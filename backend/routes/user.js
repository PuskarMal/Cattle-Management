const express = require('express');
const router = express.Router();
const User = require("../models/user"); // Mongoose model (not array!)
const jwt = require("jsonwebtoken");
const { updateMany } = require('../models/cattle');

// POST /api/users/register
router.post('/register', async (req, res) => {
  try {
    const { full_name, email, password, phone_number, role, mother_tongue, location } = req.body;

    if (!full_name || !email || !password || !phone_number || !mother_tongue || !location?.state || !location?.district || !location?.village) {
      return res.status(400).json({ error: 'All fields required (full_name, email, password, phone, mother_tongue, location)' });
    }

    // 1️⃣ Check if user exists (model findOne, like biometric)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // 2️⃣ Create new user (model auto-hashes password)
    const newUser = new User({ 
      full_name,  // Replaces username
      email, 
      password,  // Hashed via pre-save hook
      phone_number,
      role: role || 'farmer',
      mother_tongue,
      user_id,
      location  // Nested: { state, district, village }
    });

    // 3️⃣ Save to DB (like newCattle.save())
    await newUser.save();

    // 4️⃣ Success response (include new fields)
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,  // Mongo _id instead of Date.now()
        full_name: newUser.full_name,
        email: newUser.email,
        phone_number: newUser.phone_number,
        role: newUser.role,
        mother_tongue: newUser.mother_tongue,
        location: newUser.location,
        user_id: newUser.user_id
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/users/login (updated response to include new fields)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // 1️⃣ Find user in DB
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {  // Model method for hashed compare
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 2️⃣ Success response (include new fields)
    const authClaims = [
      { id: user.user_id },
      { role: user.role },
    ];
    console.log("Auth Claims:", authClaims);

    const token = jwt.sign({ authClaims }, process.env.JWT_SECRET || "lms123", {
      expiresIn: "2d",
    });
    

    return res.status(200).json({
      id: user.user_id,
      role: user.role,
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/users/profile/:id (updated response to include new fields)
router.get('/profile/:id', async (req, res) => {
  try {
    

    // 1️⃣ Find in DB
    const user = await User.findOne({user_id: req.params.id});  // Exclude password
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 2️⃣ Response (include new fields)
    res.json({
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role,
        mother_tongue: user.mother_tongue,
        location: user.location,
        owned_cattle: user.owned_cattle,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});
router.get('/profile/me', async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -__v -createdAt -updatedAt');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role,
        mother_tongue: user.mother_tongue,
        location: user.location,
        owned_cattle: user.owned_cattle || []
      }
    });
  } catch (err) {
    console.error('Self-profile error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
// GET /api/users/profile/:id   ← kept your original (public or for admin use)
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -__v');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role,
        mother_tongue: user.mother_tongue,
        location: user.location,
        owned_cattle: user.owned_cattle || []
      }
    });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
});

// GET /api/users/profile/me   ← NEW protected route for logged-in user
router.get('/profile/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -__v -createdAt -updatedAt');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role,
        mother_tongue: user.mother_tongue,
        location: user.location,
        owned_cattle: user.owned_cattle || []
      }
    });
  } catch (err) {
    console.error('Self-profile error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
