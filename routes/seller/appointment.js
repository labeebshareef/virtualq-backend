'use strict';

const express = require('express');
const router = express.Router();

const {
  listUpcomingAppointmentRequests,
  manageAppointmentRequest,
  listPreviousAppointmentRequests,
} = require('../../modules/seller/appointment/appointmentController');

router.get('/upcomingAppointmentRequests', listUpcomingAppointmentRequests);
router.get('/listPreviousAppointmentRequests', listPreviousAppointmentRequests);
router.post('/manageAppointmentRequest', manageAppointmentRequest);


module.exports = router;
