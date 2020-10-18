const {updateAccountKarma} = require('./db');
const {subredditPopulateJob} = require('./jobs/SubredditPopulateJob');
const {fetchTopPostsJob} = require('./jobs/FetchTopPostsJob');
const {scheduleJob} = require('./jobs/ScheduleJob');
const {farmKarmaJob} = require('./jobs/FarmKarmaJob');

/**
 *
 * @return {Promise<Message>}
 */
module.exports.accountUpdateHandler = async () => {
  try {
    return await updateAccountKarma();
  } catch (e) {
    Error(e);
  }
};

/**
 *
 * @return {Promise<boolean>}
 */
module.exports.subredditPopulateHandler = async () => {
  try {
    return await subredditPopulateJob();
  } catch (e) {
    Error(e);
  }
};
/**
 *
 * @return {Promise<(Model<TModelAttributes, TCreationAttributes>|boolean)[]>}
 */
module.exports.topPostFetchHandler = async () => {
  try {
    return await fetchTopPostsJob('today');
  } catch (e) {
    Error(e);
  }
};

/**
 *
 * @return {Promise<(Model<TModelAttributes, TCreationAttributes>|boolean)[]>}
 */
module.exports.postScheduleHandler = async () => {
  // TODO : convert to manually updatable control values.
  try {
    return await scheduleJob(3, 5);
  } catch (e) {
    Error(e);
  }
};

/**
 * @return {Promise<Message|boolean>}
 */
module.exports.karmaFarmingHandler = async () => {
  try {
    return await farmKarmaJob();
  } catch (e) {
    Error(e);
  }
};
