const {fetchAccountData} = require('./db');
const dayjs = require('dayjs');
const subredditPopulateJob = require("./jobs/SubredditPopulateJob");
const fetchTopPosts = require("./jobs/FetchTopPostsJob");
const scheduleJob = require("./jobs/ScheduleJob");

module.exports.botHandler = () => {
    if (dayjs().hour() === 23) {
         subredditPopulateJob();
         fetchTopPosts('today');
         scheduleJob(3,3);
    }
    fetchAccountData().catch((err) => console.log(err));
}
