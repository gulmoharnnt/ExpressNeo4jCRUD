const express = require('express');
const users = require('../routes/users');
const friends = require('../routes/friends');
const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.json());
  app.use('/api/users', users);
  app.use('/api/friends', friends);
  app.use(error);
};
