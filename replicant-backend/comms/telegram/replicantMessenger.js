const Telegram = require('telegraf/telegram');
require('dotenv');
// play around with the number till the timeout error goes away.
require('http').globalAgent.maxSockets = Infinity;

const telegram = new Telegram(process.env.TELEGRAM_TOKEN);

/**
 *
 * @param {String} message
 * @return {Promise<Message>}
 */
report = async (message) => {
  return await telegram.sendMessage(process.env.CHAT_ID, message);
};

// eslint-disable-next-line valid-jsdoc
/**
 * Prepares a telegram report from the accounts array fed into it.
 *
 * @param {String[][]} accounts
 * @return {Promise<Message>}
 */
sendKarmaReport = async (accounts) => {
  let hourlyReport = '';
  accounts.forEach((value) => {
    hourlyReport = hourlyReport +
            value['username'] + '|' +
            '\n ' + 'post karma: ' + value['postKarma'] +
            '\n comment karma: ' + value['commentKarma'] +
            '\n' + '----------------------' + '\n';
  },
  );
  return await report(hourlyReport);
};

module.exports = {
  report,
  sendKarmaReport,
};
