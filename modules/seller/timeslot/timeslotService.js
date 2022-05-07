'use strict';

const Seller = require('../../../models/seller');


exports.addTimeSlot = (sellerId, startTime, endTime, noOfSlots) => {
  return Seller.updateOne({
    _id: sellerId,
  }, {
    $push: {
      timeSlots: {
        startTime: startTime,
        endTime: endTime,
        numberOfSlots: noOfSlots,
      },
    },
  });
};

exports.checkTimeSlotOverlap = (sellerId, startDate, endDate) => {
  return Seller.aggregate([
    { $match: {
      _id: sellerId,
    } },
    { $project: {
      timeSlot: {
        $filter: {
          input: '$timeSlots',
          as: 'slot',
          cond: {
            $and: [
              {
                $lt: ['$$slot.startTime', new Date(endDate)],
              },

              {
                $gt: ['$$slot.endTime', new Date(startDate)] },
            ],
          },
        },
      },
    },
    }]);
};

exports.deleteTImeSlot = (sellerId, timeslotId) => {
  return Seller.updateOne({
    _id: sellerId,
  }, {
    $pull: {
      timeSlots: { _id: timeslotId },
    } });
};
