'use strict';

const express = require('express');
const router = express.Router();

const validate = require('../../middlewares/field/validator');
const verifyRequest = require('../../middlewares/field/verifyRequest');
const {
  userTokenCheck,
} = require('../../middlewares/authentication/authCheckController');

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  logout,
  generateOtp,
} = require('../../modules/user/authentication/authenticationController');

router.post('/generateotp', validate('generateotp'),
  verifyRequest, generateOtp);
router.post('/signup', validate('signup'), verifyRequest, signup);
router.post('/login', validate('emailLogin'), verifyRequest, login);
router.post('/forgot', validate('forgotPassword'), verifyRequest,
  forgotPassword);
router.post('/reset', validate('resetPassword'), verifyRequest, resetPassword);
router.use(userTokenCheck);
router.post('/change', validate('changePassword'), verifyRequest,
  changePassword);
router.get('/logout', logout);

module.exports = router;
