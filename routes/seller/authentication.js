'use strict';

const express = require('express');
const router = express.Router();

const validate = require('../../middlewares/field/validator');
const verifyRequest = require('../../middlewares/field/verifyRequest');
const {
  sellerTokenCheck,
} = require('../../middlewares/authentication/authCheckController');

const {
  generateOtp,
  signup,
  login,
  changePassword,
  logout,
} = require('../../modules/seller/authentication/authenticationController');
router.post('/generateotp', validate('generateotp'),
  verifyRequest, generateOtp);
router.post('/signup', validate('signup'), verifyRequest, signup);
router.post('/login', validate('emailLogin'), verifyRequest, login);
router.use(sellerTokenCheck);
router.post('/change', validate('changePassword'), verifyRequest,
  changePassword);
router.get('/logout', logout);

module.exports = router;
