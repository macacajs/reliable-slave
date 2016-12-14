'use strict';

const killing = require('killing');

/**
 * Listening to the system signal and do task
 * @param signal
 */
module.exports = function(signal) {
  switch (signal) {
    case 'stop':
      killing('reliable-macaca-slave', function(list) {
        if (list.length) {
          console.log('PID %s has been killed', list.join(', '));
        } else {
          console.log('no kill');
        }
      });
      break;
    case 'restart':
      // TODO
      break;
    default:
      console.log('\n  arguments `\u001b[33m%s\u001b[0m` not found', signal || 'undefined');
      break;
  }
};
