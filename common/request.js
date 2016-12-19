'use strict';

const request = require('co-request');

const logger = require('./logger');

module.exports = function *(options) {
  try {
    return yield request(options);
  } catch (err) {
    logger.warn(`get info failed with: ${err}`);

    if (err.code === 'ETIMEDOUT') {
      return null;
    }
  }
};
