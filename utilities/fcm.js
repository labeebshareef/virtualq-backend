'use strict';

const FCM = require('fcm-node');

const loggerUtil = require('./logger');
const fcmTokenService = require('../modules/user/fcmToken/fcmTokenService');

const fcm = new FCM(process.env.FCM_SERVER_KEY);

exports.sendNotification = async (title, body, data, userId) => {
  try {
    const tokens = await fcmTokenService
      .getFCMTokensByUserId(userId);
    console.log(tokens);
    fcm.send({
      registration_ids: tokens,
      notification: {
        title: title,
        body: body,
      },
      data: data,
    }, function (err) {
      if (err) {
        loggerUtil.error({
          message: err.toString(),
          level: 'error',
        });
      }
    });
  } catch (ex) {
    loggerUtil.error({
      message: ex.toString(),
      level: 'error',
    });
  }
};

exports.sendSilentNotification = async (data, userId) => {
  try {
    const tokens = await fcmTokenService.getFCMTokensByUserId(userId);

    fcm.send({
      registration_ids: tokens,
      data: data,
      content_available: true,
    }, function (err) {
      if (err) {
        loggerUtil.error({
          message: err.toString(),
          level: 'error',
        });
      }
    });
  } catch (ex) {
    loggerUtil.error({
      message: ex.toString(),
      level: 'error',
    });
  }
};
