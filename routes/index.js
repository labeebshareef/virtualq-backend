'use strict';

const express = require('express');
const router = express.Router();

const seller = require('./seller');
const user = require('./user');

router.use('/seller', seller);
router.use('/user', user);

module.exports = router;
