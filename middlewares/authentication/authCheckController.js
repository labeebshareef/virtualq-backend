'use strict';

const jwt = require('jsonwebtoken');

const config = require('../../config');
const messageUtil = require('../../utilities/message');
const responseUtil = require('../../utilities/response');

const authCheckService = require('./authCheckService');

exports.sellerTokenCheck = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return responseUtil.authorizationErrorResponse(res,
        messageUtil.authorizationRequired);
    }

    const sellerLoginSession = await authCheckService
      .getSellerLoginSessionByToken(token);
    if (!sellerLoginSession) {
      return responseUtil.authorizationErrorResponse(res,
        messageUtil.tokenExpired);
    }

    const sellerSession = jwt.verify(token, config.JWT.SECRET_KEY);
    if (!sellerSession) {
      return responseUtil.authorizationErrorResponse(res,
        messageUtil.tokenExpired);
    }

    const seller = await authCheckService
      .getSellerById(sellerLoginSession.sellerId);
    req.seller = seller;
    next();
  } catch (ex) {
    responseUtil.serverErrorResponse(res, ex);
  }
};

exports.userTokenCheck = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return responseUtil.authorizationErrorResponse(res,
        messageUtil.authorizationRequired);
    }

    const userLoginSession = await authCheckService
      .getUserLoginSessionByToken(token);
    if (!userLoginSession) {
      return responseUtil.authorizationErrorResponse(res,
        messageUtil.tokenExpired);
    }

    const userSession = jwt.verify(token, config.JWT.SECRET_KEY);
    if (!userSession) {
      return responseUtil.authorizationErrorResponse(res,
        messageUtil.tokenExpired);
    }

    const user = await authCheckService.getUserById(userLoginSession.userId);

    req.user = user;
    next();
  } catch (ex) {
    responseUtil.serverErrorResponse(res, ex);
  }
};
