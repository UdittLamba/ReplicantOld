const {updateAccountKarma} = require('./db');
const {subredditPopulateJob} = require('./jobs/SubredditPopulateJob');
const {fetchTopPostsJob} = require('./jobs/FetchTopPostsJob');
const {schedulePostJobs} = require('./jobs/ScheduleJob');
const {farmKarmaJob} = require('./jobs/FarmKarmaJob');

/**
 *
 * @return {Promise<void>}
 */
module.exports.accountUpdateHandler = async () => {
  await updateAccountKarma();
};

/**
 *
 * @return {Promise<void>}
 */
module.exports.subredditPopulateHandler = async () => {
  await subredditPopulateJob();
};

module.exports.topPostFetchHandler = async () => {
  await fetchTopPostsJob('today');
};

/**
 *
 * @return {Promise<void>}
 */
module.exports.postScheduleHandler = async () => {
  // TODO : convert to manually updatable control values.
  await schedulePostJobs(3, 5);
};

/**
 * @return {Promise<void>}
 */
module.exports.karmaFarmingHandler = async () => {
  await farmKarmaJob();
};
