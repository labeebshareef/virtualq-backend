'use strict';

const mongoose = require('mongoose');
const loggerUtil = require('../utilities/logger');
console.log(process.env.DB_URI);
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (err) => loggerUtil.error({
  message: `MongoDB connection error - ${err.toString()}`,
  level: 'error',
}));
db.once('open', () => loggerUtil.log({
  message: 'MongoDB connected',
  level: 'info',
}));
mongoose.set('debug', true);
