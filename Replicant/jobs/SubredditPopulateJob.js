const {sequelize, createRequester} = require('../db');
const {insertSubreddit, update} = require('./');
/**
 * Populate the Subreddit table with subreddits whose posts made
 * to the top of the day.
 */
module.exports.subredditPopulateJob = async () => {
  try {
    if (sequelize.connectionManager.hasOwnProperty('getConnection')) {
      delete sequelize.connectionManager.getConnection;
    }
    const account = await sequelize.models.Account.findOne(
        {
          where: {
            isSuspended: false,
            isSold: false,
          },
        });
    await update(account);
  } catch (err) {
    console.log(err);
  }
};

/**
 *
 * @param {string[]} subreddits
 * @return {Promise<void>}
 */
module.exports.insertSubreddit = async (subreddits) => {
  for (const subredditName of subreddits) {
    await sequelize.models.Subreddit.findOrCreate({
      where: {name: subredditName.substring(2, subredditName.length)},
    });
  }
};

/**
 *
 * @param {object} account
 * @return {Promise<void>}
 */
module.exports.update = async (account) => {// any reddit account will do.
  const requester = await createRequester(account);
  const subreddits = await requester.getTop({time: 'day'}).
      map((post) => post.subreddit_name_prefixed);
  await insertSubreddit(subreddits);
};
