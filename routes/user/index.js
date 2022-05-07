'use strict';

const express = require('express');
const router = express.Router();

const {
  userTokenCheck,
} = require('../../middlewares/authentication/authCheckController');

const authentication = require('./authentication');
// const fcmToken = require('./fcmToken');
const profile = require('./profile');
const appointment = require('./appointment');
const fcmToken = require('./fcmToken');
const timeslot = require('./timeslot');

router.use('/auth', authentication);
router.use(userTokenCheck);
// router.use('/fcmToken', fcmToken);
router.use('/profile', profile);
router.use('/appointment', appointment);
router.use('/fcmToken', fcmToken);
router.use('/timeslot', timeslot);

module.exports = router;
