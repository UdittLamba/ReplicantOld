const Telegram = require('telegraf/telegram')
require('dotenv');
require('http').globalAgent.maxSockets = Infinity // play around with the number till the timeout error goes away.

const telegram = new Telegram(process.env.TELEGRAM_TOKEN)

/**
 * Base abstracted function to send telegram messages
 * to process.env.CHAT_ID(the chat id defined in the serveless.env.yml file)
 *
 * @param message
 * @returns {Promise<void>}
 */
report = async (message) => {
    await telegram.sendMessage( process.env.CHAT_ID, message);
}

/**
 * Prepares a telegram report from the accounts array fed into it.
 *
 * @param accounts
 * @returns {Promise<void>}
 */
sendKarmaReport = async (accounts) => {
    let hourlyReport = '';
    try {
        accounts.forEach((value) => {
                hourlyReport = hourlyReport
                    + value['username'] + '|'
                    + '\n ' + 'post karma: ' + value['postKarma']
                    + '\n comment karma: ' + value['commentKarma']
                    + '\n' + '----------------------'+'\n';
            }
        )
        await report(hourlyReport);
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    report,
    sendKarmaReport
};