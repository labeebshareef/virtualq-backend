'use strict';

const messageUtil = require('../../../utilities/message');
const responseUtil = require('../../../utilities/response');

const fcmTokenService = require('./fcmTokenService');

exports.addFCMToken = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const token = req.headers.authorization;
    const fcmToken = req.body.fcmToken;

    await fcmTokenService.addFCMToken(userId, token, fcmToken);

    responseUtil.successResponse(res, messageUtil.fcmTokenAdded, null);
  } catch (ex) {
    responseUtil.serverErrorResponse(res, ex);
  }
};
