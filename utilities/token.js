'use strict';

const jwt = require('jsonwebtoken');

const config = require('../config');
const loggerUtil = require('./logger');

exports.generate = async (data) => {
  try {
    return jwt.sign(data, config.JWT.SECRET_KEY);
  } catch (ex) {
    loggerUtil.error({
      message: ex.toString(),
      level: 'error',
    });
    return false;
  }
};
