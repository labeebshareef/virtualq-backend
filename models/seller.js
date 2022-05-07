'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const sellerSchema = new Schema({
  fullName: String,
  description: String,
  emailVerified: Boolean,
  timeSlots: [{
    startTime: Date,
    endTime: Date,
    numberOfSlots: Number,
  }],
  email: {
    type: String,
    unique: true,
  },
  password: String,
}, {
  timestamps: true,
});

const Seller = mongoose.model('seller', sellerSchema, 'sellers');
module.exports = Seller;
