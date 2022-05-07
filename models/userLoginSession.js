'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userLoginSessionSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
  },
  token: String,
  fcmToken: String,
}, {
  timestamps: true,
});

const UserLoginSession = mongoose
  .model('userLoginSession', userLoginSessionSchema, 'userLoginSessions');
module.exports = UserLoginSession;
