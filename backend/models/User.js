// User model – represents students and employers
// TODO: Define full schema once database is configured
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // Role: 'student' | 'employer' | 'admin'
    role: { type: String, enum: ['student', 'employer', 'admin'], default: 'student' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
