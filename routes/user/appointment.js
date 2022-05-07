'use strict';

const express = require('express');
const router = express.Router();

const {
  requestAppointment,
  getSellers,
  getAppointmentsRequests,
} = require('../../modules/user/appointment/appointmentController');

router.post('/requestAppointment', requestAppointment);
router.get('/getSellers', getSellers);
router.get('/getAppointmentsRequests', getAppointmentsRequests);

module.exports = router;
