'use strict';

const { check } = require('express-validator');

module.exports = (method) => {
  switch (method) {
    case 'signup': {
      return [
        check('fullName').trim().not().isEmpty().withMessage(
          'Full Name cannot be left blank',
        ),
        check('password').trim().not().isEmpty().withMessage(
          'Password cannot be left blank',
        ).bail().isLength({
          min: 6,
        }).withMessage(
          'Password must be at least 6 characters',
        ),
        check('emailOtp').trim().not().isEmpty().withMessage(
          'OTP cannot be left blank',
        ).bail().isLength({
          min: 6,
          max: 6,
        }).withMessage(
          'OTP must be 6 character long',
        ),
      ];
    }
    case 'emailLogin': {
      return [
        check('email').trim().not().isEmpty().withMessage(
          'Email cannot be left blank',
        ).bail().isEmail().withMessage(
          'Email is not valid',
        ),
        check('password').trim().not().isEmpty().withMessage(
          'Password cannot be left blank',
        ).bail().isLength({
          min: 6,
        }).withMessage(
          'Password must be at least 6 characters',
        ),
      ];
    }
    case 'forgotPassword': {
      return [
        check('email').trim().not().isEmpty().withMessage(
          'Email cannot be left blank',
        ).bail().isEmail().withMessage(
          'Email is not valid',
        ),
      ];
    }
    case 'generateotp': {
      return [
        check('email').trim().not().isEmpty().withMessage(
          'Email cannot be left blank',
        ).bail().isEmail().withMessage(
          'Email is not valid',
        ),
      ];
    }
    case 'resetPassword': {
      return [
        check('email').trim().not().isEmpty().withMessage(
          'Email cannot be left blank',
        ).bail().isEmail().withMessage(
          'Email is not valid',
        ),
        check('password').trim().not().isEmpty().withMessage(
          'Password cannot be left blank',
        ).bail().isLength({
          min: 6,
        }).withMessage(
          'Password must be at least 6 characters',
        ),
        check('otp').trim().not().isEmpty().withMessage(
          'OTP cannot be left blank',
        ).bail().isLength({
          min: 4,
          max: 4,
        }).withMessage(
          'OTP must be 4 character long',
        ),
      ];
    }
    case 'changePassword': {
      return [
        check('oldPassword').trim().not().isEmpty().withMessage(
          'Old Password cannot be left blank',
        ).bail().isLength({
          min: 6,
        }).withMessage(
          'Old Password must be at least 6 characters',
        ),
        check('newPassword').trim().not().isEmpty().withMessage(
          'New Password cannot be left blank',
        ).bail().isLength({
          min: 6,
        }).withMessage(
          'New Password must be at least 6 characters',
        ),
      ];
    }
    case 'addFCMToken': {
      return [
        check('fcmToken').trim().not().isEmpty().withMessage(
          'FCM Token cannot be left blank',
        ),
      ];
    }
    case 'updateProfile': {
      return [
        check('fullName').optional().trim().not().isEmpty().withMessage(
          'Full Name cannot be left blank',
        ),
        check('location').optional().trim().not().isEmpty().withMessage(
          'Location cannot be left blank',
        ),
        check('unitRate').optional().not().isEmpty().withMessage(
          'Unit Rate cannot be left blank',
        ).bail().isFloat().withMessage(
          'Unit Rate is not valid',
        ),
      ];
    }
  };
};
