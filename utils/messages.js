const moment = require("moment");

const formatMessage = (username, text) => ({
  username,
  text,
  time: moment().format("DD/MM HH:mm:ss"),
});

module.exports = formatMessage;
