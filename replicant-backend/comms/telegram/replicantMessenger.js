const Telegram = require('telegraf/telegram');
require('dotenv');
// play around with the number till the timeout error goes away.
require('http').globalAgent.maxSockets = Infinity;

const telegram = new Telegram(process.env.TELEGRAM_TOKEN);

/**
 * Base abstracted function to send telegram messages
 * to process.env.CHAT_ID(the chat id defined in the serverless.env.yml file)
 *
 * @param {String} message
 * @return {Promise<void>}
 */
report = async (message) => {
  await telegram.sendMessage(process.env.CHAT_ID, message);
};

// eslint-disable-next-line valid-jsdoc
/**
 * Prepares a telegram report from the accounts array fed into it.
 *
 * @param {String[][]} accounts
 * @return {Promise<void>}
 */
sendKarmaReport = async (accounts) => {
  let hourlyReport = '';
  try {
    accounts.forEach((value) => {
      hourlyReport = hourlyReport +
              value['username'] + '|' +
              '\n ' + 'post karma: ' + value['postKarma'] +
              '\n comment karma: ' + value['commentKarma'] +
              '\n' + '----------------------' + '\n';
    },
    );
    await report(hourlyReport);
  } catch (err) {
  }
};

module.exports = {
  report,
  sendKarmaReport,
};
