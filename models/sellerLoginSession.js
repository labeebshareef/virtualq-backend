'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sellerLoginSessionSchema = new Schema({
  sellerId: {
    type: mongoose.Types.ObjectId,
    ref: 'seller',
  },
  token: String,
}, {
  timestamps: true,
});

const SellerLoginSession = mongoose
  .model('sellerLoginSession', sellerLoginSessionSchema, 'sellerLoginSessions');
module.exports = SellerLoginSession;
