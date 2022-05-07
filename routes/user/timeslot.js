'use strict';

const express = require('express');
const router = express.Router();

const {
  getTimeSlot,
  getTimeslotDatewise,
} = require('../../modules/user/timeslot/timeslotController');

router.post('/getTimeSlot', getTimeSlot);
router.post('/getTimeslotDatewise', getTimeslotDatewise);


module.exports = router;
