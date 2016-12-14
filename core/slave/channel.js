'use strict';

const zmq = require('zmq');
const util = require('util');
const EOL = require('os').EOL;
const Emitter = require('events');

const logger = require('../../common/logger');

/**
 * Create a singleton channel object
 */
module.exports = (function() {
  let instantiated;

  class Channel extends Emitter {
    constructor(options = {}) {
      super();

      this.options = options;
      this.status = 'success';
      this.init();
    }

    init() {
      this.sock = zmq.socket('pair');
      this.sock.bindSync(`tcp://${this.options.ip}:${this.options.port}`);
      this.sock.monitor(500, 0);
      this.sock.on('message', data => {
        try {
          var msg = JSON.parse(data.toString());

          if (msg && msg.type !== 'monitor') {
            logger.debug('%s---> zmq message %s%s', EOL, EOL, data.toString());
          }
          this._handleMessage(msg);
        } catch (e) {
          logger.warn('Bad json data, %s', data);
        }
      });

      this.sock.on('accept', (fd, ep) => { logger.debug(`accept, endpoint: ${ep}`); });
      this.sock.on('accept_error', (fd, ep) => { logger.debug(`accept_error, endpoint: ${ep}`); });
      this.sock.on('close', (fd, ep) => { logger.debug(`close, endpoint: ${ep}`); });
      this.sock.on('close_error', (fd, ep) => { logger.debug(`close_error, endpoint: ${ep}`); });
      this.sock.on('disconnect', () => {
        this.emit('disconnect');
      });
    }

    _handleMessage(msg) {
      switch (msg.type) {
        case 'ack':
          this.emit('ack', msg);
          break;
        case 'task':
          this.emit('task', msg);
          break;
        case 'monitor':
          this.emit('monitor', msg);
          break;
        default:
          break;
      }
    }

    send(data) {
      if (data && data.type !== 'monitor') {
        logger.debug('%s<--- zmq message %s%j', EOL, EOL, data);
      }
      this.sock.send(JSON.stringify(data));
    }

    toString() {
      return '[object Channel]';
    }
  }

  return {
    getInstance: function(args) {
      if (!instantiated) {
        instantiated = new Channel(args);
      }
      return instantiated;
    }
  };
})();
