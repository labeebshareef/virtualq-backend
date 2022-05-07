'use strict';

const express = require('express');
const http = require('http');

const compression = require('compression');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

require('./models');
const routes = require('./routes');
const loggerUtil = require('./utilities/logger');
const responseUtil = require('./utilities/response');

const app = express();
const server = http.createServer(app);

app.use(express.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit: 1000000,
}));
app.use(express.json({
  limit: '50mb',
}));
app.use(compression());
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(morgan('combined', {
  stream: loggerUtil.stream,
}));
app.use(routes);

app.use((req, res, next) => {
  responseUtil.notFoundErrorResponse(res, req);
});

const port = process.env.PORT || 3000;
server.listen(port, (error) => {
  if (error) {
    loggerUtil.error({
      message: `Server error - ${error.toString()}`,
      level: 'error',
    });
  } else {
    loggerUtil.log({
      message: `Server listening at port ${port}`,
      level: 'info',
    });
  }
});
