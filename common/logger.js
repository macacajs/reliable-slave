'use strict';

const path = require('path');
const logger = require('reliable-logger');

const options = {
  logFileDir: path.join(__dirname, '..', 'logs')
};

module.exports = logger.Logger(options);
module.exports.middleware = logger.middleware(options);
