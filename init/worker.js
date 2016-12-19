'use strict';

const cluster = require('cluster');

const remote = require('../core/slave');
const server = require('../core/server');

if (cluster.isWorker) {
  cluster.worker.on('message', e => {
    switch (e.message) {
      case 'startServer':
        startServer(e.data);
        break;
    }
  });
}

/**
 * Start the remote server and web server
 * Remote Server is used to communicate with master
 * Web Server shows the basic information about the slave machine
 * @param options
 */
function startServer(options) {
  if (options.master) {
    remote(options, function() {
      server(options);
    });
  } else {
    console.log('lack of option master');
  }
}
