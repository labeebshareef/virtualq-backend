'use strict';

const SellerLoginSession = require('../../../models/sellerLoginSession');
const OtpSession = require('../../../models/otpSession');
const Seller = require('../../../models/seller');
const mongoose = require('mongoose');

exports.getSellerByEmail = (email) => {
  return Seller.findOne({
    email: email,
  }, {
    fullName: 1,
    email: 1,
    password: 1,
    emailVerified: 1,
  });
};

exports.updateSellerByEmail = (email, seller) => {
  return Seller.findOneAndUpdate({
    email: email,
  }, {
    $set: seller,
  }, {
    returnNewDocument: true,
  });
};

exports.getSellerById = (sellerId) => {
  console.log(sellerId);
  return Seller.findOne({
    _id: mongoose.Types.ObjectId(sellerId),
  }, {
    fullName: 1,
    email: 1,
    password: 1,
    emailVerified: 1,
  });
};

exports.updateSellerById = (sellerId, seller) => {
  return Seller.updateOne({
    _id: sellerId,
  }, {
    $set: seller,
  });
};

exports.getOtpSessionByEmail = (email) => {
  return OtpSession.findOne({
    email: email,
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
  return new SellerLoginSession(loginSession).save();
};

exports.deleteLoginSessionByToken = (token) => {
  return SellerLoginSession.deleteOne({
    token: token,
  });
};

exports.deleteUnverifiedSellers = (seller) => {
  console.log(seller);
  return Seller.deleteOne({
    _id: seller._id,
  });
};
