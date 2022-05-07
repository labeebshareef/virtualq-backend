'use strict';

const express = require('express');
const router = express.Router();

const validate = require('../../middlewares/field/validator');
const verifyRequest = require('../../middlewares/field/verifyRequest');

const {
  getProfile,
  updateProfile,
} = require('../../modules/user/profile/profileController');

router.route('/')
  .get(getProfile)
  .put(validate('updateProfile'), verifyRequest, updateProfile);

module.exports = router;
