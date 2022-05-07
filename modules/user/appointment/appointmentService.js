'use strict';

const mongoose = require('mongoose');

const config = require('../../../config');

const Seller = require('../../../models/seller');
const Appointment = require('../../../models/appointments');
const AppointmentRequest = require('../../../models/appointmentRequest');

exports.getTimeSlotDetails = async (sellerId, timeslotId) => {
  const timeSlot = await Seller.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(sellerId),
      },
    }, {
      $project: {
        _id: 0,
        timeSlots: {
          $filter: {
            input: '$timeSlots',
            as: 'slot',
            cond: { $eq: ['$$slot._id', mongoose.Types.ObjectId(timeslotId)] },
          },
        },
      },
    }, { $unwind: '$timeSlots' }]);
  return timeSlot;
};

exports.getAppointment = async (sellerId, date, timeslotId) => {
  return Appointment.findOne({
    sellerId: sellerId,
    date: new Date(date),
    'timeslotObject._id': timeslotId,
  });
};

exports.getAppointmentRequest = async (userId, appointmentId) => {
  return AppointmentRequest.findOne({
    userId: userId,
    appointmentId: appointmentId,
  });
};

exports.addAppointment = (sellerId, date, timeslot) => {
  const appointment = {
    sellerId: sellerId,
    date: new Date(date),
    timeslotObject: timeslot,
    remainingSlotsNumber: timeslot?.numberOfSlots,
  };
  console.log(appointment);
  return new Appointment(appointment).save();
};

exports.addAppointmentRequest = (sellerId, appointmentId, userId, date) => {
  const appointmentRequest = {
    userId: userId,
    sellerId: sellerId,
    appointmentId: appointmentId,
    requestStatus: config.DB_CONSTANTS.APPOINTMENT.STATUS.PENDING,
    date: new Date(date),
  };
  console.log(appointmentRequest);
  return new AppointmentRequest(appointmentRequest).save();
};

exports.getSellersList = () => {
  return Seller.find({
    emailVerified: true,
    timeSlots: { $exists: true, $not: { $size: 0 } },
  });
};

exports.getAppointmentRequestList = (userId) => {
  return AppointmentRequest.find({
    userId: userId,
  }).sort({ date: -1 }).populate('appointmentId sellerId');
};
