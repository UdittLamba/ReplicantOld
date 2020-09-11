const moment = require('moment');
const Account = require('./models/Account');
const subredditPopulateJob = require("./jobs/SubredditPopulateJob");
const postJob = require("./jobs/PostJob");

const handler = () => {
    const acc = new Account();
    if (moment().format("hA") === '12AM') {
        subredditPopulateJob();
    }

    acc.fetchAccountData().catch((err) => console.log(err));
};
//handler();

module.exports = {
    handler,
};
