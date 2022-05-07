'use strict';

const Seller = require('../../../models/seller');
const mongoose = require('mongoose');

exports.getTimeSlotDetails = (sellerId) => {
  return Seller.findOne({
    _id: sellerId,
  }, {
    _id: 0,
    timeSlots: 1,
  });
};

exports.getTimeslotDatewise = (sellerId, date) => {
  return Seller.aggregate([{ $match: {
    _id: mongoose.Types.ObjectId(sellerId),
    emailVerified: true,
  } }, { $unwind: '$timeSlots' },
  { $sort: { 'timeSlots.startTime': 1 } },
  {
    $lookup: {
      from: 'appointments',
      let: {
        sellerId: '$_id',
        timeslotId: '$timeSlots._id',
      },
      pipeline: [{
        $match: {
          $expr: {
            $eq: ['$$sellerId', '$sellerId'],
            // eslint-disable-next-line no-dupe-keys
            $eq: ['$$timeslotId', '$timeslotObject._id'],
          },
          date: { $eq: new Date(date) },
        },
      }],
      as: 'appointments',
    },
  },
  ]);
};
