const mongoose = require('../config/dbConnection.js');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  tags: {
    type: [String],
  },
  comments: {
    type: [Object],
    default: [],
  },
}, {timestamps: true});

module.exports = mongoose.model('blog', blogSchema);
