'use strict';

const _ = require('xutil');

_.timeoutPromise = function(seconds, defaultValue) {
  return new Promise((reslove, reject) => {
    setTimeout(() => {
      reject(defaultValue);
    }, seconds * 1000);
  });
};

module.exports = _;
