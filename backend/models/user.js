const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  full_name: { type: String, required: true }, // e.g., "Ramesh Kumar"
  role: { type: String, enum: ['farmer', 'vet', 'admin'], default: 'farmer' },
  phone_number: { type: String, required: true }, // e.g., "+91XXXXXXXX"
  mother_tongue: { type: String, required: true }, // e.g., "Bengali"
  location: {
    state: { type: String, required: true }, // e.g., "Gujarat"
    district: { type: String, required: true }, // e.g., "Junagadh"
    village: { type: String, required: true } // e.g., "Manbazar"
  },
  password: { type: String, required: true }, // Hashed
  email: { type: String, required: true, unique: true } // For login
}, { timestamps: true }); // Auto-add createdAt/updatedAt

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);