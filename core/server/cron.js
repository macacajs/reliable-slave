'use strict';

const fs = require('fs');
const path = require('path');

const _ = require('../../common/helper');
const logger = require('../../common/logger');

const oneDay = 3600 * 1000 * 24;
const tempDir = path.join(__dirname, '..', '..', '.temp');

function cleanTempDir() {

  fs.stat(tempDir, function(err, stats) {

    if (err) {
      logger.info('Temp directory not existed, check after one day.');
      setTimeout(cleanTempDir, oneDay + 3600 * 1000);
      return;
    }

    if (Date.now() - stats.atime.getTime() > oneDay) {
      try {
        _.rimraf(tempDir);
        setTimeout(cleanTempDir, oneDay + 3600 * 1000);
        logger.info('Remove temp done, check after one day.');
      } catch (err) {
        console.log(err);
        setTimeout(cleanTempDir, oneDay / 4);
        logger.info('Remove temp directory error, try again after 6 hours.');
      }
    } else {
      logger.info('Temp directory less one day, check after 6 hours.');
      setTimeout(cleanTempDir, oneDay / 4);
    }
  });
}

module.exports = cleanTempDir;
