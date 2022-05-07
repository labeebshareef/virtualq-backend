
'use strict';

const messageUtil = require('../../../utilities/message');
const responseUtil = require('../../../utilities/response');

const appointmentService = require('./appointmentService');
const config = require('../../../config');
const fcmUtil = require('../../../utilities/fcm');


exports.listUpcomingAppointmentRequests = async (req, res, next) => {
  try {
    const sellerId = req.seller._id;
    const upcomingAppointmentRequests = await appointmentService
      .listUpcomingAppointmentRequests(sellerId);
    responseUtil.successResponse(res, messageUtil.appointmentsFetched,
      upcomingAppointmentRequests);
  } catch (ex) {
    responseUtil.serverErrorResponse(res, ex);
  }
};

exports.listPreviousAppointmentRequests = async (req, res, next) => {
  try {
    const sellerId = req.seller._id;
    const upcomingAppointmentRequests = await appointmentService
      .listPreviousAppointmentRequests(sellerId);
    responseUtil.successResponse(res, messageUtil.appointmentsFetched,
      upcomingAppointmentRequests);
  } catch (ex) {
    responseUtil.serverErrorResponse(res, ex);
  }
};

exports.manageAppointmentRequest = async (req, res, next) => {
  try {
    const appointmentRequestId = req.body.appointmentRequestId;
    const accept = req.body.accept;


    const appointmentRequest = await appointmentService
      .getAppointmentRequest(appointmentRequestId);
    if (!appointmentRequest) {
      console.error(messageUtil.appointmentRequestNotFound);
      return responseUtil
        .badRequestErrorResponse(res,
          messageUtil.appointmentRequestNotFound);
    }

    if (appointmentRequest.requestStatus !==
         config.DB_CONSTANTS.APPOINTMENT.STATUS.PENDING) {
      console.error(messageUtil.notPendingStatus);
      return responseUtil
        .badRequestErrorResponse(res,
          messageUtil.notPendingStatus);
    }

    if (appointmentRequest.appointmentId?.remainingSlotsNumber <= 0) {
      console.error(messageUtil.noRemainingAppointments);
      return responseUtil
        .badRequestErrorResponse(res,
          messageUtil.noRemainingAppointments);
    }

    const status = accept ? config.DB_CONSTANTS.APPOINTMENT.STATUS.ACCEPTED :
      config.DB_CONSTANTS.APPOINTMENT.STATUS.REJECTED;
    await appointmentService
      .updateAppointmentRequestStatus(appointmentRequestId, status);

    const title = 'Appointment request update';
    const body = status ? 'Accepted' : 'Rejected';
    fcmUtil.sendNotification(title, body, {}, appointmentRequest.userId);

    if (status) {
      await appointmentService
        .decreaseRemainingAppointment(appointmentRequest.appointmentId);
    }
    responseUtil.successResponse(res, messageUtil.appointmentStatusChanged,
      null);
  } catch (ex) {
    responseUtil.serverErrorResponse(res, ex);
  }
};
