const moment = require('moment');

function formatMessage(name, message) {
  return {
    name,
    message,
    date: moment().format('YYYY-MM-D'),
    time: moment().format('h:mm a')
  };
}

module.exports = formatMessage;
