const moment = require('moment');
const Account = require('./models/Account');
const subredditPopulateJob = require("./jobs/SubredditPopulateJob");
const fetchTopPosts = require("./jobs/FetchTopPostsJob");

const handler = () => {
    const acc = new Account();
    if (moment().format("hA") === '12AM') {
        subredditPopulateJob();
        fetchTopPosts('today');
    }
    acc.fetchAccountData().catch((err) => console.log(err));
};

module.exports = {
    handler,
};
