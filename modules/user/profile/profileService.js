'use strict';

const User = require('../../../models/user');

exports.getUserById = (userId) => {
  return User.findOne({
    _id: userId,
  }, {
    fullName: 1,
    email: 1,
  });
};

exports.createUser = (user) => {
  return new User(user).save();
};

exports.updateUserById = (userId, user) => {
  return User.updateOne({
    _id: userId,
  }, {
    $set: user,
  });
};
