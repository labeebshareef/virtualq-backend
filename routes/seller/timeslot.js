'use strict';

const express = require('express');
const router = express.Router();

const {
  addTimeSlot,
  deleteTimeSlot,
} = require('../../modules/seller/timeslot/timeslotController');

router.route('/')
//   .get(addTimeSlot)
  .post(addTimeSlot);
//   .put(updateSellerProfile);
router.route('/deleteTimeSlot')
  .post(deleteTimeSlot);
module.exports = router;
