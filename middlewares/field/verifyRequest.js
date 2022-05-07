'use strict';

const { validationResult } = require('express-validator');

const responseUtil = require('../../utilities/response');

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return responseUtil.validationErrorResponse(res, errors.array());
  }
  next();
};
