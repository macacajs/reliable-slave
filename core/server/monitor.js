'use strict';

const os = require('os');

let timestamp = Date.now();
const data = global.sysInfo = calculate();

function uptime() {
  const time = os.uptime();
  const days = parseInt(time / 60 / 60 / 24, 10);
  const hours = parseInt((time - days * 60 * 60 * 24) / 60 / 60, 10);
  const minutes = parseInt((time - days * 60 * 60 * 24 - hours * 60 * 60) / 60, 10);

  return `${days}d ${hours}h ${minutes}m`;
}

function calculate() {
  const data = {};

  data.cpus = os.cpus();
  data.memory = os.freemem() / os.totalmem();
  data.type = os.type();
  data.platform = os.platform();
  data.uptime = uptime();
  data.release = os.release();
  data.hostname = os.hostname();
  data.port = global.__port;

  return data;
}

/**
 * Return the basic computer info
 * @returns {Object} Computer Info
 */
module.exports = function() {
  const newTimestamp = Date.now();
  const diff = newTimestamp - timestamp;

  if (diff < 30000) {
    return data;
  }

  timestamp = newTimestamp;

  return calculate();
};
