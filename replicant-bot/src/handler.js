const moment = require('moment');
const acc = require('./models/Account');
const subredditPopulatorJob = require("./jobs/SubredditPopulateJob");
const postJob = require("./jobs/PostJob");

const handler = () => {
    if (moment().format("hA") === '9PM') {
        subredditPopulatorJob();
    }
    postJob(4);
    acc.fetchAccData().catch((err) => console.log(err));
};
handler();

module.exports = {
    handler,
};
