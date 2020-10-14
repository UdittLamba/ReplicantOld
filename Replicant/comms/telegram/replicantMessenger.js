const Telegram = require('telegraf/telegram')
require('dotenv');
require('http').globalAgent.maxSockets = Infinity // play around with the number till the timeout error goes away.

const telegram = new Telegram(/*process.env.TELEGRAM_TOKEN*/'1060251852:AAHSGrs-12kx_SoEYosqa99jUw3K315PnVI')

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
        await telegram.sendMessage( '1160876508', hourlyReport);
    } catch (err) {
        console.log(err);
    }
}

reportSubmission = async (submitter) => {
    try {
        await telegram.sendMessage( /*process.env.CHAT_ID*/'1160876508', submitter+' just posted on reddit!');
    } catch (err) {
        console.log(err);
    }
}
//reportSubmission('uditt').then();
module.exports = {
    sendKarmaReport,
    reportSubmission
};