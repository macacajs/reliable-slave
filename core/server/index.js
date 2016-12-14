'use strict';

const co = require('co');
const os = require('os');
const koa = require('koa');
const EOL = require('os').EOL;
const detect = require('detect-port');

const cron = require('./cron');
const router = require('./router');
const _ = require('../../common/helper');
const logger = require('../../common/logger');
const middlewares = require('../../web/middlewares');

/**
 * The Koa Web Server
 * @param options
 * @param callback
 */
module.exports = function(options, callback) {
  co(function *() {
    var app = koa();

    middlewares(app);
    router(app);

    options.webPort = yield detect(options.webPort);
    app.listen(options.webPort, function() {
      logger.info('Slave Web Server start with options %s %j', EOL, options);
      callback && callback();
    });
  }).catch(function(e) {
    console.error(e);
  });

  // cron task for cleaning temp directory
  cron();
};
