'use strict';

const express = require('express');
const router = express.Router();

const {
  sellerTokenCheck,
} = require('../../middlewares/authentication/authCheckController');

const authentication = require('./authentication');
const sellerProfile = require('./sellerProfile');
const timeslot = require('./timeslot');
const appointment = require('./appointment');

router.use('/auth', authentication);
router.use(sellerTokenCheck);
router.use('/sellerProfile', sellerProfile);
router.use('/timeslot', timeslot);
router.use('/appointment', appointment);

module.exports = router;
