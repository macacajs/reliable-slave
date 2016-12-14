'use strict';

const controllers = require('../../web/controllers');

module.exports = function(app) {
  app.get('/', controllers.home);
};
