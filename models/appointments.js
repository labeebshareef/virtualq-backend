'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  sellerId: {
    type: mongoose.Types.ObjectId,
    ref: 'seller',
  },
  date: Date,
  timeslotObject: {
    _id: mongoose.Types.ObjectId,
    startTime: Date,
    endTime: Date,
    numberOfSlots: Number,
  },
  remainingSlotsNumber: Number,
}, {
  timestamps: true,
});

const Appointment = mongoose
  .model('appointment', appointmentSchema, 'appointments');
module.exports = Appointment;
