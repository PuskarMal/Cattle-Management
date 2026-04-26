const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cattle = require('./cattle');

const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  full_name: { type: String, required: true }, // e.g., "Ramesh Kumar"
  role: { type: String, enum: ['user', 'vet', 'admin'], default: 'user' },
  phone_number: { type: String, required: true }, // e.g., "+91XXXXXXXX"
  mother_tongue: { type: String }, // e.g., "Bengali"
  location: {
    state: { type: String, required: true }, // e.g., "Gujarat"
    district: { type: String, required: true }, // e.g., "Junagadh"
    village: { type: String } // e.g., "Manbazar"
  },
  cattle: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "cattle_masters"
  }],
  password: { type: String, required: true }, // Hashed
  email: { type: String, required: true, unique: true }, // For login
  vaccination_events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "vaccinations"
  }]
}, { timestamps: true }); // Auto-add createdAt/updatedAt

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});


// Method to compare passwords
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('users', userSchema);