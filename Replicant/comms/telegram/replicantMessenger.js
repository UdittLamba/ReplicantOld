const Telegram = require('telegraf/telegram')
require('dotenv');
require('http').globalAgent.maxSockets = Infinity // play around with the number till the timeout error goes away.

const telegram = new Telegram(process.env.TELEGRAM_TOKEN)

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
        await telegram.sendMessage( process.env.CHAT_ID, hourlyReport);
    } catch (err) {
        console.log(err);
    }
}

reportSubmission = async (submitter) => {
    try {
        await telegram.sendMessage( process.env.CHAT_ID, submitter+' just posted on reddit!');
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    sendKarmaReport,
    reportSubmission
};