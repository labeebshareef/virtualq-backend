'use strict';

const UserLoginSession = require('../../../models/userLoginSession');

exports.addFCMToken = (userId, token, fcmToken) => {
  return UserLoginSession.updateOne({
    userId: userId,
    token: token,
  }, {
    $set: {
      fcmToken: fcmToken,
    },
  });
};

exports.getFCMTokensByUserId = (userId) => {
  return UserLoginSession.distinct('fcmToken', {
    userId: userId,
  });
};
