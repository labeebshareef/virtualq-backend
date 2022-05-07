
'use strict';

const messageUtil = require('../../../utilities/message');
const responseUtil = require('../../../utilities/response');

const timeslotService = require('./timeslotService');

exports.getTimeSlot = async (req, res, next) => {
  try {
    const sellerId = req.body.sellerId;

    const profile = await timeslotService.getTimeSlotDetails(sellerId);

    responseUtil.successResponse(res, messageUtil.profileFetched, profile);
  } catch (ex) {
    responseUtil.serverErrorResponse(res, ex);
  }
};

exports.getTimeslotDatewise = async (req, res, next) => {
  try {
    const sellerId = req.body.sellerId;
    const date = req.body.date;

    const profile = await timeslotService.getTimeslotDatewise(sellerId, date);

    responseUtil.successResponse(res, messageUtil.profileFetched, profile);
  } catch (ex) {
    responseUtil.serverErrorResponse(res, ex);
  }
};
