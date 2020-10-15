const {sequelize, updateAccountKarma} = require('./db');
const subredditPopulateJob = require("./jobs/SubredditPopulateJob");
const fetchTopPostsJob = require("./jobs/FetchTopPostsJob");
const scheduleJob = require("./jobs/ScheduleJob");
const farmKarmaJob = require("./jobs/FarmKarmaJob");0

module.exports.botHandler = async () => {
    await updateAccountKarma();
}

module.exports.updateHandler = async () => {
    await subredditPopulateJob();
    await fetchTopPostsJob('today');
    await sequelize.connectionManager.close();
}

module.exports.postHandler = async () => {
    //TODO : convert to manually updatable control values.
    await scheduleJob(3, 5);
    await sequelize.connectionManager.close();
}

module.exports.karmaFarmingHandler = async () => {
    await farmKarmaJob();
}
