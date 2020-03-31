const express = require('express');
const index = require('../routes/index');
const users = require('../routes/users');
const friends = require('../routes/friends');
const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.json());
  app.use('/', index);
  app.use('/api/users', users);
  app.use('/api/friends', friends);
  app.use(error);
};
