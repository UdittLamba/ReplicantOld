const {updateAccountKarma} = require('./db');
const dayjs = require('dayjs');
const subredditPopulateJob = require("./jobs/SubredditPopulateJob");
const fetchTopPosts = require("./jobs/FetchTopPostsJob");
const scheduleJob = require("./jobs/ScheduleJob");
const farmKarmaJob = require("./jobs/FarmKarmaJob");

module.exports.botHandler = () => {
    updateAccountKarma().catch((err) => console.log(err));
}

module.exports.updateHandler = () => {
    subredditPopulateJob();
    fetchTopPosts('today');
}

module.exports.postHandler = () => {
    //TODO : convert to manually updatable control values.
    scheduleJob(2,3);
}

module.exports.karmaFarmingHandler = () => {
    farmKarmaJob();
}