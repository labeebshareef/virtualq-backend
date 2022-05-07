'use strict';

const messageUtil = require('../../../utilities/message');
const responseUtil = require('../../../utilities/response');

const timeslotService = require('./timeslotService');
const sellerProfileService = require('../sellerProfile/sellerProfileService');

exports.addTimeSlot = async (req, res, next) => {
  try {
    const sellerId = req.seller._id;
    const startTime = req.body.startTime;
    const endTime = req.body.endTime;
    const noOfSlots = req.body.noOfSlots;
    const timeSlot = await timeslotService
      .checkTimeSlotOverlap(sellerId, startTime, endTime);
    console.log(timeSlot);
    if (timeSlot[0].timeSlot.length) {
      return responseUtil
        .badRequestErrorResponseWithData(res,
          messageUtil.timeSlotOverlap, timeSlot);
    }

    await timeslotService.addTimeSlot(sellerId, startTime, endTime, noOfSlots);

    const profile = await sellerProfileService.getSellerById(sellerId);
    responseUtil.successResponse(res, messageUtil.timeSlotAdded, profile);
  } catch (ex) {
    responseUtil.serverErrorResponse(res, ex);
  }
};

exports.deleteTimeSlot = async (req, res, next) => {
  try {
    const sellerId = req.seller._id;
    const timeslotId = req.body.timeslotId;

    await timeslotService.deleteTImeSlot(sellerId, timeslotId);

    const profile = await sellerProfileService.getSellerById(sellerId);
    responseUtil.successResponse(res, messageUtil.timeSlotDeleted, profile);
  } catch (ex) {
    responseUtil.serverErrorResponse(res, ex);
  }
};
