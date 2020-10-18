const {sequelize, createRequester} = require('../db');

/**
 * Populate the Subreddit table with subreddits whose posts made
 * to the top of the day.
 * @return {Promise<(Model<TModelAttributes, TCreationAttributes>|boolean)[]>}
 */
subredditPopulateJob = async () => {
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
    return await update(account);
  } catch (err) {
    console.log(err);
  }
};

/**
 *
 * @param {string[]} subreddits
 * @return {Promise<[Model<TModelAttributes, TCreationAttributes>, boolean]>}
 */
insertSubreddit = async (subreddits) => {
  for (const subredditName of subreddits) {
    return await sequelize.models.Subreddit.findOrCreate({
      where: {name: subredditName.substring(2, subredditName.length)},
    });
  }
};

/**
 *
 * @param {object} account
 * @return {Promise<(Model<TModelAttributes, TCreationAttributes>|boolean)[]>}
 */
update = async (account) => {// any reddit account will do.
  const requester = await createRequester(account);
  const subreddits = await requester.getTop({time: 'day'}).
      map((post) => post.subreddit_name_prefixed);
  return await insertSubreddit(subreddits);
};

module.exports = {
  subredditPopulateJob,
};
