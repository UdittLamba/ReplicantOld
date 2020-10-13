const tg = require('telegram-bot-api');
require('http').globalAgent.maxSockets = Infinity // play around with the number till the timeout error goes away.

const api = new tg({
    token: process.env.TELEGRAM_TOKEN
})

// Define your message provider
const mp = new tg.GetUpdateMessageProvider()
// Set message provider and start API
api.setMessageProvider(mp)
api.start().catch();
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
        await api.sendMessage({
            chat_id: 1160876508,
            text: hourlyReport,
        })
    } catch (err) {
        console.log(err);
    } finally {
        await api.stop();
    }

}
module.exports = sendKarmaReport;