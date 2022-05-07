'use strict';

const Appointment = require('../../../models/appointments');
const AppointmentRequest = require('../../../models/appointmentRequest');

exports.listUpcomingAppointmentRequests = (sellerId) => {
  return AppointmentRequest.find({
    date: { $gte: new Date().setHours(0, 0, 0, 0) },
    sellerId: sellerId,
  }).populate('userId appointmentId').sort({ date: -1 });
};

exports.listPreviousAppointmentRequests = (sellerId) => {
  return AppointmentRequest.find({
    date: { $lt: new Date().setHours(0, 0, 0, 0) },
    sellerId: sellerId,
  }).populate('userId appointmentId').sort({ date: -1 });
};

exports.getAppointmentRequest = async (appointmentRequestId) => {
  return AppointmentRequest.findOne({
    _id: appointmentRequestId,
  }).populate('appointmentId');
};

exports.updateAppointmentRequestStatus = (appointmentId, status) => {
  return AppointmentRequest.updateOne({
    _id: appointmentId,
  }, {
    $set: {
      requestStatus: status,
    },
  });
};

exports.decreaseRemainingAppointment = (appointmentId) => {
  return Appointment.updateOne(
    { _id: appointmentId },
    { $inc: { remainingSlotsNumber: -1 } });
};

