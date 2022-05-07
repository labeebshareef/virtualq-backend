'use strict';

const OtpSession = require('../../../models/otpSession');
const UserLoginSession = require('../../../models/userLoginSession');
const User = require('../../../models/user');

exports.getUserByEmail = (email) => {
  return User.findOne({
    email: email,
  }, {
    fullName: 1,
    email: 1,
    password: 1,
  });
};


exports.getUserById = (userId) => {
  console.log('in', userId);
  return User.findOne({
    _id: userId,
  }, {
    fullName: 1,
    email: 1,
    password: 1,
    emailVerified: 1,
  });
};


exports.updateUserByEmail = (email, user) => {
  return User.findOneAndUpdate({
    email: email,
  }, {
    $set: user,
  }, {
    returnNewDocument: true,
  });
};

exports.updateUserById = (userId, user) => {
  console.log(user);
  return User.updateOne({
    _id: userId,
  }, {
    $set: user,
  });
};

exports.getOtpSessionByEmail = (email) => {
  return OtpSession.findOne({
    email: email,
  }, {
    email: 1,
    otp: 1,
  });
};

exports.createOtpSession = (otpSession) => {
  return OtpSession.findOneAndUpdate({
    email: otpSession.email,
  }, {
    $set: otpSession,
  }, {
    upsert: true,
  });
};


exports.deleteOtpSessionById = (otpSessionId) => {
  return OtpSession.deleteOne({
    _id: otpSessionId,
  });
};

exports.createLoginSession = (loginSession) => {
  return new UserLoginSession(loginSession).save();
};

exports.deleteLoginSessionByToken = (token) => {
  return UserLoginSession.deleteOne({
    token: token,
  });
};

exports.deleteUnverifiedUsers = (user) => {
  console.log(user);
  return User.deleteOne({
    _id: user._id,
  });
};
