'use strict';

const express = require('express');
const router = express.Router();

const {
  getSellerProfile,
  updateSellerProfile,
} = require('../../modules/seller/sellerProfile/sellerProfileController');

router.route('/')
  .get(getSellerProfile)
  .put(updateSellerProfile);

module.exports = router;
