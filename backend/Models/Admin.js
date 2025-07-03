const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, required: true, unique: true },
  password: String,
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema); 
