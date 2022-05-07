'use strict';

const Seller = require('../../models/seller');
const SellerLoginSession = require('../../models/sellerLoginSession');
const UserLoginSession = require('../../models/userLoginSession');
const User = require('../../models/user');

exports.getSellerById = (sellerId) => {
  return Seller.findOne({
    _id: sellerId,
  }, {
    fullName: 1,
    email: 1,
  });
};

exports.getSellerLoginSessionByToken = (token) => {
  return SellerLoginSession.findOne({
    token: token,
  }, {
    sellerId: 1,
    token: 1,
  });
};

exports.getUserById = (userId) => {
  return User.findOne({
    _id: userId,
  }, {
    fullName: 1,
    email: 1,
    password: 1,
  });
};

exports.getUserLoginSessionByToken = (token) => {
  return UserLoginSession.findOne({
    token: token,
  }, {
    userId: 1,
    token: 1,
  });
};
