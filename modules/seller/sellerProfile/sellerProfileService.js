'use strict';

const Seller = require('../../../models/seller');

exports.getSellerById = (sellerId) => {
  return Seller.findOne({
    _id: sellerId,
  }, {
    fullName: 1,
    email: 1,
    timeSlots: 1,
  });
};

exports.createSeller = (seller) => {
  return new Seller(seller).save();
};

exports.updateSellerById = (sellerId, seller) => {
  return Seller.updateOne({
    _id: sellerId,
  }, {
    $set: seller,
  });
};

