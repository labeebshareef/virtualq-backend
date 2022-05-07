
'use strict';

const messageUtil = require('../../../utilities/message');
const responseUtil = require('../../../utilities/response');

const appointmentService = require('./appointmentService');

exports.requestAppointment = async (req, res, next) => {
  try {
    console.log(1);
    const userId = req.user._id;
    const sellerId = req.body.sellerId;
    const date = req.body.date;
    const timeslotId = req.body.timeslotId;

    const timeslot = await appointmentService
      .getTimeSlotDetails(sellerId, timeslotId);
    console.log(timeslot);
    if (!timeslot.length) {
      console.error(messageUtil.timeslotNotFound);
      return responseUtil
        .badRequestErrorResponse(res,
          messageUtil.timeslotNotFound);
    }

    let appointment = await appointmentService
      .getAppointment(sellerId, date, timeslotId);
    if (appointment) {
      const appointmentRequestExist = await appointmentService
        .getAppointmentRequest(userId, appointment._id);
      if (appointmentRequestExist) {
        console.error(messageUtil.appointmentRequestExist);
        return responseUtil
          .badRequestErrorResponse(res,
            messageUtil.appointmentRequestExist);
      }
    }

    if (!appointment) {
      appointment = await appointmentService
        .addAppointment(sellerId, date, timeslot[0]?.timeSlots);
    }
    if (appointment?.remainingSlotsNumber <= 0) {
      console.error(messageUtil.noRemainingAppointments);
      return responseUtil
        .badRequestErrorResponse(res,
          messageUtil.noRemainingAppointments);
    }
    const appointmentRequest = await appointmentService
      .addAppointmentRequest(sellerId, appointment._id,
        userId, date);
    responseUtil.successResponse(res, messageUtil.appointmentRequestSent,
      appointmentRequest);
  } catch (ex) {
    console.error(ex);
    responseUtil.serverErrorResponse(res, ex);
  }
};

exports.getSellers = async (req, res, next) => {
  try {
    const sellers = await appointmentService
      .getSellersList();
    responseUtil.successResponse(res, messageUtil.sellerFetched,
      sellers);
  } catch (ex) {
    responseUtil.serverErrorResponse(res, ex);
  }
};

exports.getAppointmentsRequests = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const sellers = await appointmentService
      .getAppointmentRequestList(userId);
    responseUtil.successResponse(res, messageUtil.appointmentRequestFetched,
      sellers);
  } catch (ex) {
    responseUtil.serverErrorResponse(res, ex);
  }
};
