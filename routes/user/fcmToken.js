'use strict';

const express = require('express');
const router = express.Router();

const validate = require('../../middlewares/field/validator');
const verifyRequest = require('../../middlewares/field/verifyRequest');

const {
  addFCMToken,
} = require('../../modules/user/fcmToken/fcmTokenController');

router.post('/', validate('addFCMToken'), verifyRequest, addFCMToken);

module.exports = router;
