const {sequelize, updateAccountKarma} = require('./db');
const subredditPopulateJob = require("./jobs/SubredditPopulateJob");
const fetchTopPosts = require("./jobs/FetchTopPostsJob");
const scheduleJob = require("./jobs/ScheduleJob");
const farmKarmaJob = require("./jobs/FarmKarmaJob");

module.exports.botHandler = () => {
    updateAccountKarma().catch((err) => console.log(err));
}

module.exports.updateHandler = async () => {
    await subredditPopulateJob();
    await fetchTopPosts('today');
    await sequelize.connectionManager.close();
}

module.exports.postHandler = async () => {
    //TODO : convert to manually updatable control values.
    await scheduleJob(2,3);
    await sequelize.connectionManager.close();
}

module.exports.karmaFarmingHandler = async () => {
    await farmKarmaJob;
    await sequelize.connectionManager.close();
}