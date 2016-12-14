'use strict';

const os = require('os');
const co = require('co');
const zmq = require('zmq');
const EOL = require('os').EOL;
const stream = require('stream');
const detect = require('detect-port');

const Channel = require('./channel');
const taskProcessor = require('../task');
const _ = require('../../common/helper');
const logger = require('../../common/logger');
const request = require('../../common/request');
const getServerInfo = require('../server/monitor');

// There are three statuses in communication
const status = {
  ACK: 'ack',
  AVAILABLE: 'available',
  BUSY: 'busy'
};

/**
 * Register to the master machine with ip and port
 */
function *register(options) {
  let result = yield request({
    uri: options.master,
    form: {
      sysInfo: getServerInfo(),
      ip: options.ip,
      port: options.port,
      supportiOS: options.ios
    },
    method: 'post'
  });

  try {
    result = JSON.parse(result.body);
    return result.status === 'ack';
  } catch (e) {
    return false;
  }
}

/**
 * The Retry method to register to the master
 * @param options
 * @param callback
 */
function reregister(options, callback) {
  co(function *() {
    logger.debug('Zmq Reconnecting...');
    const success = yield register(options);

    if (success) {
      callback();
    } else {
      // Retry after 3s.
      setTimeout(function() {
        reregister(options, callback);
      }, 3000);
    }
  }).catch(function(err) {
    logger.warn(err);
  });
}

/**
 * Connect to the zmq port with formatted data
 * @param channel
 */
function connect(channel) {

  global.__task_status = status.ACK;

  logger.debug('Connected to the master server.');

  setTimeout(function() {
    const data = {
      sysInfo: getServerInfo(),
      type: 'ack',
      data: 'hello master',
      status: 'ack'
    };
    channel.send(data);
  }, 3000);
}

/**
 * Init the zmq communication and register the event listener for different event.
 * @param options
 */
function init(options) {
  const channel = Channel.getInstance(options);

  connect(channel);

  // Delegate the task info when receiving task event.
  channel.on('task', co.wrap(function *(data) {

    yield taskProcessor(data, options);

  }));

  // Send basic info when receiving monitor event.
  channel.on('monitor', function(data) {

    data.sysInfo = getServerInfo();
    data.status = global.__task_status;
    channel.send(data);

  });

  // Reconnect when the zmq is disconnect.
  channel.on('disconnect', co.wrap(function *() {

    if (channel.status === 'ack') {
      logger.debug('disconnect with channel status ack');
      return;
    }
    channel.status = 'ack';
    logger.debug('thread is disconnect');

    reregister(options, function() {
      channel.status = 'success';
      connect(channel);
    });

  }));
}

/**
 * Register to the master and init communicating.
 * @param options
 * @param callback
 */
function main(options, callback) {
  co(function *() {

    if (!~options.master.indexOf('http')) {
      options.master = `http://${options.master}`;
    }

    options.port = global.__port = yield detect(options.port);
    options.ip = _.ipv4;

    logger.debug('slave init with %s %j', EOL, options);
    reregister(options, function() {
      init(options);
      callback();
    });

  }).catch(function(err) {
    logger.warn(err);
  });
}

module.exports = main;
