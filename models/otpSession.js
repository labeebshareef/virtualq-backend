'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const otpSessionSchema = new Schema({
  email: String,
  otp: String,
}, {
  timestamps: true,
});

const OtpSession = mongoose
  .model('otpSession', otpSessionSchema, 'otpSessions');
module.exports = OtpSession;
