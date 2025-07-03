const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, required: true, unique: true },
  password: String,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 
