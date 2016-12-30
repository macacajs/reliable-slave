'use strict';

const co = require('co');
const os = require('os');
const koa = require('koa');
const path = require('path');
const cluster = require('cluster');
const program = require('commander');

const _ = require('../common/helper');
const logger = require('../common/logger');

const options = {
  webPort: 8080,
  verbose: false,
  ios: os.platform() === 'darwin',
  port: 4000
};

program
  .option('-p, --port <d>',       `set port for server (default: ${options.port})`)
  .option('-r, --registry <s>',   'set registry for node')
  .option('-m, --master <s>',     'register to pointed master')
  .option('--ios',                `marking whether slave support iOS device (default is ${options.ios}) `)
  .option('--verbose',            'show more debugging information')
  .parse(process.argv);

_.merge(options, _.getConfig(program));

module.exports = function() {
  let clusterId = 0;
  const worker = path.join(__dirname, 'worker.js');

  cluster.setupMaster({
    exec: worker,
    args: process.argv,
    silent: false
  });

  const start = () => {
    cluster.fork();
    clusterId++;
    cluster.workers[clusterId].on('message', function(e) {
      switch (e.message) {
        case 'killMaster':
          process.exit(-1);
          break;
      }
    });
    cluster.workers[clusterId].send({
      message: 'startServer',
      data: options
    });
  };

  cluster
    .on('fork', () => {
      logger.debug('worker fork success');
    })
    .on('online', () => {
      logger.debug('worker online');
    })
    .on('listening', (worker, address) => {
      logger.debug('listening worker id: %d, pid: %d, address: %s:%s', worker.id, worker.process.pid, _.ipv4, address.port);
    })
    .on('disconnect', () => {
      logger.debug('worker disconnect');
      start();
    })
    .on('exit', (worker, code, signal) => {
      logger.debug('worker exit code: %s signal: %s', code, signal || 'null');
    });
  start();
};

process.on('error', err => {
  logger.error('------------ error ------------\n%s', err.stack);
}).on('uncaughtException', err => {
  logger.error('------------ uncaughtException ------------\n%s', err.stack);
}).on('rejectionHandled', err => {
  logger.error('------------ rejectionHandled ------------\n%s', err.stack);
}).on('unhandledRejection', err => {
  logger.error('------------ unhandledRejection ------------\n%s', err.stack);
}).on('warning', warning => {
  logger.warn('------------ warning ------------\n%s', warning.stack);
});
