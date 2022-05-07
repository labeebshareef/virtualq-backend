'use strict';

const messageUtil = require('../../../utilities/message');
const responseUtil = require('../../../utilities/response');

const profileService = require('./sellerProfileService');

exports.getSellerProfile = async (req, res, next) => {
  try {
    const sellerId = req.seller._id;

    const profile = await profileService.getSellerById(sellerId);

    responseUtil.successResponse(res, messageUtil.profileFetched, profile);
  } catch (ex) {
    responseUtil.serverErrorResponse(res, ex);
  }
};

exports.updateSellerProfile = async (req, res, next) => {
  try {
    const sellerId = req.seller._id;
    const fullName = req.body.fullName;
    const description = req.body.description;

    const seller = {};
    if (fullName) {
      seller.fullName = fullName;
    }
    if (description) {
      seller.description = description;
    }

    await profileService.updateSellerById(sellerId, seller);

    responseUtil.successResponse(res, messageUtil.profileUpdated, null);
  } catch (ex) {
    responseUtil.serverErrorResponse(res, ex);
  }
};
