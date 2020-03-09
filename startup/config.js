const config = require('config');

module.exports = function() {
  if (!config.get('dbHost')) {
    throw new Error('FATAL ERROR: dbHost is not defined.');
  }
};
