'use strict';

const messageUtil = require('../../../utilities/message');
const responseUtil = require('../../../utilities/response');

const profileService = require('./profileService');

exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const profile = await profileService.getUserById(userId);

    responseUtil.successResponse(res, messageUtil.profileFetched, profile);
  } catch (ex) {
    responseUtil.serverErrorResponse(res, ex);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const fullName = req.body.fullName;

    const user = {};
    if (fullName) {
      user.fullName = fullName;
    }

    await profileService.updateUserById(userId, user);

    responseUtil.successResponse(res, messageUtil.profileUpdated, null);
  } catch (ex) {
    responseUtil.serverErrorResponse(res, ex);
  }
};
