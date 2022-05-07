'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
  fullName: String,
  email: {
    type: String,
    unique: true,
  },
  emailVerified: Boolean,
  password: String,
}, {
  timestamps: true,
});

const User = mongoose.model('user', userSchema, 'users');
module.exports = User;
