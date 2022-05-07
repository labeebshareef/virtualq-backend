'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentRequestSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
  },
  sellerId: {
    type: mongoose.Types.ObjectId,
    ref: 'seller',
  },
  appointmentId: {
    type: mongoose.Types.ObjectId,
    ref: 'appointment',
  },
  date: Date,
  requestStatus: Number,
}, {
  timestamps: true,
});

const AppointmentRequest = mongoose
  .model('appointmentRequest', appointmentRequestSchema, 'appointmentRequest');
module.exports = AppointmentRequest;
