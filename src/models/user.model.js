const mongoose = require('../config/dbConnection.js');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user',
  },
  token: {
    type: String,
    default: null,
  },
  deleteAt: {
    type: Date,
    default: null,
  },
}, {timestamps: true});

module.exports = mongoose.model('user', userSchema);
